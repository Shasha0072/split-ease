'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function createInvite(groupId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Ensure user exists in users table
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.user_metadata?.full_name || null,
      phone: user.user_metadata?.phone || user.phone || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    }, {
      onConflict: 'id',
      ignoreDuplicates: false,
    })

  if (userError) {
    console.error('Error ensuring user exists:', userError)
  }

  // Check if user is admin of the group
  const { data: membership, error: memberError } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()

  if (memberError || !membership) {
    return { error: 'Not a member of this group' }
  }

  if (membership.role !== 'admin') {
    return { error: 'Not authorized - Admin only' }
  }

  // Generate unique invite code
  let inviteCode: string
  let isUnique = false
  let attempts = 0
  const maxAttempts = 5

  while (!isUnique && attempts < maxAttempts) {
    inviteCode = randomBytes(8).toString('base64url')

    // Check if code already exists
    const { data: existing } = await supabase
      .from('group_invites')
      .select('id')
      .eq('invite_code', inviteCode)
      .single()

    if (!existing) {
      isUnique = true
    }
    attempts++
  }

  if (!isUnique) {
    return { error: 'Failed to generate unique invite code. Please try again.' }
  }

  // Set expires_at to 10 years in future (effectively never expires)
  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 10)

  // Create invite
  const { data: invite, error: inviteError } = await supabase
    .from('group_invites')
    .insert({
      group_id: groupId,
      invite_code: inviteCode!,
      created_by: user.id,
      expires_at: expiresAt.toISOString(),
      max_uses: null, // Unlimited uses
      is_active: true,
    })
    .select()
    .single()

  if (inviteError) {
    return { error: inviteError.message }
  }

  // Log to activity feed
  await supabase.from('activity_feed').insert({
    group_id: groupId,
    user_id: user.id,
    action_type: 'group_created', // Reusing existing type
    description: `${user.user_metadata?.name || user.email} created an invite link`,
  })

  revalidatePath(`/groups/${groupId}`)
  return { success: true, invite }
}

export async function getGroupInvites(groupId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', invites: [] }
  }

  // Check if user is member of the group
  const { data: membership, error: memberError } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()

  if (memberError || !membership) {
    return { error: 'Not a member of this group', invites: [] }
  }

  // Get active invites with creator info
  const { data: invites, error } = await supabase
    .from('group_invites')
    .select(`
      id,
      invite_code,
      created_by,
      expires_at,
      current_uses,
      created_at,
      creator:users!group_invites_created_by_fkey(
        id,
        name,
        email
      )
    `)
    .eq('group_id', groupId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message, invites: [] }
  }

  return { invites: invites || [], error: null }
}

export async function deactivateInvite(inviteId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get invite to find group_id
  const { data: invite, error: inviteError } = await supabase
    .from('group_invites')
    .select('group_id')
    .eq('id', inviteId)
    .single()

  if (inviteError || !invite) {
    return { error: 'Invite not found' }
  }

  // Check if user is admin of the group
  const { data: membership, error: memberError } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', invite.group_id)
    .eq('user_id', user.id)
    .single()

  if (memberError || !membership) {
    return { error: 'Not a member of this group' }
  }

  if (membership.role !== 'admin') {
    return { error: 'Not authorized - Admin only' }
  }

  // Deactivate invite
  const { error: updateError } = await supabase
    .from('group_invites')
    .update({ is_active: false })
    .eq('id', inviteId)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath(`/groups/${invite.group_id}`)
  return { error: null }
}

export async function acceptInvite(inviteCode: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Ensure user exists in users table
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.user_metadata?.full_name || null,
      phone: user.user_metadata?.phone || user.phone || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    }, {
      onConflict: 'id',
      ignoreDuplicates: false,
    })

  if (userError) {
    console.error('Error ensuring user exists:', userError)
  }

  // Find invite by code
  const { data: invite, error: inviteError } = await supabase
    .from('group_invites')
    .select('id, group_id, is_active, expires_at, current_uses')
    .eq('invite_code', inviteCode)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (inviteError || !invite) {
    return { error: 'Invalid or expired invite' }
  }

  // Check if user is already a member
  const { data: existingMember } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', invite.group_id)
    .eq('user_id', user.id)
    .single()

  if (existingMember) {
    return { error: 'Already a member', groupId: invite.group_id }
  }

  // Add user as member
  const { error: memberError } = await supabase
    .from('group_members')
    .insert({
      group_id: invite.group_id,
      user_id: user.id,
      role: 'member',
    })

  if (memberError) {
    return { error: memberError.message }
  }

  // Increment current_uses (handle null case)
  const currentUses = invite.current_uses ?? 0
  const { error: updateError } = await supabase
    .from('group_invites')
    .update({ current_uses: currentUses + 1 })
    .eq('id', invite.id)

  if (updateError) {
    console.error('Error incrementing invite uses:', updateError)
  }

  // Log to activity feed
  await supabase.from('activity_feed').insert({
    group_id: invite.group_id,
    user_id: user.id,
    action_type: 'user_joined',
    description: `${user.user_metadata?.name || user.email} joined the group via invite`,
  })

  // Don't use revalidatePath here - it causes errors in server components
  // The redirect will handle the navigation
  return { success: true, groupId: invite.group_id }
}

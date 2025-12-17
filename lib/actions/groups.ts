'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createGroup(formData: FormData) {
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

  const name = formData.get('name') as string
  const type = formData.get('type') as 'household' | 'trip' | 'event'
  const description = formData.get('description') as string | null

  // Create the group
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({
      name,
      type,
      description,
      created_by: user.id,
    })
    .select()
    .single()

  if (groupError) {
    return { error: groupError.message }
  }

  // Add creator as admin member
  const { error: memberError } = await supabase.from('group_members').insert({
    group_id: group.id,
    user_id: user.id,
    role: 'admin',
  })

  if (memberError) {
    return { error: memberError.message }
  }

  // Create activity feed entry
  await supabase.from('activity_feed').insert({
    group_id: group.id,
    user_id: user.id,
    action_type: 'group_created',
    description: `${user.user_metadata?.name || user.email} created the group`,
  })

  revalidatePath('/groups')
  redirect('/groups')
}

export async function getGroups() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', groups: [] }
  }

  // Ensure user exists in users table
  await supabase
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

  // Get all groups where user is a member
  const { data: memberGroups, error } = await supabase
    .from('group_members')
    .select(
      `
      group_id,
      role,
      groups (
        id,
        name,
        type,
        description,
        is_archived,
        created_at,
        created_by
      )
    `
    )
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message, groups: [] }
  }

  // Transform the data
  const groups = memberGroups
    .map((mg: any) => ({
      ...mg.groups,
      user_role: mg.role,
    }))
    .filter((g: any) => !g.is_archived)

  return { groups, error: null }
}

export async function getGroup(groupId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', group: null }
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return { error: 'Not authorized', group: null }
  }

  // Get group details
  const { data: group, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single()

  if (error) {
    return { error: error.message, group: null }
  }

  return { group: { ...group, user_role: membership.role }, error: null }
}

export async function updateGroup(groupId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user is admin
  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'admin') {
    return { error: 'Not authorized - Admin only' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string | null

  const { error } = await supabase
    .from('groups')
    .update({ name, description })
    .eq('id', groupId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/groups/${groupId}`)
  return { error: null }
}

export async function archiveGroup(groupId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user is admin
  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'admin') {
    return { error: 'Not authorized - Admin only' }
  }

  const { error } = await supabase
    .from('groups')
    .update({ is_archived: true, archived_at: new Date().toISOString() })
    .eq('id', groupId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/groups')
  redirect('/groups')
}

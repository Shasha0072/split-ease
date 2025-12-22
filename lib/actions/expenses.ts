'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createExpense(groupId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
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

  // Verify user is a member of the group
  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return { error: 'Not authorized - You are not a member of this group' }
  }

  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const category = formData.get('category') as string
  const date = formData.get('date') as string

  // Get all group members for equal split
  const { data: members, error: membersError } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', groupId)

  if (membersError || !members || members.length === 0) {
    return { error: 'Failed to get group members' }
  }

  // Calculate equal split amount
  const splitAmount = amount / members.length

  // Create the expense
  const { data: expense, error: expenseError } = await supabase
    .from('expenses')
    .insert({
      group_id: groupId,
      description,
      amount,
      category,
      date: date || new Date().toISOString(),
      paid_by_user_id: user.id,
      created_by: user.id,
      split_type: 'equal',
    })
    .select()
    .single()

  if (expenseError) {
    return { error: expenseError.message }
  }

  // Create expense splits for all members (equal split)
  const splits = members.map((member) => ({
    expense_id: expense.id,
    user_id: member.user_id,
    amount_owed: splitAmount,
    amount_settled: member.user_id === user.id ? splitAmount : 0, // Payer is already settled
    is_fully_settled: member.user_id === user.id,
  }))

  const { error: splitsError } = await supabase
    .from('expense_splits')
    .insert(splits)

  if (splitsError) {
    return { error: splitsError.message }
  }

  // Create activity feed entry
  await supabase.from('activity_feed').insert({
    group_id: groupId,
    user_id: user.id,
    action_type: 'expense_added',
    description: `${user.user_metadata?.name || user.email} added expense: ${description} (₹${amount})`,
  })

  revalidatePath(`/groups/${groupId}`)
  redirect(`/groups/${groupId}`)
}

export async function getGroupExpenses(groupId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', expenses: [] }
  }

  // Verify user is a member
  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return { error: 'Not authorized', expenses: [] }
  }

  // Get expenses with payer info
  const { data: expenses, error } = await supabase
    .from('expenses')
    .select(`
      *,
      paidBy:users!expenses_paid_by_user_id_fkey (
        id,
        name,
        email,
        avatar_url
      )
    `)
    .eq('group_id', groupId)
    .eq('is_deleted', false)
    .order('date', { ascending: false })

  if (error) {
    return { error: error.message, expenses: [] }
  }

  // Transform the data to ensure paidBy is always an object
  const transformedExpenses = expenses?.map((expense: any) => ({
    ...expense,
    paidBy: Array.isArray(expense.paidBy) ? expense.paidBy[0] : expense.paidBy
  })) || []

  return { expenses: transformedExpenses, error: null }
}

export async function getGroupBalances(groupId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', balances: [] }
  }

  // Verify user is a member
  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return { error: 'Not authorized', balances: [] }
  }

  // Get all expense splits for this group
  const { data: splits, error: splitsError } = await supabase
    .from('expense_splits')
    .select(`
      *,
      expense:expense_id (
        id,
        paid_by_user_id,
        is_deleted
      ),
      user:user_id (
        id,
        name,
        email,
        avatar_url
      )
    `)
    .eq('expense.group_id', groupId)
    .eq('expense.is_deleted', false)

  if (splitsError) {
    return { error: splitsError.message, balances: [] }
  }

  // Calculate balances: who owes whom
  const balanceMap: { [key: string]: number } = {}

  splits?.forEach((split: any) => {
    const expense = split.expense
    if (!expense || expense.is_deleted) return

    const owedBy = split.user_id
    const paidBy = expense.paid_by_user_id
    const amountOwed = split.amount_owed - split.amount_settled

    if (owedBy === paidBy || amountOwed === 0) return

    // Create a key for the relationship
    const key = owedBy < paidBy ? `${owedBy}:${paidBy}` : `${paidBy}:${owedBy}`

    if (!balanceMap[key]) {
      balanceMap[key] = 0
    }

    // If owedBy < paidBy, positive means first person owes second
    // If paidBy < owedBy, negative means second person owes first
    if (owedBy < paidBy) {
      balanceMap[key] += amountOwed
    } else {
      balanceMap[key] -= amountOwed
    }
  })

  // Convert balance map to array with user details
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, avatar_url')
    .in('id', Object.keys(balanceMap).flatMap(k => k.split(':')))

  const userMap = new Map(users?.map(u => [u.id, u]) || [])

  const balances = Object.entries(balanceMap)
    .filter(([_, amount]) => Math.abs(amount) > 0.01) // Filter out near-zero balances
    .map(([key, amount]) => {
      const [user1Id, user2Id] = key.split(':')
      const user1 = userMap.get(user1Id)
      const user2 = userMap.get(user2Id)

      // Skip if either user is missing
      if (!user1 || !user2) return null

      // Determine who owes whom
      const owesUser = amount > 0 ? user1 : user2
      const owedUser = amount > 0 ? user2 : user1

      return {
        owes_user: owesUser,
        owed_user: owedUser,
        amount: Math.abs(amount),
      }
    })
    .filter((balance): balance is NonNullable<typeof balance> => balance !== null)
    .sort((a, b) => b.amount - a.amount)

  return { balances, error: null }
}

export async function updateExpense(expenseId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get expense details
  const { data: expense, error: expenseError } = await supabase
    .from('expenses')
    .select('id, group_id, created_by, amount, paid_by_user_id')
    .eq('id', expenseId)
    .eq('is_deleted', false)
    .single()

  if (expenseError || !expense) {
    return { error: 'Expense not found' }
  }

  // Check authorization: creator OR admin
  const isCreator = expense.created_by === user.id

  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', expense.group_id)
    .eq('user_id', user.id)
    .single()

  const isAdmin = membership?.role === 'admin'

  if (!isCreator && !isAdmin) {
    return { error: 'Not authorized - Only creator or admin can edit' }
  }

  // Extract form data
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const category = formData.get('category') as string
  const date = formData.get('date') as string

  // Check if amount changed - if so, recalculate splits
  const amountChanged = Math.abs(amount - expense.amount) > 0.01

  if (amountChanged) {
    // Get all group members for recalculation
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', expense.group_id)

    if (membersError || !members || members.length === 0) {
      return { error: 'Failed to get group members' }
    }

    // Calculate new split amount
    const splitAmount = amount / members.length

    // Delete old splits
    await supabase
      .from('expense_splits')
      .delete()
      .eq('expense_id', expenseId)

    // Create new splits
    const splits = members.map((member) => ({
      expense_id: expenseId,
      user_id: member.user_id,
      amount_owed: splitAmount,
      amount_settled: member.user_id === expense.paid_by_user_id ? splitAmount : 0,
      is_fully_settled: member.user_id === expense.paid_by_user_id,
    }))

    const { error: splitsError } = await supabase
      .from('expense_splits')
      .insert(splits)

    if (splitsError) {
      return { error: splitsError.message }
    }
  }

  // Update expense
  const { error: updateError } = await supabase
    .from('expenses')
    .update({
      description,
      amount,
      category,
      date: date || new Date().toISOString(),
    })
    .eq('id', expenseId)

  if (updateError) {
    return { error: updateError.message }
  }

  // Log to activity feed
  await supabase.from('activity_feed').insert({
    group_id: expense.group_id,
    user_id: user.id,
    action_type: 'expense_updated',
    description: `${user.user_metadata?.name || user.email} updated expense: ${description}`,
  })

  revalidatePath(`/groups/${expense.group_id}`)
  redirect(`/groups/${expense.group_id}`)
}

export async function deleteExpense(expenseId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get expense details
  const { data: expense, error: expenseError } = await supabase
    .from('expenses')
    .select('id, group_id, created_by, description')
    .eq('id', expenseId)
    .eq('is_deleted', false)
    .single()

  if (expenseError || !expense) {
    return { error: 'Expense not found' }
  }

  // Check authorization: creator OR admin
  const isCreator = expense.created_by === user.id

  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', expense.group_id)
    .eq('user_id', user.id)
    .single()

  const isAdmin = membership?.role === 'admin'

  if (!isCreator && !isAdmin) {
    return { error: 'Not authorized - Only creator or admin can delete' }
  }

  // Soft delete: set is_deleted = true
  const { error: deleteError } = await supabase
    .from('expenses')
    .update({ is_deleted: true })
    .eq('id', expenseId)

  if (deleteError) {
    return { error: deleteError.message }
  }

  // Log to activity feed
  await supabase.from('activity_feed').insert({
    group_id: expense.group_id,
    user_id: user.id,
    action_type: 'expense_deleted',
    description: `${user.user_metadata?.name || user.email} deleted expense: ${expense.description}`,
  })

  revalidatePath(`/groups/${expense.group_id}`)
  return { error: null }
}

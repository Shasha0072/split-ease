import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getGroup } from '@/lib/actions/groups'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MobileLayout } from '@/components/layout/mobile-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseForm } from '@/components/features/expenses/expense-form'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string; expenseId: string }>
}) {
  const { id, expenseId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const userData = {
    email: user.email,
    name: user.user_metadata?.name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
  }

  const { group, error: groupError } = await getGroup(id)

  if (groupError || !group) {
    redirect('/groups')
  }

  // Fetch the expense
  const { data: expense, error: expenseError } = await supabase
    .from('expenses')
    .select('id, description, amount, category, date, created_by, group_id')
    .eq('id', expenseId)
    .eq('is_deleted', false)
    .single()

  if (expenseError || !expense) {
    redirect(`/groups/${id}`)
  }

  // Check authorization: creator OR admin
  const isCreator = expense.created_by === user.id

  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', id)
    .eq('user_id', user.id)
    .single()

  const isAdmin = membership?.role === 'admin'

  if (!isCreator && !isAdmin) {
    return (
      <>
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <DashboardLayout user={userData}>
            <div className="max-w-2xl mx-auto space-y-6 mt-8">
              <Alert variant="error">
                You are not authorized to edit this expense. Only the creator or
                group admin can edit expenses.
              </Alert>
              <Link
                href={`/groups/${id}`}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                Back to Group
              </Link>
            </div>
          </DashboardLayout>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <MobileLayout>
            <div className="space-y-4 p-4">
              <Alert variant="error">
                You are not authorized to edit this expense.
              </Alert>
              <Link
                href={`/groups/${id}`}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                Back to Group
              </Link>
            </div>
          </MobileLayout>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DashboardLayout user={userData}>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <Link
                href={`/groups/${id}`}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to {group.name}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Expense
              </h1>
              <p className="text-gray-600">
                Update expense details for your group
              </p>
            </div>

            {/* Form Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseForm
                  groupId={id}
                  expense={{
                    id: expense.id,
                    description: expense.description,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout>
          <div className="space-y-4 p-4">
            {/* Header */}
            <div>
              <Link
                href={`/groups/${id}`}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-3"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Edit Expense
              </h1>
              <p className="text-gray-600 text-sm">Update for {group.name}</p>
            </div>

            {/* Form Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expense Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseForm
                  groupId={id}
                  expense={{
                    id: expense.id,
                    description: expense.description,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </MobileLayout>
      </div>
    </>
  )
}

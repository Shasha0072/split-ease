import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getGroup } from '@/lib/actions/groups'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MobileLayout } from '@/components/layout/mobile-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseForm } from '@/components/features/expenses/expense-form'
import Link from 'next/link'

export default async function NewExpensePage({ params }: { params: { id: string } }) {
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

  const { group, error: groupError } = await getGroup(params.id)

  if (groupError || !group) {
    redirect('/groups')
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
                href={`/groups/${params.id}`}
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
                Add New Expense
              </h1>
              <p className="text-gray-600">
                Add an expense to split with your group members
              </p>
            </div>

            {/* Form Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseForm groupId={params.id} />
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
                href={`/groups/${params.id}`}
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
                Add New Expense
              </h1>
              <p className="text-gray-600 text-sm">
                Split with {group.name}
              </p>
            </div>

            {/* Form Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expense Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseForm groupId={params.id} />
              </CardContent>
            </Card>
          </div>
        </MobileLayout>
      </div>
    </>
  )
}

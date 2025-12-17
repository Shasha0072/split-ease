import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getGroup } from '@/lib/actions/groups'
import { getGroupExpenses, getGroupBalances } from '@/lib/actions/expenses'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MobileLayout } from '@/components/layout/mobile-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import Link from 'next/link'

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
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
  const { expenses } = await getGroupExpenses(params.id)
  const { balances } = await getGroupBalances(params.id)

  if (groupError || !group) {
    redirect('/groups')
  }

  const groupTypeLabels = {
    household: 'Household',
    trip: 'Trip',
    event: 'Event',
  }

  const groupTypeColors = {
    household: 'bg-blue-100 text-blue-800',
    trip: 'bg-green-100 text-green-800',
    event: 'bg-purple-100 text-purple-800',
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DashboardLayout user={userData}>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href="/groups"
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
                  Back to Groups
                </Link>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                  <Badge className={groupTypeColors[group.type as keyof typeof groupTypeColors]}>
                    {groupTypeLabels[group.type as keyof typeof groupTypeLabels]}
                  </Badge>
                </div>
                {group.description && (
                  <p className="text-gray-600 mt-2">{group.description}</p>
                )}
              </div>
              <Link href={`/groups/${params.id}/expenses/new`}>
                <Button size="lg">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Expense
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Balances Section */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Balances</CardTitle>
                    <CardDescription>Who owes whom</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {balances.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm">All settled up!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {balances.map((balance: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={balance.owes_user.avatar_url}
                                alt={balance.owes_user.name || balance.owes_user.email}
                                size="sm"
                              />
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">
                                  {balance.owes_user.name || balance.owes_user.email}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  owes {balance.owed_user.name || balance.owed_user.email}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-red-600">
                              ₹{balance.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Expenses Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Expenses</CardTitle>
                    <CardDescription>All group expenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {expenses.length === 0 ? (
                      <div className="text-center py-12">
                        <svg
                          className="w-16 h-16 mx-auto text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
                          />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No expenses yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Start by adding your first expense to track group spending
                        </p>
                        <Link href={`/groups/${params.id}/expenses/new`}>
                          <Button size="lg">Add First Expense</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {expenses.map((expense: any) => (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                                  <span className="text-primary font-semibold">
                                    ₹
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900">{expense.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge size="sm" variant="outline">{expense.category}</Badge>
                                  <span className="text-xs text-gray-500">
                                    {new Date(expense.date).toLocaleDateString()}
                                  </span>
                                </div>
                                {expense.paidBy && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Avatar
                                      src={expense.paidBy.avatar_url}
                                      alt={expense.paidBy.name || expense.paidBy.email}
                                      size="xs"
                                    />
                                    <span className="text-xs text-gray-600">
                                      Paid by {expense.paidBy.name || expense.paidBy.email}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  ₹{expense.amount.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">Equal split</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
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
                href="/groups"
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
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
                <Badge size="sm" className={groupTypeColors[group.type as keyof typeof groupTypeColors]}>
                  {groupTypeLabels[group.type as keyof typeof groupTypeLabels]}
                </Badge>
              </div>
              {group.description && (
                <p className="text-gray-600 text-sm">{group.description}</p>
              )}
            </div>

            {/* Add Expense Button */}
            <Link href={`/groups/${params.id}/expenses/new`}>
              <Button className="w-full" size="lg">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Expense
              </Button>
            </Link>

            {/* Balances */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Balances</CardTitle>
              </CardHeader>
              <CardContent>
                {balances.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p className="text-sm">All settled up!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {balances.map((balance: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={balance.owes_user.avatar_url}
                            alt={balance.owes_user.name || balance.owes_user.email}
                            size="sm"
                          />
                          <div className="text-xs">
                            <p className="font-medium text-gray-900">
                              {balance.owes_user.name || balance.owes_user.email}
                            </p>
                            <p className="text-gray-500">
                              owes {balance.owed_user.name || balance.owed_user.email}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-red-600 text-sm">
                          ₹{balance.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-600 mb-4">
                      No expenses yet
                    </p>
                    <Link href={`/groups/${params.id}/expenses/new`}>
                      <Button>Add First Expense</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((expense: any) => (
                      <div
                        key={expense.id}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-gray-900 text-sm">{expense.description}</p>
                          <p className="text-base font-bold text-gray-900">
                            ₹{expense.amount.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge size="sm" variant="outline">{expense.category}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                        </div>
                        {expense.paidBy && (
                          <div className="flex items-center gap-2 mt-2">
                            <Avatar
                              src={expense.paidBy.avatar_url}
                              alt={expense.paidBy.name || expense.paidBy.email}
                              size="xs"
                            />
                            <span className="text-xs text-gray-600">
                              Paid by {expense.paidBy.name || expense.paidBy.email}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </MobileLayout>
      </div>
    </>
  )
}

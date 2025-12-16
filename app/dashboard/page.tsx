import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MobileLayout } from '@/components/layout/mobile-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { SignOutButton } from './sign-out-button'

export default async function DashboardPage() {
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

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DashboardLayout user={userData}>
          <div className="space-y-6">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back!
              </h1>
              <p className="text-gray-600">
                Here's an overview of your expenses and settlements
              </p>
            </div>

            {/* Balance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="elevated">
                <CardHeader>
                  <CardDescription>You Owe</CardDescription>
                  <CardTitle className="text-danger text-3xl">₹0</CardTitle>
                </CardHeader>
              </Card>
              <Card variant="elevated">
                <CardHeader>
                  <CardDescription>You're Owed</CardDescription>
                  <CardTitle className="text-success text-3xl">₹0</CardTitle>
                </CardHeader>
              </Card>
              <Card variant="elevated">
                <CardHeader>
                  <CardDescription>Net Balance</CardDescription>
                  <CardTitle className="text-gray-900 text-3xl">₹0</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-2xl">₹0</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Your Share</CardDescription>
                  <CardTitle className="text-2xl">₹0</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Active Groups</CardDescription>
                  <CardTitle className="text-2xl">0</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Unsettled</CardDescription>
                  <CardTitle className="text-2xl">0</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Groups</CardTitle>
                  <CardDescription>
                    Create and manage your expense groups
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">Coming Soon</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expenses</CardTitle>
                  <CardDescription>
                    Track and split expenses with ease
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">Coming Soon</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Settlements</CardTitle>
                  <CardDescription>
                    Settle up with your flatmates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">Coming Soon</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </DashboardLayout>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout>
          <div className="space-y-4 p-4">
            {/* Welcome Section */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome back!
              </h1>
              <p className="text-gray-600 text-sm">
                Here's an overview of your expenses
              </p>
            </div>

            {/* Balance Summary - Mobile */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs">You Owe</CardDescription>
                  <CardTitle className="text-danger text-2xl">₹0</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs">You're Owed</CardDescription>
                  <CardTitle className="text-success text-2xl">₹0</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Link href="/expenses/new" className="flex-1">
                <Button className="w-full" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Expense
                </Button>
              </Link>
              <Link href="/settle" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Settle Up
                </Button>
              </Link>
            </div>

            {/* Quick Stats - Mobile */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">This Month</CardDescription>
                  <CardTitle className="text-lg">₹0</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Groups</CardDescription>
                  <CardTitle className="text-lg">0</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Feature Cards - Mobile */}
            <div className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Groups</CardTitle>
                  <CardDescription className="text-sm">
                    Create and manage your expense groups
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" size="sm">Coming Soon</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Expenses</CardTitle>
                  <CardDescription className="text-sm">
                    Track and split expenses with ease
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" size="sm">Coming Soon</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Settlements</CardTitle>
                  <CardDescription className="text-sm">
                    Settle up with your flatmates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" size="sm">Coming Soon</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </MobileLayout>
      </div>
    </>
  )
}

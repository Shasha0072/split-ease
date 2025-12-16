import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MobileLayout } from '@/components/layout/mobile-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GroupForm } from '@/components/features/groups/group-form'
import Link from 'next/link'

export default async function NewGroupPage() {
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
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <Link
                href="/groups"
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
                Back to Groups
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create New Group
              </h1>
              <p className="text-gray-600">
                Set up a new group to track shared expenses with your flatmates,
                friends, or travel companions
              </p>
            </div>

            {/* Form Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Group Details</CardTitle>
              </CardHeader>
              <CardContent>
                <GroupForm />
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">
                      After creating your group:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>You'll be automatically added as an admin</li>
                      <li>You can invite members by sharing the group link</li>
                      <li>Start adding expenses and splitting costs</li>
                      <li>Track balances and settle up with members</li>
                    </ul>
                  </div>
                </div>
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Create New Group
              </h1>
              <p className="text-gray-600 text-sm">
                Set up a new group to track shared expenses
              </p>
            </div>

            {/* Form Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Group Details</CardTitle>
              </CardHeader>
              <CardContent>
                <GroupForm />
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-xs text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">
                      After creating your group:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>You'll be automatically added as an admin</li>
                      <li>Invite members by sharing the group link</li>
                      <li>Start adding and splitting expenses</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </MobileLayout>
      </div>
    </>
  )
}

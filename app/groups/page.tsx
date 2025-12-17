import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getGroups } from '@/lib/actions/groups'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MobileLayout } from '@/components/layout/mobile-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function GroupsPage() {
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

  const { groups, error } = await getGroups()

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Groups</h1>
                <p className="text-gray-600">
                  Manage your expense groups and collaborations
                </p>
              </div>
              <Link href="/groups/new">
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
                  Create Group
                </Button>
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Groups Grid */}
            {groups.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="max-w-md mx-auto">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No groups yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create your first group to start tracking shared expenses with
                      your flatmates, friends, or travel companions.
                    </p>
                    <Link href="/groups/new">
                      <Button size="lg">Create Your First Group</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group: any) => (
                  <Link key={group.id} href={`/groups/${group.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-xl">{group.name}</CardTitle>
                          <Badge
                            className={groupTypeColors[group.type as keyof typeof groupTypeColors]}
                          >
                            {groupTypeLabels[group.type as keyof typeof groupTypeLabels]}
                          </Badge>
                        </div>
                        {group.description && (
                          <CardDescription className="line-clamp-2">
                            {group.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {group.user_role === 'admin' ? (
                              <Badge variant="outline">Admin</Badge>
                            ) : (
                              <Badge variant="outline">Member</Badge>
                            )}
                          </span>
                          <span className="text-gray-500">
                            {new Date(group.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </DashboardLayout>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout>
          <div className="space-y-4 p-4">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Groups</h1>
              <p className="text-gray-600 text-sm">
                Manage your expense groups
              </p>
            </div>

            {/* Create Button */}
            <Link href="/groups/new">
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
                Create Group
              </Button>
            </Link>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Groups List */}
            {groups.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No groups yet
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Create your first group to start tracking expenses
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {groups.map((group: any) => (
                  <Link key={group.id} href={`/groups/${group.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-1">
                          <CardTitle className="text-base">{group.name}</CardTitle>
                          <Badge
                            size="sm"
                            className={groupTypeColors[group.type as keyof typeof groupTypeColors]}
                          >
                            {groupTypeLabels[group.type as keyof typeof groupTypeLabels]}
                          </Badge>
                        </div>
                        {group.description && (
                          <CardDescription className="text-sm line-clamp-1">
                            {group.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            {group.user_role === 'admin' ? (
                              <Badge variant="outline" size="sm">Admin</Badge>
                            ) : (
                              <Badge variant="outline" size="sm">Member</Badge>
                            )}
                          </span>
                          <span className="text-gray-500">
                            {new Date(group.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </MobileLayout>
      </div>
    </>
  )
}

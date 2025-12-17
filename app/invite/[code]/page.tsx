import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { acceptInvite } from '@/lib/actions/invites'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'

export default async function InviteAcceptPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch invite details (public query allowed by RLS)
  const { data: invite, error: fetchError } = await supabase
    .from('group_invites')
    .select('*, groups(id, name, type)')
    .eq('invite_code', code)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single()

  // Invalid or expired invite
  if (fetchError || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Invalid Invite</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="error" className="mb-4">
              This invite link is invalid or has expired.
            </Alert>
            <p className="text-gray-600 mb-4">
              Please ask the group admin for a new invite link.
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Not logged in - redirect to login with return URL
  if (!user) {
    redirect(`/login?redirect=/invite/${code}`)
  }

  // User is logged in - attempt to join group
  const result = await acceptInvite(code)

  if (result?.error) {
    // Already a member - redirect to group
    if (result.error.includes('Already a member') && result.groupId) {
      redirect(`/groups/${result.groupId}`)
    }

    // Other error - show error page
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Unable to Join Group</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="error" className="mb-4">
              {result.error}
            </Alert>
            <p className="text-gray-600 mb-4">
              There was an issue joining the group. Please try again or contact
              the group admin.
            </p>
            <Link
              href="/groups"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go to My Groups
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success - redirect to group
  if (result?.groupId) {
    redirect(`/groups/${result.groupId}`)
  }

  // Fallback - should not reach here
  redirect('/groups')
}

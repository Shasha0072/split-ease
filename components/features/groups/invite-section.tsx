'use client'

import { useState, useEffect } from 'react'
import { createInvite, getGroupInvites, deactivateInvite } from '@/lib/actions/invites'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface InviteSectionProps {
  groupId: string
  isAdmin: boolean
}

interface Invite {
  id: string
  invite_code: string
  created_at: string
  current_uses: number
  creator: {
    name: string | null
    email: string
  }
}

export function InviteSection({ groupId, isAdmin }: InviteSectionProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [invites, setInvites] = useState<Invite[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  // Fetch invites on mount
  useEffect(() => {
    if (isAdmin) {
      loadInvites()
    }
  }, [groupId, isAdmin])

  async function loadInvites() {
    const result = await getGroupInvites(groupId)
    if (result.error) {
      setError(result.error)
    } else {
      setInvites(result.invites as Invite[])
    }
  }

  async function handleCreateInvite() {
    setLoading(true)
    setError(null)

    const result = await createInvite(groupId)

    if (result?.error) {
      setError(result.error)
    } else {
      await loadInvites() // Refresh list
    }

    setLoading(false)
  }

  async function handleCopyLink(inviteCode: string) {
    const url = `${window.location.origin}/invite/${inviteCode}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(inviteCode)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      setError('Failed to copy to clipboard')
    }
  }

  async function handleDeactivate(inviteId: string) {
    if (!confirm('Deactivate this invite link? It will no longer work.')) {
      return
    }

    const result = await deactivateInvite(inviteId)

    if (result?.error) {
      setError(result.error)
    } else {
      await loadInvites() // Refresh list
    }
  }

  if (!isAdmin) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        <Button
          onClick={handleCreateInvite}
          disabled={loading}
          isLoading={loading}
          className="mb-4"
        >
          Generate Invite Link
        </Button>

        {invites.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-2">Active invite links:</p>
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="border rounded-lg p-3 bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-gray-500">
                        Created by {invite.creator.name || invite.creator.email}
                      </p>
                      <Badge variant="outline" size="sm">
                        {invite.current_uses} {invite.current_uses === 1 ? 'use' : 'uses'}
                      </Badge>
                    </div>
                    <p className="text-sm font-mono text-gray-700 break-all">
                      {window.location.origin}/invite/{invite.invite_code}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created {new Date(invite.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyLink(invite.invite_code)}
                    >
                      {copied === invite.invite_code ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeactivate(invite.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Deactivate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {invites.length === 0 && !loading && (
          <p className="text-sm text-gray-500 mt-2">
            No active invites. Generate a link to invite members.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { updatePassword } from '@/lib/actions/auth'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

export default function ConfirmResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const result = await updatePassword(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Enter your new password below"
    >
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      <form action={handleSubmit} className="space-y-5">
        <Input
          id="password"
          name="password"
          type="password"
          label="New Password"
          placeholder="••••••••"
          required
          minLength={6}
          disabled={loading}
          autoComplete="new-password"
          helperText="Must be at least 6 characters"
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          placeholder="••••••••"
          required
          minLength={6}
          disabled={loading}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
          isLoading={loading}
        >
          Update Password
        </Button>
      </form>
    </AuthLayout>
  )
}

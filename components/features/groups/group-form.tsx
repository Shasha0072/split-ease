'use client'

import { useState } from 'react'
import { createGroup } from '@/lib/actions/groups'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

export function GroupForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await createGroup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      <form action={handleSubmit} className="space-y-6">
        <Input
          id="name"
          name="name"
          type="text"
          label="Group Name"
          placeholder="e.g., Flat 402, Goa Trip 2024"
          required
          disabled={loading}
          helperText="Choose a descriptive name for your group"
        />

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Group Type
          </label>
          <select
            id="type"
            name="type"
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="household">Household - Long-term living arrangement</option>
            <option value="trip">Trip - Vacation or travel expenses</option>
            <option value="event">Event - One-time occasion</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            This helps organize your expenses
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            disabled={loading}
            placeholder="Add details about this group..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1"
            size="lg"
            disabled={loading}
            isLoading={loading}
          >
            Create Group
          </Button>
        </div>
      </form>
    </div>
  )
}

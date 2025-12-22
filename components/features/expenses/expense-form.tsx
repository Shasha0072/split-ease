'use client'

import { useState } from 'react'
import { createExpense, updateExpense } from '@/lib/actions/expenses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

interface ExpenseFormProps {
  groupId: string
  expense?: {
    id: string
    description: string
    amount: number
    category: string
    date: string
  }
}

export function ExpenseForm({ groupId, expense }: ExpenseFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isEditing = !!expense

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = isEditing
      ? await updateExpense(expense.id, formData)
      : await createExpense(groupId, formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // If successful, redirect happens in server action
  }

  const categories = [
    'Food & Dining',
    'Groceries',
    'Utilities',
    'Rent',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Other',
  ]

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <Input
        id="description"
        name="description"
        type="text"
        label="Description"
        placeholder="e.g., Dinner at restaurant"
        defaultValue={expense?.description}
        required
        disabled={loading}
        autoFocus
      />

      <Input
        id="amount"
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        label="Amount (₹)"
        placeholder="0.00"
        defaultValue={expense?.amount}
        required
        disabled={loading}
      />

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={expense?.category}
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="date"
        name="date"
        type="date"
        label="Date"
        defaultValue={expense?.date || new Date().toISOString().split('T')[0]}
        required
        disabled={loading}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Equal Split</p>
            <p className="text-blue-700">
              This expense will be split equally among all group members. You'll be
              marked as the payer.
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
        isLoading={loading}
      >
        {isEditing ? 'Update Expense' : 'Add Expense'}
      </Button>
    </form>
  )
}

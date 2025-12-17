import React from 'react'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-info/5">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 sm:px-6 sm:pt-8">
        <Link href="/" className="inline-block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            SplitEase
          </h1>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && (
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-base sm:text-lg text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 text-center text-sm text-gray-500 sm:px-6">
        <p>
          By continuing, you agree to SplitEase's{' '}
          <Link href="/terms" className="text-primary hover:underline font-medium">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline font-medium">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}


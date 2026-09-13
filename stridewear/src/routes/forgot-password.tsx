import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgot-password')({ component: ForgotPassword })

function ForgotPassword() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-3xl uppercase text-brand-black">
          Forgot Password
        </h1>
        <p className="mt-4 text-brand-gray-700">Coming in Task 2.5</p>
      </div>
    </main>
  )
}

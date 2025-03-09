import { SupabaseTest } from "@/components/auth/supabase-test"

export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Configuration Test</h1>
      <p className="mb-4 text-gray-600">
        This page checks your Supabase environment variables, connection, and authentication status. If you see any
        errors, please verify your Supabase configuration and environment variables.
      </p>
      <SupabaseTest />
    </div>
  )
}


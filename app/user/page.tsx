import { RequireAuth } from "@/components/auth/require-auth"

export default function UserProfilePage() {
  return (
    <RequireAuth>
      {/* Existing UserProfilePage content */}
    </RequireAuth>
  )
}


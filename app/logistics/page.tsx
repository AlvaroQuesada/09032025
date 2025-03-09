import { RequireAuth } from "@/components/auth/require-auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function LogisticsPage() {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AdminDashboard />
    </RequireAuth>
  )
}


"use client"

import type React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RequireAuthProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { user, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    } else if (allowedRoles && !allowedRoles.includes(userRole || "customer")) {
      router.push("/unauthorized") // Or any other unauthorized route
    }
  }, [user, userRole, allowedRoles, router])

  if (!user) {
    return null // Or a loading indicator
  }

  if (allowedRoles && !allowedRoles.includes(userRole || "customer")) {
    return <div>Unauthorized</div> // Or a custom unauthorized component
  }

  return children
}


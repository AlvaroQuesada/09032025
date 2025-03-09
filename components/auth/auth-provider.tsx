"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-browser"
import type { UserRole } from "@/lib/supabase"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  userRole: UserRole | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setUserRole((session?.user?.user_metadata.role as UserRole) ?? null)

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null)
          setUserRole((session?.user?.user_metadata.role as UserRole) ?? null)
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Error initializing auth:", error)
        toast.error("Error initializing authentication. Please try refreshing the page.")
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Error signing out. Please try again.")
    }
  }

  if (isLoading) {
    return <div>Loading...</div> // Or a more sophisticated loading component
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


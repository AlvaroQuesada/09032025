"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function SupabaseTest() {
  const [status, setStatus] = useState<{
    url: boolean
    key: boolean
    connection: "idle" | "success" | "error"
    auth: "idle" | "authenticated" | "unauthenticated" | "error"
  }>({
    url: false,
    key: false,
    connection: "idle",
    auth: "idle",
  })

  useEffect(() => {
    checkEnvironment()
  }, [])

  const checkEnvironment = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setStatus((prev) => ({
      ...prev,
      url: !!url,
      key: !!key,
    }))

    if (url && key) {
      runTests(url, key)
    }
  }

  const runTests = async (url: string, key: string) => {
    const supabase = createClient(url, key)

    // Test connection
    try {
      const { data, error } = await supabase.from("users").select("count").single()
      if (error) throw error
      setStatus((prev) => ({ ...prev, connection: "success" }))
    } catch (error) {
      console.error("Connection test failed:", error)
      setStatus((prev) => ({ ...prev, connection: "error" }))
    }

    // Test authentication
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      setStatus((prev) => ({ ...prev, auth: data.session ? "authenticated" : "unauthenticated" }))
    } catch (error) {
      console.error("Auth test failed:", error)
      setStatus((prev) => ({ ...prev, auth: "error" }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Configuration Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Environment Variables:</h3>
            <p>NEXT_PUBLIC_SUPABASE_URL: {status.url ? "Defined" : "Not defined"}</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {status.key ? "Defined" : "Not defined"}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Connection Test:</h3>
            <p>
              {status.connection === "idle"
                ? "Not tested"
                : status.connection === "success"
                  ? "Connected to Supabase"
                  : "Connection failed"}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Authentication Test:</h3>
            <p>
              {status.auth === "idle"
                ? "Not tested"
                : status.auth === "authenticated"
                  ? "User is authenticated"
                  : status.auth === "unauthenticated"
                    ? "No active session"
                    : "Authentication check failed"}
            </p>
          </div>

          <Button onClick={checkEnvironment} className="mt-4">
            Run Tests Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


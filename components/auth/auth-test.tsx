"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function AuthTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  const testConnection = useCallback(async () => {
    try {
      // Test the connection by making a simple query
      const { data, error } = await supabase.from("users").select("count").single()

      if (error) {
        throw error
      }

      setIsConnected(true)
      toast.success("Successfully connected to Supabase!")
    } catch (error) {
      console.error("Connection test failed:", error)
      setIsConnected(false)
      toast.error("Failed to connect to Supabase. Please check your configuration.")
    }
  }, [])

  useEffect(() => {
    testConnection()
  }, [testConnection])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected === null ? "bg-gray-400" : isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span>
              {isConnected === null
                ? "Checking connection..."
                : isConnected
                  ? "Connected to Supabase"
                  : "Connection failed"}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Environment Variables Status:</p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    process.env.NEXT_PUBLIC_SUPABASE_URL ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span>NEXT_PUBLIC_SUPABASE_URL</span>
              </li>
              <li className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              </li>
            </ul>
          </div>
          <Button onClick={testConnection}>Test Connection Again</Button>
        </div>
      </CardContent>
    </Card>
  )
}


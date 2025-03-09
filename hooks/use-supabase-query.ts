"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-browser"
import { useAuth } from "@/components/auth/auth-provider"

// Caché en memoria para almacenar resultados de consultas
const queryCache = new Map()

export function useSupabaseQuery<T = any>(
  tableName: string,
  query: (supabaseQuery: any) => any,
  dependencies: any[] = [],
  options: { enabled?: boolean; cacheTime?: number } = {},
) {
  const { enabled = true, cacheTime = 5 * 60 * 1000 } = options // 5 minutos por defecto
  const { user } = useAuth()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Crear una clave única para esta consulta
  const cacheKey = `${tableName}:${JSON.stringify(dependencies)}:${user?.id || "anonymous"}`

  useEffect(() => {
    if (!enabled) return

    const fetchData = async () => {
      // Verificar si tenemos datos en caché y si son recientes
      const cachedResult = queryCache.get(cacheKey)
      if (cachedResult && Date.now() - cachedResult.timestamp < cacheTime) {
        setData(cachedResult.data)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const supabaseQuery = supabase.from(tableName)
        const { data: result, error } = await query(supabaseQuery)

        if (error) throw error

        setData(result)

        // Guardar en caché
        queryCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        })
      } catch (err) {
        console.error(`Error fetching data from ${tableName}:`, err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [tableName, cacheKey, enabled, cacheTime, ...dependencies])

  // Función para invalidar manualmente el caché y volver a cargar
  const refetch = async () => {
    queryCache.delete(cacheKey)
    setIsLoading(true)

    try {
      const supabaseQuery = supabase.from(tableName)
      const { data: result, error } = await query(supabaseQuery)

      if (error) throw error

      setData(result)

      // Guardar en caché
      queryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      })
    } catch (err) {
      console.error(`Error refetching data from ${tableName}:`, err)
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }

  return { data, error, isLoading, refetch }
}


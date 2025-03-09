export const getEnv = () => ({
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})

export type Env = ReturnType<typeof getEnv>

// Función para obtener de forma segura los primeros caracteres de una cadena
export const safeSubstring = (str: string | undefined, length: number) => {
  if (!str) return ""
  return str.substring(0, length) + "..."
}


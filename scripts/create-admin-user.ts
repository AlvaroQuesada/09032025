import { createClient } from "@supabase/supabase-js"

// Asegúrate de reemplazar estos con tus credenciales reales de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  const adminEmail = "yban.azana.2024@gmail.com"
  const adminPassword = "UnPasswordMuySeguro123!" // Asegúrate de cambiar esto por una contraseña segura
  const adminFullName = "Admin User" // Make sure this is set

  try {
    // Paso 1: Crear el usuario en auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminFullName, // Add full_name to user_metadata
        role: "admin",
      },
    })

    if (authError) throw authError

    console.log("Usuario creado en auth.users:", authUser)

    // Paso 2: Insertar el usuario en public.users
    const { data: publicUser, error: publicError } = await supabase
      .from("users")
      .insert({
        email: adminEmail,
        full_name: adminFullName, // Ensure this is set
        role: "admin",
        auth_id: authUser.user.id,
      })
      .select()
      .single()

    if (publicError) throw publicError

    console.log("Usuario insertado en public.users:", publicUser)

    console.log("Usuario administrador creado exitosamente")
  } catch (error) {
    console.error("Error al crear el usuario administrador:", error)
  }
}

createAdminUser()


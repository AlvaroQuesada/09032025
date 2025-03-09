import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { newAdminEmail, newAdminName, verificationEmail } = await req.json()

    if (!newAdminEmail || !verificationEmail) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Generar un token de verificación único
    const verificationToken = crypto.randomUUID()

    // Almacenar el token en la base de datos
    const { error: tokenError } = await supabase.from("admin_verification_tokens").insert({
      email: newAdminEmail,
      token: verificationToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
    })

    if (tokenError) throw tokenError

    // Construir la URL de verificación
    const verificationUrl = `${Deno.env.get("FRONTEND_URL")}/admin/verify?token=${verificationToken}`

    // Enviar el correo electrónico
    const { error: emailError } = await supabase.functions.invoke("send-email", {
      body: {
        to: verificationEmail,
        subject: "Verificación de nuevo administrador",
        html: `
          <h1>Verificación de nuevo administrador</h1>
          <p>Se ha creado una nueva cuenta de administrador para ${newAdminName} (${newAdminEmail}).</p>
          <p>Para verificar y activar esta cuenta, haga clic en el siguiente enlace:</p>
          <p><a href="${verificationUrl}">Verificar cuenta de administrador</a></p>
          <p>Este enlace expirará en 24 horas.</p>
          <p>Si no solicitó esta cuenta, puede ignorar este correo.</p>
        `,
      },
    })

    if (emailError) throw emailError

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})


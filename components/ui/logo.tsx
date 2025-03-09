import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  variant?: "default" | "horizontal"
}

export function Logo({ className, variant = "default" }: LogoProps) {
  const sizes = {
    default: { width: 120, height: 60 },
    horizontal: { width: 100, height: 28 }, // Adjusted size for the horizontal logo
  }

  const logoSrc =
    variant === "horizontal"
      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hor-IdphRNKCGAEmUdNqX5gdWN28nZNhvX.png"
      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen_de_WhatsApp_2025-02-04_a_las_12.24.39_d040dbc0-removebg-preview-dS8TNTko9LdhVkaZZ3agMhVzRngJAZ.png"

  return (
    <Link href="/" className={cn("block", className)}>
      <div className="relative">
        <Image
          src={logoSrc || "/placeholder.svg"}
          alt="Llama Express Logo"
          {...sizes[variant]}
          className={cn(
            "object-contain",
            "brightness-0 invert", // Make both variants white
          )}
          priority
        />
      </div>
    </Link>
  )
}


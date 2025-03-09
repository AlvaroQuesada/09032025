"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamic import with ssr: false
const DynamicQuickShippingButton = dynamic(
  () => import("@/components/quick-shipping-button").then((mod) => mod.QuickShippingButton),
  { ssr: false, loading: () => null },
)

export function QuickShippingButtonWrapper() {
  return (
    <Suspense fallback={null}>
      <DynamicQuickShippingButton />
    </Suspense>
  )
}


"use client"

import { TrackingDetails } from "@/components/tracking/tracking-details"
import { TrackingTimeline } from "@/components/tracking/tracking-timeline"

interface TrackingPageProps {
  params: {
    id: string
  }
}

export default function TrackingPage({ params }: TrackingPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seguimiento de Envío</h1>

      <div className="grid gap-8">
        <TrackingDetails trackingNumber={params.id} />
        <TrackingTimeline trackingNumber={params.id} />
      </div>
    </div>
  )
}


// app/providers.tsx
'use client'

import { useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import type { PostHog } from 'posthog-js'

// Dynamically import PostHog to avoid blocking initial render
const PostHogProviderDynamic = dynamic(
  () => import('posthog-js/react').then((mod) => mod.PostHogProvider),
  { ssr: false }
)

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const [posthogClient, setPosthogClient] = useState<PostHog | null>(null)

  useEffect(() => {
    // Mark as client-side
    setIsClient(true)
    
    // Lazy load PostHog after initial render
    const loadPostHog = async () => {
      // Wait for next tick to ensure main content is rendered
      await new Promise(resolve => setTimeout(resolve, 0))
      
      // Dynamically import PostHog
      const posthog = (await import('posthog-js')).default
      
      // Initialize PostHog
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        defaults: '2025-05-24',
        // Performance optimizations
        loaded: (posthog) => {
          // Disable automatic pageviews to reduce overhead
          posthog.opt_out_capturing()
          posthog.opt_in_capturing()
        }
      })
      
      setPosthogClient(posthog)
    }

    loadPostHog()
  }, [])

  // Render children immediately without PostHog wrapper during SSR and initial client render
  if (!isClient || !posthogClient) {
    return <>{children}</>
  }

  // Render with PostHog provider once loaded
  return (
    <PostHogProviderDynamic client={posthogClient}>
      {children}
    </PostHogProviderDynamic>
  )
}

"use client"

import { trpc } from "@/lib/trpc";
import type { GetAnalyticsInput } from "@/types/analytics";

export function useAnalytics(projectId: string, period: GetAnalyticsInput["period"]) {
  return trpc.analytics.getAnalytics.useQuery(
    { projectId, period },
    { enabled: Boolean(projectId), staleTime: 1000 * 60 * 5 }
  );
}



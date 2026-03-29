import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Job } from "@portal/types";

export function useJobs(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const { data } = await api.get("/jobs", { params: filters });
      return data as { data: Job[]; total: number };
    },
  });
}

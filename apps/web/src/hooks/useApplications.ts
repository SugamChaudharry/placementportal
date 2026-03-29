import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application } from "@portal/types";

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data } = await api.get("/applications");
      return data as { data: Application[] };
    },
  });
}

export function useApply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => api.post("/applications", { jobId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { healthService } from "../services/health.service";

export const useVitals = () => {
  return useQuery({
    queryKey: ["vitals"],
    queryFn: () => healthService.getVitals(),
    refetchInterval: 5000, // Refetch every 5 seconds for "live" feel
  });
};

export const useHealthMetrics = () => {
  return useQuery({
    queryKey: ["healthMetrics"],
    queryFn: () => healthService.getHealthMetrics(),
  });
};

export const useUpdateVital = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: number }) => 
      healthService.updateVital(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vitals"] });
    },
  });
};
export const useWellnessScore = () => {
  return useQuery({
    queryKey: ["wellnessScore"],
    queryFn: () => healthService.getWellnessScore(),
  });
};

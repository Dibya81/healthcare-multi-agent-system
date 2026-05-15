import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { Patient } from "../types";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Patient>) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useHealthSummary = () => {
  return useQuery({
    queryKey: ["healthSummary"],
    queryFn: () => userService.getHealthSummary(),
  });
};

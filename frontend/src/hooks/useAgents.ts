import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agentService } from "../services/agent.service";

export const useAlerts = () => {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: () => agentService.getAlerts(),
    refetchInterval: 10000,
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => agentService.acknowledgeAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};

export const useDiagnosticHistory = () => {
  return useQuery({
    queryKey: ["diagnosticHistory"],
    queryFn: () => agentService.getDiagnosticHistory(),
  });
};

export const useRunDiagnosis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { text: string; image?: File }) => agentService.runDiagnosis(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosticHistory"] });
    },
  });
};

export const useSchedule = () => {
  return useQuery({
    queryKey: ["schedule"],
    queryFn: () => agentService.getSchedule(),
  });
};

export const useGenomicProfile = () => {
  return useQuery({
    queryKey: ["genomicProfile"],
    queryFn: () => agentService.getGenomicProfile(),
  });
};

export const useChatHistory = () => {
  return useQuery({
    queryKey: ["chatHistory"],
    queryFn: () => agentService.getChatHistory(),
  });
};

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: (message: string) => agentService.sendChatMessage(message),
  });
};

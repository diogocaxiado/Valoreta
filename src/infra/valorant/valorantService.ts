import { AgentsResponse, AgentsQueryParams } from "./types";
import { IAgent } from "../../types";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchAgents(
  filters?: AgentsQueryParams
): Promise<IAgent[]> {
  const processedFilters = Object.entries(filters ?? {}).reduce(
    (acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    },
    {} as Record<string, string>
  );

  const params = new URLSearchParams(processedFilters).toString();
  const response = await fetch(`${BASE_URL}agents?${params}`);

  if (!response.ok) {
    throw new Error("Falha ao carregar agentes da API Valorant");
  }

  const result: AgentsResponse = await response.json();
  return result.data;
}

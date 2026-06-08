import { IAgent } from "../../types";

export interface ValorantApiResponse<T> {
  status: number;
  data: T;
}

export interface AgentsQueryParams {
  isPlayableCharacter?: boolean;
  language?: string;
}

export type AgentsResponse = ValorantApiResponse<IAgent[]>;

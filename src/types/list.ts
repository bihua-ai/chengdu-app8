export interface Resident {
  resident_id: string;
  display_name: string;
  avatar_url: string;
  is_agent: boolean;
  password?: string;
  email?: string;
  last_login_timestamp_ms?: number;
  last_sync_timestamp_ms?: number;
  access_token?: string;
  agent?: 'enabled' | 'disabled';
  role?: 'admin' | 'user';
  state?: 'active' | 'inactive';
  profile?: string;
}

export interface Group {
  group_id: string;
  name: string;
  alias: string;
  size: number;
  public: boolean;
  encryption?: Record<string, any>;
  avatar_url?: string;
  profile?: string;
}

export interface LLMModel {
  provider: string;
  model_id: string;
  group_id: string;
  size: number;
  version: string;
}

export type ListItem = Resident | Group | LLMModel;
export type ListType = 'residents' | 'groups' | 'models';

export interface ApiResponse<T> {
  message: string;
  status: string;
  data: T;
}

export interface ResidentsResponse {
  residents: Resident[];
}

export interface GroupsResponse {
  groups: Group[];
}

export interface LLMModelResponse {
  llm_model_list: LLMModel[];
}
import type {
  Activity,
  ApiKey,
  Asset,
  Incident,
  Notification,
  ScorePoint,
  IncidentTrendPoint,
  User,
  Workspace,
} from "@/types";
import * as mock from "@/data/mock";

export interface Bootstrap {
  users: User[];
  incidents: Incident[];
  assets: Asset[];
  notifications: Notification[];
  activity: Activity[];
  scoreHistory: ScorePoint[];
  incidentTrend: IncidentTrendPoint[];
  apiKeys: ApiKey[];
  workspace: Workspace;
}

/**
 * Mock API client.
 *
 * Every call is async and returns fresh mock data, mirroring the shape a real
 * REST backend would expose. To connect a real API, replace the bodies of
 * these functions with fetch() calls — the rest of the app only consumes this
 * module and the store.
 */
const latency = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  async getBootstrap(): Promise<Bootstrap> {
    await latency(250);
    return {
      users: mock.buildUsers(),
      incidents: mock.buildIncidents(),
      assets: mock.buildAssets(),
      notifications: mock.buildNotifications(),
      activity: mock.buildActivity(),
      scoreHistory: mock.buildScoreHistory(),
      incidentTrend: mock.buildIncidentTrend(),
      apiKeys: mock.buildApiKeys(),
      workspace: mock.buildWorkspace(),
    };
  },

  async updateIncidentStatus(id: string, status: Incident["status"]): Promise<void> {
    await latency(80);
    void id;
    void status;
  },

  async assignIncident(id: string, assigneeId: string | null): Promise<void> {
    await latency(80);
    void id;
    void assigneeId;
  },

  async inviteMember(email: string, role: User["role"]): Promise<void> {
    await latency(80);
    void email;
    void role;
  },

  async updateMember(id: string, patch: Partial<User>): Promise<void> {
    await latency(80);
    void id;
    void patch;
  },

  async markNotificationsRead(): Promise<void> {
    await latency(60);
  },
};

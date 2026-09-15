import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, type Bootstrap } from "@/lib/api";
import type {
  Activity,
  ApiKey,
  Asset,
  AssetStatus,
  Incident,
  IncidentStatus,
  Notification,
  Role,
  ScorePoint,
  IncidentTrendPoint,
  User,
  Workspace,
} from "@/types";

export interface Toast {
  id: number;
  message: string;
}

interface StoreState {
  loading: boolean;
  error: string | null;
  users: User[];
  incidents: Incident[];
  assets: Asset[];
  notifications: Notification[];
  activity: Activity[];
  scoreHistory: ScorePoint[];
  incidentTrend: IncidentTrendPoint[];
  apiKeys: ApiKey[];
  workspace: Workspace;
  currentUser: User;
}

interface StoreActions {
  setIncidentStatus: (id: string, status: IncidentStatus, detail?: string) => void;
  assignIncident: (id: string, assigneeId: string | null) => void;
  inviteMember: (email: string, role: Role) => void;
  updateMember: (id: string, patch: Partial<User>) => void;
  scanAsset: (id: string) => void;
  toggleAssetPause: (id: string) => void;
  updateCurrentUser: (patch: Partial<User>) => void;
  updateWorkspace: (patch: { name?: string; region?: string }) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addApiKey: (name: string) => ApiKey;
  revokeApiKey: (id: string) => void;
  resetDemo: () => void;
  toast: (message: string) => void;
}

interface Store extends StoreState, StoreActions {
  toasts: Toast[];
}

const CURRENT_USER_ID = "u-01";
const STORAGE_KEY = "sentry.demo.v1";

/**
 * User-made deltas, persisted to localStorage and re-applied onto a fresh
 * mock bootstrap on load. Mock dates regenerate relative to load time, so we
 * persist only patches — never full entities — to keep the demo feeling live.
 */
interface DemoPatch {
  incidents: Record<string, { status?: IncidentStatus; assigneeId?: string | null }>;
  members: Record<string, Partial<User>>;
  invited: User[];
  notificationsRead: string[];
  apiKeys: ApiKey[] | null;
  assets: Record<string, { status?: AssetStatus; pausedFrom?: AssetStatus }>;
  workspace: { name?: string; region?: string };
}

const emptyPatch: DemoPatch = {
  incidents: {},
  members: {},
  invited: [],
  notificationsRead: [],
  apiKeys: null,
  assets: {},
  workspace: {},
};

function loadPatch(): DemoPatch {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyPatch };
    return { ...emptyPatch, ...(JSON.parse(raw) as DemoPatch) };
  } catch {
    return { ...emptyPatch };
  }
}

function savePatch(patch: DemoPatch) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patch));
  } catch {
    // storage unavailable (private mode) — demo keeps working without persistence
  }
}

const StoreContext = createContext<Store | null>(null);

const initialState: StoreState = {
  loading: true,
  error: null,
  users: [],
  incidents: [],
  assets: [],
  notifications: [],
  activity: [],
  scoreHistory: [],
  incidentTrend: [],
  apiKeys: [],
  workspace: { id: "", name: "", plan: "", region: "" },
  currentUser: {
    id: CURRENT_USER_ID,
    name: "",
    email: "",
    role: "owner",
    status: "active",
    title: "",
    lastActive: null,
  },
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(initialState);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let cancelled = false;
    const patch = loadPatch();
    api
      .getBootstrap()
      .then((data: Bootstrap) => {
        if (cancelled) return;

        const users = [
          ...data.users.map((u) => (patch.members[u.id] ? { ...u, ...patch.members[u.id] } : u)),
          ...patch.invited,
        ];
        const incidents = data.incidents.map((inc) => {
          const p = patch.incidents[inc.id];
          return p ? { ...inc, ...p } : inc;
        });
        const assets = data.assets.map((a) => {
          const p = patch.assets[a.id];
          return p?.status ? { ...a, status: p.status } : a;
        });
        const notifications = data.notifications.map((n) =>
          patch.notificationsRead.includes(n.id) ? { ...n, read: true } : n,
        );
        const apiKeys = patch.apiKeys ?? data.apiKeys;
        const workspace = {
          ...data.workspace,
          ...(patch.workspace.name ? { name: patch.workspace.name } : {}),
          ...(patch.workspace.region ? { region: patch.workspace.region } : {}),
        };

        setState({
          ...data,
          users,
          incidents,
          assets,
          notifications,
          apiKeys,
          workspace,
          loading: false,
          error: null,
          currentUser: users.find((u) => u.id === CURRENT_USER_ID) ?? users[0],
        });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: "Failed to load workspace data." }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const persist = useCallback((fn: (patch: DemoPatch) => DemoPatch) => {
    const next = fn(loadPatch());
    savePatch(next);
  }, []);

  const setIncidentStatus = useCallback(
    (id: string, status: IncidentStatus, detail?: string) => {
      setState((s) => {
        const now = new Date().toISOString();
        const actor = s.currentUser.name;
        return {
          ...s,
          incidents: s.incidents.map((inc) =>
            inc.id === id
              ? {
                  ...inc,
                  status,
                  updatedAt: now,
                  timeline: [
                    ...inc.timeline,
                    {
                      id: `t-${Date.now()}`,
                      at: now,
                      actor,
                      label: `Status changed to ${status}`,
                      detail,
                    },
                  ],
                }
              : inc,
          ),
          activity: [
            { id: `ac-${Date.now()}`, actor, action: `changed status to ${status}`, target: id, at: now },
            ...s.activity,
          ],
        };
      });
      persist((p) => ({ ...p, incidents: { ...p.incidents, [id]: { ...p.incidents[id], status } } }));
      void api.updateIncidentStatus(id, status);
    },
    [persist],
  );

  const assignIncident = useCallback(
    (id: string, assigneeId: string | null) => {
      setState((s) => {
        const now = new Date().toISOString();
        const actor = s.currentUser.name;
        const assignee = s.users.find((u) => u.id === assigneeId);
        return {
          ...s,
          incidents: s.incidents.map((inc) =>
            inc.id === id
              ? {
                  ...inc,
                  assigneeId,
                  updatedAt: now,
                  timeline: [
                    ...inc.timeline,
                    {
                      id: `t-${Date.now()}`,
                      at: now,
                      actor,
                      label: assignee ? `Assigned to ${assignee.name}` : "Assignee cleared",
                    },
                  ],
                }
              : inc,
          ),
        };
      });
      persist((p) => ({
        ...p,
        incidents: { ...p.incidents, [id]: { ...p.incidents[id], assigneeId } },
      }));
      void api.assignIncident(id, assigneeId);
    },
    [persist],
  );

  const inviteMember = useCallback(
    (email: string, role: Role) => {
      const now = new Date().toISOString();
      const member: User = {
        id: `u-${Date.now()}`,
        name: email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        role,
        status: "invited",
        title: "—",
        lastActive: null,
      };
      setState((s) => ({
        ...s,
        users: [...s.users, member],
        activity: [
          {
            id: `ac-${Date.now()}`,
            actor: s.currentUser.name,
            action: `invited ${email} as ${role.replace("_", " ")}`,
            target: s.workspace.name,
            at: now,
          },
          ...s.activity,
        ],
      }));
      persist((p) => ({ ...p, invited: [...p.invited, member] }));
      void api.inviteMember(email, role);
    },
    [persist],
  );

  const updateMember = useCallback(
    (id: string, memberPatch: Partial<User>) => {
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === id ? { ...u, ...memberPatch } : u)),
      }));
      persist((p) => ({
        ...p,
        members: { ...p.members, [id]: { ...p.members[id], ...memberPatch } },
      }));
      void api.updateMember(id, memberPatch);
    },
    [persist],
  );

  const updateCurrentUser = useCallback(
    (userPatch: Partial<User>) => {
      setState((s) => ({
        ...s,
        currentUser: { ...s.currentUser, ...userPatch },
        users: s.users.map((u) => (u.id === CURRENT_USER_ID ? { ...u, ...userPatch } : u)),
      }));
      persist((p) => ({
        ...p,
        members: { ...p.members, [CURRENT_USER_ID]: { ...p.members[CURRENT_USER_ID], ...userPatch } },
      }));
    },
    [persist],
  );

  const scanAsset = useCallback(
    (id: string) => {
      const now = new Date().toISOString();
      setState((s) => ({
        ...s,
        assets: s.assets.map((a) => (a.id === id ? { ...a, lastScanned: now } : a)),
        activity: [
          {
            id: `ac-${Date.now()}`,
            actor: s.currentUser.name,
            action: "ran a manual scan",
            target: s.assets.find((a) => a.id === id)?.name ?? id,
            at: now,
          },
          ...s.activity,
        ],
      }));
    },
    [],
  );

  const toggleAssetPause = useCallback(
    (id: string) => {
      const current = stateRef.current.assets.find((a) => a.id === id);
      if (!current) return;
      const now = new Date().toISOString();
      const actor = stateRef.current.currentUser.name;
      const pausing = current.status !== "paused";
      const previous = loadPatch().assets[id]?.pausedFrom;
      const nextStatus: AssetStatus = pausing ? "paused" : previous ?? "healthy";
      const pausedFrom = pausing ? current.status : undefined;

      setState((s) => ({
        ...s,
        assets: s.assets.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)),
        activity: [
          {
            id: `ac-${Date.now()}`,
            actor,
            action: pausing ? "paused monitoring for" : "resumed monitoring for",
            target: current.name,
            at: now,
          },
          ...s.activity,
        ],
      }));
      persist((p) => ({
        ...p,
        assets: {
          ...p.assets,
          [id]: {
            status: nextStatus,
            pausedFrom: pausing ? pausedFrom : undefined,
          },
        },
      }));
    },
    [persist],
  );

  const updateWorkspace = useCallback(
    (workspacePatch: { name?: string; region?: string }) => {
      setState((s) => ({ ...s, workspace: { ...s.workspace, ...workspacePatch } }));
      persist((p) => ({ ...p, workspace: { ...p.workspace, ...workspacePatch } }));
    },
    [persist],
  );

  const markRead = useCallback(
    (id: string) => {
      setState((s) => ({
        ...s,
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }));
      persist((p) => ({
        ...p,
        notificationsRead: p.notificationsRead.includes(id) ? p.notificationsRead : [...p.notificationsRead, id],
      }));
    },
    [persist],
  );

  const markAllRead = useCallback(() => {
    const ids = stateRef.current.notifications.map((n) => n.id);
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
    persist((p) => ({ ...p, notificationsRead: ids }));
    void api.markNotificationsRead();
  }, [persist]);

  const addApiKey = useCallback(
    (name: string): ApiKey => {
      const key: ApiKey = {
        id: `k-${Date.now()}`,
        name,
        prefix: `snt_live_${Math.random().toString(36).slice(2, 6).toUpperCase()}…`,
        createdAt: new Date().toISOString(),
        lastUsed: null,
      };
      const next = [...stateRef.current.apiKeys, key];
      setState((s) => ({ ...s, apiKeys: next }));
      persist((p) => ({ ...p, apiKeys: next }));
      return key;
    },
    [persist],
  );

  const revokeApiKey = useCallback(
    (id: string) => {
      const next = stateRef.current.apiKeys.filter((k) => k.id !== id);
      setState((s) => ({ ...s, apiKeys: next }));
      persist((p) => ({ ...p, apiKeys: next }));
    },
    [persist],
  );

  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    window.location.reload();
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      toasts,
      setIncidentStatus,
      assignIncident,
      inviteMember,
      updateMember,
      scanAsset,
      toggleAssetPause,
      updateCurrentUser,
      updateWorkspace,
      markRead,
      markAllRead,
      addApiKey,
      revokeApiKey,
      resetDemo,
      toast,
    }),
    [
      state,
      toasts,
      setIncidentStatus,
      assignIncident,
      inviteMember,
      updateMember,
      scanAsset,
      toggleAssetPause,
      updateCurrentUser,
      updateWorkspace,
      markRead,
      markAllRead,
      addApiKey,
      revokeApiKey,
      resetDemo,
      toast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

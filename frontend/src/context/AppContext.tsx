import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  type Campaign,
  type Influencer,
  type DashboardMetrics,
} from "@/data/mockData";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  campaigns: Campaign[];
  influencers: Influencer[];
  metrics: DashboardMetrics;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<true | string>;
  register: (name: string, email: string, password: string) => Promise<true | string>;
  logout: () => void;
  refreshData: () => Promise<void>;
  loading: boolean;
  authLoading: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

// ── Default empty metrics ──
const emptyMetrics: DashboardMetrics = {
  totalRevenue: 0,
  activeCampaigns: 0,
  avgROI: 0,
  engagementRate: 0,
  revenueData: [],
  trafficSources: [],
  influencerPerformance: [],
};

const BASE = "http://localhost:5000/api";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user,        setUser]        = useState<User | null>(null);
  const [campaigns,   setCampaigns]   = useState<Campaign[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [metrics,     setMetrics]     = useState<DashboardMetrics>(emptyMetrics);
  const [loading,     setLoading]     = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Helper — attach token to every request ──
  const apiFetch = async (path: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`API error: ${path}`);
    return res.json();
  };

  // ── Load all dashboard data from MySQL ──
  const loadDashboardData = async () => {
    try {
      const [summaryData, campaignsData, influencersData] = await Promise.all([
        apiFetch("/summary"),
        apiFetch("/campaigns"),
        apiFetch("/influencers"),
      ]);

      // ── Build metrics from real data ──
      setMetrics({
        totalRevenue:    Number(summaryData.totalRevenue)    || 0,
        activeCampaigns: Number(summaryData.activeCampaigns) || 0,
        avgROI:          Number(summaryData.avgROI)          || 0,

        // Engagement rate — avg from influencers
        engagementRate: influencersData.length
          ? parseFloat(
              (influencersData.reduce((s: number, i: any) =>
                s + (Number(i.engagement_rate) || 0), 0
              ) / influencersData.length).toFixed(1)
            )
          : 0,

        // Revenue line chart — from monthly revenue
        revenueData: summaryData.monthlyRevenue?.length
          ? summaryData.monthlyRevenue.map((r: any) => ({
              month:   r.month,
              revenue: Number(r.revenue) || 0,
              target:  Math.round(Number(r.revenue) * 0.85), // target = 85% of actual
            }))
          : [],

        // Traffic sources donut chart — from videos by platform
        trafficSources: summaryData.trafficSources?.length
          ? (() => {
              const total = summaryData.trafficSources.reduce(
                (s: number, t: any) => s + Number(t.count), 0
              ) || 1;
              return summaryData.trafficSources.map((t: any) => ({
                name:  t.platform,
                value: Math.round((Number(t.count) / total) * 100),
              }));
            })()
          : [],

        // Influencer bar chart
        influencerPerformance: influencersData.map((i: any) => ({
          name:    i.name,
          revenue: Number(i.revenue) || 0,
        })),
      });

      setCampaigns(campaignsData);
      setInfluencers(influencersData);

    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    }
  };

  // ── ADD this function ──
  const refreshData = async () => {
    await loadDashboardData();
  };

  // ── Validate token on app load ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setAuthLoading(false); return; }

    const validateToken = async () => {
      try {
        const response = await fetch(`${BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch {
        const userData = localStorage.getItem("user");
        if (userData) {
          try { setUser(JSON.parse(userData)); }
          catch { localStorage.removeItem("user"); }
        }
      } finally {
        setAuthLoading(false);
      }
    };

    validateToken();
  }, []);

  // ── Load data when user logs in ──
  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  // ── Login ──
  const login = async (email: string, password: string): Promise<true | string> => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return true;
      }
      return data.error || "Login failed. Please try again.";
    } catch {
      return "Unable to reach the server. Please check your connection.";
    } finally {
      setLoading(false);
    }
  };

  // ── Register ──
  const register = async (name: string, email: string, password: string): Promise<true | string> => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE}/auth/signup`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) return true;
      return data.error || "Registration failed. Please try again.";
    } catch {
      return "Unable to reach the server. Please check your connection.";
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ──
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMetrics(emptyMetrics);
    setCampaigns([]);
    setInfluencers([]);
  };

  return (
    <AppContext.Provider value={{
      user, campaigns, influencers, metrics,
      isAuthenticated: !!user,
      login, register, logout, refreshData, loading, authLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
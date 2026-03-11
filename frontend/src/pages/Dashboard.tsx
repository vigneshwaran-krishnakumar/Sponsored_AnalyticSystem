import { DollarSign, Megaphone, TrendingUp, Heart } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import KPICard from "@/components/KPICard";
import ChartCard from "@/components/ChartCard";
import StatusBadge from "@/components/StatusBadge";
import { useApp } from "@/context/AppContext";

const COLORS = [
  "hsl(172, 90%, 54%)",
  "hsl(59, 77%, 52%)",
  "hsl(190, 80%, 45%)",
  "hsl(38, 92%, 50%)",
];

const Dashboard = () => {
  const { metrics, campaigns } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Here's your sponsorship overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Revenue" value={`$${(metrics.totalRevenue / 1000).toFixed(0)}K`} change="+12.5% from last month" changeType="positive" icon={DollarSign} />
        <KPICard title="Active Campaigns" value={String(metrics.activeCampaigns)} change="+2 new this week" changeType="positive" icon={Megaphone} />
        <KPICard title="Avg ROI" value={`${metrics.avgROI}%`} change="+18% from last quarter" changeType="positive" icon={TrendingUp} />
        <KPICard title="Engagement Rate" value={`${metrics.engagementRate}%`} change="-0.3% from last month" changeType="negative" icon={Heart} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Revenue Overview" subtitle="Monthly revenue vs target" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" tickFormatter={(v) => `$${v / 1000}K`} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(234, 89%, 56%)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="target" stroke="hsl(220, 9%, 46%)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Traffic Sources" subtitle="By platform">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={metrics.trafficSources} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {metrics.trafficSources.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Influencer Performance + Recent Campaigns */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Influencer Performance" subtitle="Revenue by influencer">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.influencerPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" tickFormatter={(v) => `$${v / 1000}K`} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="hsl(234, 89%, 56%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recent Campaigns">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Campaign</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.slice(0, 5).map((c) => (
                  <tr key={c.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3">
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.brand}</p>
                    </td>
                    <td className="py-3"><StatusBadge status={c.status} /></td>
                    <td className="py-3 text-right font-medium text-foreground">${c.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;

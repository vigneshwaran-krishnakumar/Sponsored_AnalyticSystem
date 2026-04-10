import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import ChartCard from "@/components/ChartCard";
import AddInfluencerModal from "@/components/AddInfluencerModal";

interface Influencer {
  id: number;
  name: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  revenue: number;
  created_at: string;
}

const Influencers = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platformFilter, setPlatformFilter] = useState("all");

  const fetchInfluencers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("https://sponsoredanalyticsystem-production-60f3.up.railway.app/api/influencers", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setInfluencers(data);
    } catch (error) {
      console.error("Error fetching influencers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const platforms = ["all", ...new Set(influencers.map((i) => i.platform))];
  const filtered = platformFilter === "all" ? influencers : influencers.filter((i) => i.platform === platformFilter);

  const chartData = filtered.map((i) => ({
    name: i.name.split(" ")[0],
    engagement: i.engagement_rate,
    revenue: i.revenue / 1000
  }));

  const handleInfluencerCreated = () => {
    fetchInfluencers(); // Refresh the list
    setIsModalOpen(false);
  };

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading influencers...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Influencers</h1>
          <p className="text-sm text-muted-foreground">Monitor influencer performance across platforms</p>
        </div>
        <Button variant="hero" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Influencer
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${p === platformFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            {p === "all" ? "All Platforms" : p}
          </button>
        ))}
      </div>

      {/* Engagement Comparison Chart */}
      <ChartCard title="Engagement Rate Comparison" subtitle="By influencer">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
            <Tooltip />
            <Bar dataKey="engagement" fill="hsl(260, 65%, 60%)" radius={[6, 6, 0, 0]} name="Engagement %" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Influencer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Platform</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Followers</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Engagement</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Campaigns</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inf) => (
              <tr key={inf.id} className="border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/20">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                      {inf.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="font-medium text-foreground">{inf.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-muted-foreground">{inf.platform}</td>
                <td className="px-4 py-4 text-right text-foreground">{(inf.followers / 1000000).toFixed(1)}M</td>
                <td className="px-4 py-4 text-right font-semibold text-primary">{inf.engagement_rate}%</td>
                <td className="px-4 py-4 text-right text-foreground">-</td>
                <td className="px-4 py-4 text-right font-medium text-foreground">${inf.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddInfluencerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInfluencerCreated={handleInfluencerCreated}
      />
    </div>
  );
};

export default Influencers;

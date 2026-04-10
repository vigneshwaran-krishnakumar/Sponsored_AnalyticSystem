
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import EditCampaignModal from "@/components/EditCampaignModal";

interface Campaign {
  id: number;
  name: string;
  brand: string;
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  revenue: number;
  created_at: string;
}

const Campaigns = () => {

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("https://sponsoredanalyticsystem-production-60f3.up.railway.app/api/campaigns", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditModalOpen(true);
  };

  const handleCampaignUpdated = () => {
    fetchCampaigns(); // Refresh the list
  };

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading campaigns...</p>;
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Manage your sponsorship campaigns
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left">Campaign</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Budget</th>
              <th className="px-4 py-3 text-left">Progress</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">ROI</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((c) => {

              const progress = Math.round((c.spent / c.budget) * 100);
              const roi = Math.round(((c.revenue - c.spent) / c.spent) * 100);

              return (
                <tr
                  key={c.id}
                  className="border-b border-border/50 last:border-0 hover:bg-secondary/20"
                >

                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.brand}</p>
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={c.status} />
                  </td>

                  <td className="px-4 py-4">
                    ${c.budget.toLocaleString()}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">

                      <div className="h-2 w-24 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {progress}%
                      </span>

                    </div>
                  </td>

                  <td className="px-4 py-4 text-right font-medium">
                    ${c.revenue.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-chart-4">
                    {roi}%
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/dashboard/campaigns/${c.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      <EditCampaignModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCampaignUpdated={handleCampaignUpdated}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default Campaigns;

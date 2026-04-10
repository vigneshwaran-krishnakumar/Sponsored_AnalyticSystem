import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";

interface AddInfluencerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInfluencerCreated: () => void;
}

const AddInfluencerModal = ({ isOpen, onClose, onInfluencerCreated }: AddInfluencerModalProps) => {
  const { refreshData } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    platform: "",
    followers: "",
    engagement_rate: "",
    revenue: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("https://sponsoredanalyticsystem-production-60f3.up.railway.app/api/influencers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          followers: parseInt(formData.followers),
          engagement_rate: parseFloat(formData.engagement_rate),
          revenue: parseFloat(formData.revenue) || 0,
        }),
      });

      if (response.ok) {
        await refreshData(); // ← refresh dashboard data
        onInfluencerCreated();
        setFormData({
          name: "",
          platform: "",
          followers: "",
          engagement_rate: "",
          revenue: "",
        });
      } else {
        console.error("Failed to create influencer");
      }
    } catch (error) {
      console.error("Error creating influencer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Influencer</DialogTitle>
          <DialogDescription>
            Add a new influencer to track their performance. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">
                Platform
              </Label>
              <Select value={formData.platform} onValueChange={(value) => handleInputChange("platform", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="followers" className="text-right">
                Followers
              </Label>
              <Input
                id="followers"
                type="number"
                value={formData.followers}
                onChange={(e) => handleInputChange("followers", e.target.value)}
                className="col-span-3"
                placeholder="e.g., 120000"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="engagement_rate" className="text-right">
                Engagement Rate
              </Label>
              <Input
                id="engagement_rate"
                type="number"
                step="0.01"
                value={formData.engagement_rate}
                onChange={(e) => handleInputChange("engagement_rate", e.target.value)}
                className="col-span-3"
                placeholder="e.g., 5.4"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="revenue" className="text-right">
                Revenue
              </Label>
              <Input
                id="revenue"
                type="number"
                step="0.01"
                value={formData.revenue}
                onChange={(e) => handleInputChange("revenue", e.target.value)}
                className="col-span-3"
                placeholder="e.g., 3000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Influencer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInfluencerModal;
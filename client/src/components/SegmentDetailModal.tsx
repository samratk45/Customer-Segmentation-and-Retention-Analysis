import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart3, TrendingUp, DollarSign } from "lucide-react";

interface SegmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  segment: string | null;
  data: Record<string, any>;
}

const segmentDescriptions: Record<string, { description: string; recommendation: string }> = {
  "Best Customers": {
    description: "Your most valuable customers with high recency, frequency, and monetary value.",
    recommendation: "Focus on retention and upselling. Implement VIP programs and personalized communication."
  },
  "Loyal Customers": {
    description: "Consistent customers with good purchase frequency and moderate spending.",
    recommendation: "Maintain engagement through regular updates and exclusive offers."
  },
  "Potential Loyalist": {
    description: "Recent customers with potential to become loyal. Moderate engagement levels.",
    recommendation: "Nurture with educational content and incentives to increase frequency."
  },
  "At Risk": {
    description: "Customers showing declining engagement. Low recency and spending.",
    recommendation: "Launch win-back campaigns with special offers and personalized outreach."
  },
  "Hibernating": {
    description: "Inactive customers with minimal recent activity. Highest churn risk.",
    recommendation: "Consider re-engagement campaigns, but focus resources on higher-probability segments."
  }
};

export default function SegmentDetailModal({
  isOpen,
  onClose,
  segment,
  data
}: SegmentDetailModalProps) {
  if (!segment || !data[segment]) return null;

  const segmentData = data[segment];
  const description = segmentDescriptions[segment];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{segment} Segment Details</DialogTitle>
          <DialogDescription>{description.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Customer Count
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{segmentData.value?.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{((segmentData.value / 4338) * 100).toFixed(1)}% of total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Avg Recency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{segmentData.recency?.toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-1">days since last purchase</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Avg Frequency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{segmentData.frequency?.toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-1">purchases per customer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Avg Monetary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">£{segmentData.monetary?.toFixed(0)}</p>
                <p className="text-xs text-slate-500 mt-1">total spend</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Churn Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Churn Probability</span>
                    <span className="text-lg font-bold">{(segmentData.churnProbability * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={segmentData.churnProbability > 0.7 ? "bg-red-500" : segmentData.churnProbability > 0.4 ? "bg-amber-500" : "bg-green-500"}
                      style={{ width: `${segmentData.churnProbability * 100}%`, height: "8px", borderRadius: "4px" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-blue-900">Recommended Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800">{description.recommendation}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

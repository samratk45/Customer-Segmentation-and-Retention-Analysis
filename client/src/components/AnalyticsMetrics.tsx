import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";

interface MetricsProps {
  totalCustomers: number;
  avgMonetary: number;
  avgChurnRate: number;
  bestSegmentSize: number;
}

export default function AnalyticsMetrics({
  totalCustomers,
  avgMonetary,
  avgChurnRate,
  bestSegmentSize
}: MetricsProps) {
  const metrics = [
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      change: "+12%",
      positive: true
    },
    {
      title: "Avg Customer Value",
      value: `£${avgMonetary.toFixed(0)}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      change: "+8%",
      positive: true
    },
    {
      title: "Avg Churn Rate",
      value: `${(avgChurnRate * 100).toFixed(1)}%`,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
      change: "-3%",
      positive: true
    },
    {
      title: "Best Customers",
      value: bestSegmentSize.toLocaleString(),
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
      change: "+5%",
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {metric.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
              <p className={`text-xs mt-2 flex items-center gap-1 ${metric.positive ? "text-green-600" : "text-red-600"}`}>
                {metric.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

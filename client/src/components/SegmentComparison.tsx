import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface SegmentComparisonProps {
  rfmData: any[];
  selectedSegments: string[];
}

export default function SegmentComparison({
  rfmData,
  selectedSegments
}: SegmentComparisonProps) {
  const filteredData = rfmData.filter(item => selectedSegments.includes(item.segment));

  // Normalize data for radar chart (0-100 scale)
  const radarData = filteredData.map(item => ({
    segment: item.segment,
    Recency: Math.min((1 - item.recency / 300) * 100, 100),
    Frequency: Math.min((item.frequency / 10) * 100, 100),
    Monetary: Math.min((item.monetary / 6000) * 100, 100)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Segment Comparison - Bar Chart</CardTitle>
          <CardDescription>Compare key metrics across selected segments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="recency" fill="#3b82f6" name="Recency (days)" />
              <Bar yAxisId="right" dataKey="monetary" fill="#10b981" name="Monetary Value (£)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segment Comparison - Radar Chart</CardTitle>
          <CardDescription>Multi-dimensional segment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="segment" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Recency Score" dataKey="Recency" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
              <Radar name="Frequency Score" dataKey="Frequency" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
              <Radar name="Monetary Score" dataKey="Monetary" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Detailed Comparison Table</CardTitle>
          <CardDescription>Exact metrics for selected segments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-4 font-semibold">Segment</th>
                  <th className="text-right py-2 px-4 font-semibold">Recency (days)</th>
                  <th className="text-right py-2 px-4 font-semibold">Frequency</th>
                  <th className="text-right py-2 px-4 font-semibold">Monetary (£)</th>
                  <th className="text-right py-2 px-4 font-semibold">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-4 font-medium">{row.segment}</td>
                    <td className="text-right py-2 px-4">{row.recency.toFixed(1)}</td>
                    <td className="text-right py-2 px-4">{row.frequency.toFixed(2)}</td>
                    <td className="text-right py-2 px-4">£{row.monetary.toFixed(2)}</td>
                    <td className="text-right py-2 px-4 font-semibold">£{(row.monetary * row.frequency).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

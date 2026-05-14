import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Target, AlertCircle } from "lucide-react";
import { useDashboardState } from "@/hooks/useDashboardState";
import FilterPanel from "@/components/FilterPanel";
import ExportToolbar from "@/components/ExportToolbar";
import AnalyticsMetrics from "@/components/AnalyticsMetrics";
import SegmentDetailModal from "@/components/SegmentDetailModal";
import SegmentComparison from "@/components/SegmentComparison";

const segmentData = [
  { name: "Best Customers", value: 1268, color: "#059669" },
  { name: "Loyal Customers", value: 843, color: "#0891b2" },
  { name: "Potential Loyalist", value: 936, color: "#3b82f6" },
  { name: "At Risk", value: 988, color: "#f59e0b" },
  { name: "Hibernating", value: 303, color: "#ef4444" }
];

const rfmData = [
  { segment: "Best Customers", recency: 19.9, frequency: 9.9, monetary: 5397.5 },
  { segment: "Loyal Customers", recency: 52.2, frequency: 3.2, monetary: 1249.6 },
  { segment: "Potential Loyalist", recency: 87.4, frequency: 1.9, monetary: 699.1 },
  { segment: "At Risk", recency: 171.4, frequency: 1.2, monetary: 313.9 },
  { segment: "Hibernating", recency: 267.8, frequency: 1.0, monetary: 163.2 }
];

const churnData = [
  { segment: "Best Customers", probability: 0.15 },
  { segment: "Loyal Customers", probability: 0.28 },
  { segment: "Potential Loyalist", probability: 0.45 },
  { segment: "At Risk", probability: 0.68 },
  { segment: "Hibernating", probability: 0.85 }
];

const codeSnippets = {
  explore: `import pandas as pd
import os

print("Loading dataset...")
if os.path.exists('online_retail.xlsx'):
    try:
        df = pd.read_excel('online_retail.xlsx')
        print(f"Shape: {df.shape}")
        print("\\nColumns:")
        print(df.columns.tolist())
    except Exception as e:
        print(f"Error: {e}")`,
  rfm: `import pandas as pd
import datetime as dt

df = pd.read_csv('cleaned_online_retail.csv', parse_dates=['InvoiceDate'])
snapshot_date = df['InvoiceDate'].max() + dt.timedelta(days=1)

rfm = df.groupby('CustomerID').agg({
    'InvoiceDate': lambda x: (snapshot_date - x.max()).days,
    'InvoiceNo': 'nunique',
    'TotalPrice': 'sum'
})

rfm.rename(columns={
    'InvoiceDate': 'Recency',
    'InvoiceNo': 'Frequency',
    'TotalPrice': 'MonetaryValue'
}, inplace=True)`,
  churn: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X = customer_df[['Frequency', 'MonetaryValue', 'TotalQuantity']]
y = customer_df['Churn']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)`
};

export default function Home() {
  const {
    filters,
    toggleSegmentFilter,
    setMonetaryRange,
    resetFilters,
    selectedSegmentDetail,
    setSelectedSegmentDetail,
    showDetailModal,
    setShowDetailModal
  } = useDashboardState();

  const handleSegmentClick = (segmentName: string) => {
    setSelectedSegmentDetail(segmentName);
    setShowDetailModal(true);
  };

  const segmentDataMap: Record<string, any> = {
    "Best Customers": { value: 1268, recency: 19.9, frequency: 9.9, monetary: 5397.5, churnProbability: 0.15 },
    "Loyal Customers": { value: 843, recency: 52.2, frequency: 3.2, monetary: 1249.6, churnProbability: 0.28 },
    "Potential Loyalist": { value: 936, recency: 87.4, frequency: 1.9, monetary: 699.1, churnProbability: 0.45 },
    "At Risk": { value: 988, recency: 171.4, frequency: 1.2, monetary: 313.9, churnProbability: 0.68 },
    "Hibernating": { value: 303, recency: 267.8, frequency: 1.0, monetary: 163.2, churnProbability: 0.85 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customer Segmentation Dashboard</h1>
            <p className="text-sm text-slate-600">RFM Analysis & Churn Prediction</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container">
          <h2 className="text-4xl font-bold mb-4">Unlock Customer Insights</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl">Analyze customer behavior using RFM segmentation, predict churn, and identify high-value customers for targeted retention strategies.</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-12">
        {/* Analytics Metrics */}
        <section className="mb-12">
          <AnalyticsMetrics
            totalCustomers={4338}
            avgMonetary={1404.5}
            avgChurnRate={0.31}
            bestSegmentSize={1268}
          />
        </section>

        {/* Filters and Export */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FilterPanel
                selectedSegments={filters.selectedSegments}
                onSegmentToggle={toggleSegmentFilter}
                minMonetary={filters.minMonetary}
                maxMonetary={filters.maxMonetary}
                onMonetaryChange={setMonetaryRange}
                onReset={resetFilters}
              />
            </div>
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                  <CardDescription>Download analysis results in CSV format</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExportToolbar
                    segmentData={segmentData}
                    rfmData={rfmData}
                    churnData={churnData}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Segment Overview */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Customer Segments</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {segmentData.map((segment) => (
              <Card
                key={segment.name}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSegmentClick(segment.name)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-700">{segment.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: segment.color, opacity: 0.2 }}></div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{segment.value.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">customers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Segment Comparison */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Segment Comparison</h3>
          <SegmentComparison
            rfmData={rfmData}
            selectedSegments={filters.selectedSegments}
          />
        </section>

        {/* Visualizations */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Analysis Visualizations</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Segment Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Segment Distribution</CardTitle>
                <CardDescription>Customer count by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={segmentData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {segmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* RFM Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Average RFM Values by Segment</CardTitle>
                <CardDescription>Recency, Frequency, and Monetary metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rfmData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="recency" fill="#3b82f6" name="Recency (days)" />
                    <Bar dataKey="frequency" fill="#10b981" name="Frequency" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Churn Probability */}
            <Card>
              <CardHeader>
                <CardTitle>Churn Probability by Segment</CardTitle>
                <CardDescription>Risk assessment for each segment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={churnData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="probability" stroke="#ef4444" strokeWidth={2} name="Churn Probability" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monetary Value Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Monetary Value Distribution</CardTitle>
                <CardDescription>Customer spending patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rfmData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="monetary" fill="#8b5cf6" name="Monetary Value (£)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Business Insights */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Key Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Best Customers Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">Focus on retention and upselling. These 1,268 customers generate the highest revenue (avg £5,397). Implement loyalty programs, early feature access, and personalized communication to maintain their engagement.</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  At Risk Intervention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">988 customers show declining engagement. Target them with win-back campaigns, special discounts, or surveys to understand pain points. Quick action can prevent churn.</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Potential Loyalist Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">936 customers show promise. Nurture them with targeted content, educational resources, and incentives to increase purchase frequency and move them to the Loyal or Best customer segments.</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Hibernating Reactivation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">303 hibernating customers have very low engagement. Consider aggressive re-engagement campaigns or accept that some may not return. Focus resources on higher-probability segments.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Code Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Implementation Code</h3>
          <Card>
            <CardHeader>
              <CardTitle>Python Scripts</CardTitle>
              <CardDescription>View the code used for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="explore" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="explore">Data Exploration</TabsTrigger>
                  <TabsTrigger value="rfm">RFM Analysis</TabsTrigger>
                  <TabsTrigger value="churn">Churn Prediction</TabsTrigger>
                </TabsList>
                <TabsContent value="explore" className="mt-4">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeSnippets.explore}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="rfm" className="mt-4">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeSnippets.rfm}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="churn" className="mt-4">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeSnippets.churn}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Methodology */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Data Cleaning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">Removed cancelled orders, missing values, and invalid transactions. Final dataset: 397,884 transactions from 4,338 unique customers.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. RFM Segmentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">Scored customers on Recency, Frequency, and Monetary value. Combined scores to create 5 distinct segments based on purchasing behavior.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Churn Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">Trained Random Forest model to predict churn (no purchase in 90 days). Achieved 69% accuracy with actionable probability scores.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      <SegmentDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        segment={selectedSegmentDetail}
        data={segmentDataMap}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">About</h4>
              <p className="text-sm">Customer Segmentation and Retention Analysis using RFM methodology and machine learning.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Data Source</h4>
              <p className="text-sm">Online Retail Dataset from UCI Machine Learning Repository (2009-2011)</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Technologies</h4>
              <p className="text-sm">Python, Pandas, Scikit-learn, React, Recharts</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Customer Segmentation Dashboard. Built with data science and modern web technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

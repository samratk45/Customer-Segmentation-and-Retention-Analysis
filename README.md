# Customer-Segmentation-and-Retention-Analysis

A production-ready interactive dashboard for analyzing customer behavior, predicting churn, and identifying high-value segments for targeted retention strategies using RFM (Recency, Frequency, Monetary) analysis.

## Overview

This dashboard enables data-driven decision-making for subscription and platform businesses by providing comprehensive customer segmentation insights. It combines RFM analysis with machine learning-based churn prediction to help you understand customer lifecycle and optimize retention strategies.

Key Industries:Streaming (Netflix, Spotify), SaaS (Slack, Notion), E-commerce (Amazon, Shopify), Ridesharing (Uber, Lyft)

## Features

### Core Analytics
- RFM Segmentation: Analyze customers by Recency, Frequency, and Monetary value
- Churn Prediction: ML-powered risk assessment identifying at-risk customers
- Customer Lifetime Value (CLV): Estimate long-term customer value
- Segment Distribution: Visual breakdown of customer segments

### Interactive Dashboard
- Segment Cards: Click-to-explore customer segment overview with key metrics
- Detail Modals: In-depth metrics and actionable recommendations per segment
- Comparison Tools: Multi-dimensional segment analysis with radar and bar charts
- Interactive Filters: Segment selection and monetary range sliders
- Analytics Metrics: KPI dashboard with key performance indicators

### Data Management
- CSV Export: Download analysis results for stakeholder presentations
- Multiple Export Options: Export segments, RFM metrics, or churn predictions
- Responsive Design: Works seamlessly on desktop, tablet, and mobile

## Architecture

### Tech Stack
- Frontend: React 19 + TypeScript
- Styling: Tailwind CSS 4 + shadcn/ui components
- Visualization: Recharts for interactive charts
- State Management: React Hooks with custom useDashboardState hook
- Build Tool: Vite with HMR support
- Data Analysis: Python (Pandas, NumPy, Scikit-learn)

### Project Structure
```
customer-segmentation-dashboard/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Main dashboard page
│   │   │   └── NotFound.tsx      # 404 page
│   │   ├── components/
│   │   │   ├── FilterPanel.tsx   # Segment filters
│   │   │   ├── ExportToolbar.tsx # Export buttons
│   │   │   ├── AnalyticsMetrics.tsx # KPI cards
│   │   │   ├── SegmentDetailModal.tsx # Detail view
│   │   │   ├── SegmentComparison.tsx # Comparison charts
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── hooks/
│   │   │   └── useDashboardState.ts # State management
│   │   ├── lib/
│   │   │   └── exportUtils.ts   # Export utilities
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx # Theme provider
│   │   ├── index.css            # Global styles & theme
│   │   └── main.tsx             # React entry point
│   └── index.html               # HTML template
├── server/
│   └── index.ts                 # Express server
├── shared/
│   └── const.ts                 # Shared constants
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── README.md                    # This file
```

##  Getting Started

### Prerequisites
- Node.js 22+ and pnpm
- Python 3.8+ (for data analysis scripts)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/customer-segmentation-dashboard.git
cd customer-segmentation-dashboard
```

2. **Install dependencies
```bash
pnpm install
```

3. Start development server
```bash
pnpm dev
```

The dashboard will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

## 📊 Data Preparation

### Required Data Format

The dashboard expects customer transaction data with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| CustomerID | String | Unique customer identifier |
| InvoiceDate | Date | Transaction date |
| Quantity | Integer | Number of items purchased |
| UnitPrice | Float | Price per item |

### Example Data Sources
- Online Retail Dataset** (UCI ML Repository): 397,884 transactions, 4,338 customers
- Kaggle Datasets: E-commerce, telecom, or streaming data
- Your own transaction database

### Data Processing Pipeline

1. Data Cleaning (`clean_data.py`)
   - Remove cancelled orders (negative quantities)
   - Handle missing values
   - Validate data types

2. RFM Calculation (`rfm_analysis.py`)
   - Calculate Recency (days since last purchase)
   - Calculate Frequency (number of purchases)
   - Calculate Monetary (total spending)
   - Assign RFM scores and segments

3. Churn Prediction (`predictive_modeling.py`)
   - Feature engineering
   - Train Random Forest model
   - Generate churn probability scores

4. Visualization (`visualizations.py`)
   - Generate segment distribution charts
   - Create RFM heatmaps
   - Plot churn by segment

## Understanding the Dashboard

### Customer Segments

| Segment | Characteristics | Strategy |
|---------|-----------------|----------|
| Best Customers | High R, F, M | VIP programs, loyalty rewards, early feature access |
| Loyal Customers | Consistent engagement | Regular communication, exclusive offers, community building |
| Potential Loyalist | Recent, low frequency | Educational content, incentives to increase frequency |
| At Risk | Declining engagement | Win-back campaigns, personalized offers, special discounts |
| Hibernating | Inactive, low value | Re-engagement campaigns or focus resources elsewhere |

### Key Metrics

- Recency: Days since last purchase (lower = more recent)
- Frequency: Number of purchases (higher = more engaged)
- Monetary: Total spending (higher = more valuable)
- Churn Probability: Risk of becoming inactive (0-1 scale)
- Customer Lifetime Value: Average revenue per customer

### Interpreting Churn Risk

- 0-20%: Low risk - maintain current engagement
- 20-50%: Moderate risk - increase communication
- 50-80%: High risk - launch win-back campaign
- 80-100%: Critical risk - personalized intervention

##  Customization

### Change Segment Names
Edit `client/src/pages/Home.tsx`:
```typescript
const segmentData = [
  { name: "Your Segment Name", value: 1000, color: "#color" },
  // ...
];
```

### Adjust Churn Threshold
Modify in analysis scripts (default: 90 days):
```python
churn_threshold = 90
```

### Customize Colors
Edit `client/src/index.css`:
```css
--chart-1: #059669;  /* Emerald */
--chart-2: #0891b2;  /* Cyan */
--chart-3: #3b82f6;  /* Blue */
--chart-4: #f59e0b;  /* Amber */
--chart-5: #ef4444;  /* Red */
```

### Add More Metrics
Extend `AnalyticsMetrics.tsx` with additional KPI cards:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Your Metric</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">{value}</p>
  </CardContent>
</Card>
```

##  Exporting Data

The dashboard provides multiple export options:

1. Export Segments: Customer count by segment
2. **Export RFM: RFM metrics by segment
3. Export Churn: Churn probability by segment
4. Export All: Complete analysis in one file

Exported files are in CSV format and can be opened in Excel or imported into BI tools.

##  Development

### Available Scripts

```bash
# Start development server with HMR
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm check

# Format code
pnpm format
```

### Component Development

All UI components use shadcn/ui and Tailwind CSS. To add a new component:

```bash
# Components are already included in the template
# Edit existing components in client/src/components/
```

### State Management

The dashboard uses a custom React hook for state management:

```typescript
const {
  filters,
  toggleSegmentFilter,
  setMonetaryRange,
  resetFilters,
  selectedSegmentDetail,
  setShowDetailModal
} = useDashboardState();
```

## Troubleshooting

### Charts Not Rendering
- Verify data structure matches RFM/Churn interfaces
- Check Recharts is installed: `pnpm list recharts`
- Inspect browser console for errors

### Export Not Working
- Ensure CSV export utility is imported
- Test with sample data first
- Check browser download settings

### Performance Issues
- Implement pagination for large datasets
- Use React.memo for expensive components
- Optimize data queries

### WebSocket Connection Error
- Ensure Vite HMR is configured correctly
- Check `vite.config.ts` for proper HMR settings
- Restart dev server: `pnpm dev`

## Resources

### Documentation
- [RFM Methodology Guide](./docs/rfm_methodology.md)
- [Churn Prediction Models](./docs/churn_prediction.md)
- [Implementation Guide](./docs/implementation_guide.md)

### External Resources
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Documentation](https://react.dev/)

## Deployment

### Deploy to Manus
```bash
# Create checkpoint
webdev_save_checkpoint

# Click Publish button in UI
```

### Deploy to Other Platforms

Vercel:
```bash
pnpm build
vercel deploy
```

Netlify:
```bash
pnpm build
netlify deploy --prod --dir=dist/public
```

Docker:
```bash
docker build -t customer-segmentation-dashboard .
docker run -p 3000:3000 customer-segmentation-dashboard
```

##  Future Enhancements

- Real-time data integration with live database backend
- Advanced filters (date ranges, custom metrics)
- Predictive recommendations engine
- User authentication and role-based access
- Automated report scheduling and email delivery
- Custom segment builder
- Cohort analysis and retention curves
- A/B testing framework for retention campaigns

##  Business Impact

Effective customer segmentation enables:

- Targeted Retention: Focus resources on high-value, at-risk customers
- Personalized Marketing: Tailor campaigns to segment characteristics
- Revenue Optimization: Identify upsell and cross-sell opportunities
- Cost Reduction: Reduce churn and customer acquisition costs
- Strategic Planning: Understand customer lifecycle and trends


##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


Made with ❤️ for data scientist 

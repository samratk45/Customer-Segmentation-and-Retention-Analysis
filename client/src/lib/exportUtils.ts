export const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportSegmentData = (segmentData: any[]) => {
  const data = segmentData.map(segment => ({
    'Segment': segment.name,
    'Customer Count': segment.value,
    'Percentage': `${((segment.value / 4338) * 100).toFixed(2)}%`
  }));
  exportToCSV(data, 'segment_data');
};

export const exportRFMData = (rfmData: any[]) => {
  const data = rfmData.map(row => ({
    'Segment': row.segment,
    'Avg Recency (days)': row.recency.toFixed(2),
    'Avg Frequency': row.frequency.toFixed(2),
    'Avg Monetary Value (£)': row.monetary.toFixed(2)
  }));
  exportToCSV(data, 'rfm_analysis');
};

export const exportChurnData = (churnData: any[]) => {
  const data = churnData.map(row => ({
    'Segment': row.segment,
    'Churn Probability': (row.probability * 100).toFixed(2) + '%'
  }));
  exportToCSV(data, 'churn_prediction');
};

export const generatePDFReport = (title: string, content: string) => {
  const printWindow = window.open('', '', 'height=400,width=800');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1e40af; }
            .content { line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="content">${content}</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

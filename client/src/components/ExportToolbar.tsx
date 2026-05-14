import { Button } from "@/components/ui/button";
import { Download, FileText, Sheet } from "lucide-react";
import { exportSegmentData, exportRFMData, exportChurnData } from "@/lib/exportUtils";
import { toast } from "sonner";

interface ExportToolbarProps {
  segmentData: any[];
  rfmData: any[];
  churnData: any[];
}

export default function ExportToolbar({
  segmentData,
  rfmData,
  churnData
}: ExportToolbarProps) {
  const handleExportSegments = () => {
    try {
      exportSegmentData(segmentData);
      toast.success("Segment data exported as CSV");
    } catch (error) {
      toast.error("Failed to export segment data");
    }
  };

  const handleExportRFM = () => {
    try {
      exportRFMData(rfmData);
      toast.success("RFM analysis exported as CSV");
    } catch (error) {
      toast.error("Failed to export RFM data");
    }
  };

  const handleExportChurn = () => {
    try {
      exportChurnData(churnData);
      toast.success("Churn predictions exported as CSV");
    } catch (error) {
      toast.error("Failed to export churn data");
    }
  };

  const handleExportAll = () => {
    try {
      exportSegmentData(segmentData);
      exportRFMData(rfmData);
      exportChurnData(churnData);
      toast.success("All data exported as CSV files");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportSegments}
        className="gap-2"
      >
        <Sheet className="w-4 h-4" />
        Export Segments
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportRFM}
        className="gap-2"
      >
        <Sheet className="w-4 h-4" />
        Export RFM
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportChurn}
        className="gap-2"
      >
        <Sheet className="w-4 h-4" />
        Export Churn
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={handleExportAll}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Export All
      </Button>
    </div>
  );
}

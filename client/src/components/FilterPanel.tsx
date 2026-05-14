import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { X, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  selectedSegments: string[];
  onSegmentToggle: (segment: string) => void;
  minMonetary: number;
  maxMonetary: number;
  onMonetaryChange: (min: number, max: number) => void;
  onReset: () => void;
}

const segments = ["Best Customers", "Loyal Customers", "Potential Loyalist", "At Risk", "Hibernating"];

export default function FilterPanel({
  selectedSegments,
  onSegmentToggle,
  minMonetary,
  maxMonetary,
  onMonetaryChange,
  onReset
}: FilterPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-sm mb-3">Customer Segments</h3>
          <div className="space-y-2">
            {segments.map((segment) => (
              <div key={segment} className="flex items-center space-x-2">
                <Checkbox
                  id={segment}
                  checked={selectedSegments.includes(segment)}
                  onCheckedChange={() => onSegmentToggle(segment)}
                />
                <label
                  htmlFor={segment}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {segment}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3">Monetary Value Range</h3>
          <div className="space-y-4">
            <Slider
              value={[minMonetary, maxMonetary]}
              onValueChange={(value) => onMonetaryChange(value[0], value[1])}
              min={0}
              max={10000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-600">
              <span>£{minMonetary}</span>
              <span>£{maxMonetary}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

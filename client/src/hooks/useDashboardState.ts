import { useState, useCallback } from 'react';

export interface FilterState {
  selectedSegments: string[];
  dateRange: {
    start: string;
    end: string;
  };
  minMonetary: number;
  maxMonetary: number;
}

export const useDashboardState = () => {
  const [filters, setFilters] = useState<FilterState>({
    selectedSegments: ['Best Customers', 'Loyal Customers', 'Potential Loyalist', 'At Risk', 'Hibernating'],
    dateRange: {
      start: '2009-12-01',
      end: '2011-12-09'
    },
    minMonetary: 0,
    maxMonetary: 10000
  });

  const [selectedSegmentDetail, setSelectedSegmentDetail] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const toggleSegmentFilter = useCallback((segment: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSegments: prev.selectedSegments.includes(segment)
        ? prev.selectedSegments.filter(s => s !== segment)
        : [...prev.selectedSegments, segment]
    }));
  }, []);

  const setDateRange = useCallback((start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end }
    }));
  }, []);

  const setMonetaryRange = useCallback((min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      minMonetary: min,
      maxMonetary: max
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      selectedSegments: ['Best Customers', 'Loyal Customers', 'Potential Loyalist', 'At Risk', 'Hibernating'],
      dateRange: {
        start: '2009-12-01',
        end: '2011-12-09'
      },
      minMonetary: 0,
      maxMonetary: 10000
    });
  }, []);

  return {
    filters,
    toggleSegmentFilter,
    setDateRange,
    setMonetaryRange,
    resetFilters,
    selectedSegmentDetail,
    setSelectedSegmentDetail,
    showDetailModal,
    setShowDetailModal
  };
};

import { Calendar, Filter, RefreshCw, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";
import { Badge } from "../ui/badge";

interface DateFilterProps {
  dateFilter: { startDate: string; endDate: string };
  setDateFilter: React.Dispatch<
    React.SetStateAction<{ startDate: string; endDate: string }>
  >;
  appliedFilter: { startDate: string; endDate: string };
  handleDateFilter: () => void;
  clearDateFilter: () => void;
  handleRefresh: () => void;
  isFilterActive: boolean;
  loading: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const DateFilter: React.FC<DateFilterProps> = ({
  dateFilter,
  setDateFilter,
  appliedFilter,
  handleDateFilter,
  clearDateFilter,
  handleRefresh,
  isFilterActive,
  loading,
  setError,
}) => {
  return (
    <div>
      {/* Date Filter */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter by Date Range
            {isFilterActive && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Start Date
              </label>
              <Input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => {
                  setError(null); // Clear error when user changes input
                  setDateFilter((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }));
                }}
                className="w-full pr-0"
                max={dateFilter.endDate || undefined}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                End Date
              </label>
              <Input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => {
                  setError(null); // Clear error when user changes input
                  setDateFilter((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }));
                }}
                className="w-full"
                min={dateFilter.startDate || undefined}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleDateFilter}
              className="flex-1 cursor-pointer"
              disabled={loading || !dateFilter.startDate || !dateFilter.endDate}
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filter
            </Button>
            <Button
              onClick={clearDateFilter}
              variant="outline"
              disabled={loading}
              className="sm:w-auto cursor-pointer"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filter
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={loading}
              className="sm:w-auto cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Filter Status Display */}
          {isFilterActive && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Showing results from {appliedFilter.startDate} to{" "}
                {appliedFilter.endDate}
              </span>
            </div>
          )}

          {/* Current Filter Preview */}
          {(dateFilter.startDate || dateFilter.endDate) && !isFilterActive && (
            <div className="flex items-center gap-2 text-sm text-amber-600 p-2 bg-amber-50 rounded border border-amber-200">
              <Filter className="w-4 h-4" />
              <span>
                {dateFilter.startDate && dateFilter.endDate
                  ? `Ready to filter from ${dateFilter.startDate} to ${dateFilter.endDate}`
                  : "Select both dates to apply filter"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DateFilter;

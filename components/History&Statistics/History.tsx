"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Calendar,
  Users,
  X,
  ChevronDown,
  ChevronRight,
  BarChart3,
  History as HistoryIcon,
} from "lucide-react";
import PrayerStatistics from "./PrayerStatistics";
import { statusConfig } from "@/utils/constants";
import { getCompletionBadgeColor, historyFormatDate } from "@/utils/functions";
import HistoryHeader from "./HistoryHeader";
import DateFilter from "./DateFilter";
import { DayData, HistoryLog, HistoryResponse, Prayer } from "@/utils/types";

interface HistoryProps {
  userId: string;
}

type ViewMode = "history" | "stats";

const History = ({ userId }: HistoryProps) => {
  const [historyData, setHistoryData] = useState<DayData[]>([]);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [pagination, setPagination] = useState<
    HistoryResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [appliedFilter, setAppliedFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [viewMode, setViewMode] = useState<ViewMode>("history");

  const fetchHistory = async (
    currentPage: number = 1,
    filters?: { startDate: string; endDate: string }
  ) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        userId,
        page: currentPage.toString(),
        limit: "7",
      });

      const activeFilters = filters || appliedFilter;
      if (activeFilters.startDate)
        params.append("startDate", activeFilters.startDate);
      if (activeFilters.endDate)
        params.append("endDate", activeFilters.endDate);

      const res = await fetch(`/api/prayer-logs/history?${params}`);

      if (!res.ok) {
        let errorMessage = "";
        if (res.status === 404) {
          errorMessage =
            "Prayer history not found. Please check if you have any prayer logs recorded.";
        } else if (res.status === 403) {
          errorMessage =
            "You don't have permission to view this prayer history.";
        } else if (res.status === 400) {
          const errorData = await res.json().catch(() => ({}));
          errorMessage =
            errorData.error || "Invalid request. Please check your parameters.";
        } else if (res.status >= 500) {
          errorMessage =
            "Server error occurred. Please try again in a few moments.";
        } else {
          errorMessage = `Failed to load prayer history (Error ${res.status}). Please try again.`;
        }
        throw new Error(errorMessage);
      }

      const data: HistoryResponse = await res.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid data format received from server.");
      }

      setHistoryData(data.data);
      setPrayers(data.prayers || []);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while loading prayer history.";
      setError(errorMessage);
      console.error("Prayer history fetch error:", err);

      // Reset data on error
      setHistoryData([]);
      setPrayers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and page changes
  useEffect(() => {
    if (userId) {
      fetchHistory(page);
    }
  }, [userId, page, appliedFilter.startDate, appliedFilter.endDate]);

  const handleDateFilter = () => {
    // Clear any existing errors
    setError(null);

    // Validate inputs
    if (!dateFilter.startDate || !dateFilter.endDate) {
      setError("Please select both start and end dates for filtering.");
      return;
    }

    if (new Date(dateFilter.startDate) > new Date(dateFilter.endDate)) {
      setError("Start date cannot be later than end date.");
      return;
    }

    // Apply the filter
    setAppliedFilter(dateFilter);
    setPage(1);
    fetchHistory(1, dateFilter);
  };

  const clearDateFilter = () => {
    setError(null);
    setDateFilter({ startDate: "", endDate: "" });
    setAppliedFilter({ startDate: "", endDate: "" });
    setPage(1);
    setExpandedDates(new Set()); // Clear expanded dates when clearing filter
    fetchHistory(1, { startDate: "", endDate: "" });
  };

  const handleRefresh = () => {
    setError(null);
    fetchHistory(page);
  };

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const getStatusForPrayer = (logs: HistoryLog[], prayerId: number) => {
    const log = logs.find((l) => l.prayerId === prayerId);
    return log ? log.status : "UNSET";
  };

  const getCompletionPercentage = (
    logs: HistoryLog[],
    totalPrayers: number
  ) => {
    if (totalPrayers === 0) return 0;
    const completedCount = logs.filter(
      (log) =>
        log.status === "ON_TIME" ||
        log.status === "JAMAAH" ||
        log.status === "LATE"
    ).length;
    return Math.round((completedCount / totalPrayers) * 100);
  };

  const isFilterActive = !!(appliedFilter.startDate || appliedFilter.endDate);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <HistoryHeader />

      {/* View Mode Toggle */}
      <Card className="shadow-sm">
        <CardContent className="">
          <div className="flex justify-around items-center">
            <Button
              onClick={() => setViewMode("history")}
              variant={viewMode === "history" ? "default" : "outline"}
              className={`flex items-center gap-2 cursor-pointer ${
                viewMode === "history"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              <HistoryIcon className="w-4 h-4" />
              History
            </Button>

            <Button
              onClick={() => setViewMode("stats")}
              variant={viewMode === "stats" ? "default" : "outline"}
              className={`flex items-center gap-2 cursor-pointer ${
                viewMode === "stats"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Date Filter - Only show in history view */}
      {viewMode === "history" && (
        <DateFilter
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          appliedFilter={appliedFilter}
          handleDateFilter={handleDateFilter}
          clearDateFilter={clearDateFilter}
          handleRefresh={handleRefresh}
          isFilterActive={isFilterActive}
          loading={loading}
          setError={setError}
        />
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="border-red-200">
          <AlertDescription className="flex items-start gap-2">
            <span className="text-red-600 font-medium">Error:</span>
            <span>{error}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg">Loading prayer history...</span>
          </div>
        </div>
      )}

      {/* History View */}
      {viewMode === "history" && (
        <>
          {/* No Data */}
          {!loading && historyData.length === 0 && !error && (
            <Card className="shadow-sm">
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Prayer History Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  {isFilterActive
                    ? "No prayer logs found for the selected date range. Try adjusting your filter or clear it to see all records."
                    : "You haven't recorded any prayers yet. Start your spiritual journey by logging your first prayer!"}
                </p>
                {isFilterActive && (
                  <Button
                    onClick={clearDateFilter}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filter
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* History Data */}
          {!loading &&
            historyData.map((dayData) => {
              const isExpanded = expandedDates.has(dayData.date);
              const userCompletion = getCompletionPercentage(
                dayData.user.logs,
                prayers.length
              );

              return (
                <Card
                  key={dayData.date}
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Date Header */}
                  <CardHeader
                    className="cursor-pointer hover:bg-gray-50 transition-colors border-b"
                    onClick={() => toggleDateExpansion(dayData.date)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                          {historyFormatDate(dayData.date)}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Your completion:
                          </span>
                          <Badge
                            className={getCompletionBadgeColor(userCompletion)}
                          >
                            {userCompletion}%
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {dayData.friends.length} friend
                          {dayData.friends.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <CardContent className="pt-6 space-y-6">
                      {/* Your Prayers */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Your Prayers
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                          {prayers.map((prayer) => {
                            const status = getStatusForPrayer(
                              dayData.user.logs,
                              prayer.id
                            );
                            const config = statusConfig[status];
                            const Icon = statusConfig[status].label;
                            return (
                              <div
                                key={prayer.id}
                                className="text-center space-y-2"
                              >
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto transition-colors ${config.color}`}
                                  title={`${prayer.name}: ${config.name}`}
                                >
                                  <Icon className="text-white" size={24} />
                                </div>
                                <p className="text-sm text-gray-700 font-medium">
                                  {prayer.name}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Friends' Prayers */}
                      {dayData.friends.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-500" />
                            Friends' Progress
                          </h4>
                          <div className="space-y-4">
                            {dayData.friends.map((friend) => {
                              const friendCompletion = getCompletionPercentage(
                                friend.logs,
                                prayers.length
                              );
                              return (
                                <div
                                  key={friend.friendId}
                                  className="bg-gray-50 rounded-lg p-4 space-y-3"
                                >
                                  <div className="flex justify-between items-center">
                                    <p className="font-medium text-gray-900">
                                      {friend.friendName}
                                    </p>
                                    <Badge
                                      className={getCompletionBadgeColor(
                                        friendCompletion
                                      )}
                                    >
                                      {friendCompletion}%
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-5 gap-6">
                                    {prayers.map((prayer) => {
                                      const status = getStatusForPrayer(
                                        friend.logs,
                                        prayer.id
                                      );
                                      const config = statusConfig[status];
                                      const Icon = statusConfig[status].label;
                                      return (
                                        <div
                                          key={prayer.id}
                                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold transition-colors ${config.color}`}
                                          title={`${prayer.name}: ${config.name}`}
                                        >
                                          <Icon
                                            className="text-white"
                                            size={24}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col justify-between items-center gap-1">
                  <div className="flex justify-center items-center gap-3">
                    <Badge variant="outline">
                      Page {pagination.page} of {pagination.totalPages}
                    </Badge>

                    <Badge variant="outline">
                      Showing {historyData.length} days
                    </Badge>

                    <Badge variant="outline">
                      {pagination.total} total days
                    </Badge>
                  </div>

                  <div className="flex justify-center items-center gap-3">
                    <Button
                      onClick={() => setPage((prev) => prev - 1)}
                      disabled={!pagination.hasPrev || loading}
                      variant="outline"
                    >
                      Previous
                    </Button>

                    <Button
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={!pagination.hasNext || loading}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Stats View */}
      {viewMode === "stats" && (
        <PrayerStatistics historyData={historyData} prayers={prayers} />
      )}
    </div>
  );
};

export default History;

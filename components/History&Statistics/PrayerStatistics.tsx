import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  TrendingUp,
  Users,
  User,
  Clock,
  Calendar,
} from "lucide-react";
import {
  DayCompletion,
  DayData,
  HistoryLog,
  LeaderboardEntry,
  PrayerStatisticsProps,
  Statistics,
} from "@/utils/constants";

export type Prayer = {
  id: number;
  name: string;
};

const PrayerStatistics: React.FC<PrayerStatisticsProps> = ({
  historyData,
  prayers,
}) => {
  // Calculate statistics from the fetched data
  const calculateStatistics = (): Statistics => {
    if (!historyData.length || !prayers.length) {
      return {
        totalPrayers: 0,
        onTime: { count: 0, percentage: 0 },
        late: { count: 0, percentage: 0 },
        jamaah: { count: 0, percentage: 0 },
        unset: { count: 0, percentage: 0 },
        overallCompletion: 0,
        dailyAverage: 0,
        totalDays: 0,
      };
    }

    let onTimeCount = 0;
    let lateCount = 0;
    let jamaahCount = 0;
    let unsetCount = 0;
    let totalPossiblePrayers = 0;
    let dailyCompletions: DayCompletion[] = [];

    historyData.forEach((dayData) => {
      const userLogs = dayData.user.logs;
      const dayCompletion = getCompletionPercentage(userLogs, prayers.length);
      dailyCompletions.push({
        date: dayData.date,
        completion: dayCompletion,
      });

      // Count each prayer status
      prayers.forEach((prayer) => {
        const log = userLogs.find((l) => l.prayerId === prayer.id);
        if (log) {
          switch (log.status) {
            case "ON_TIME":
              onTimeCount++;
              break;
            case "LATE":
              lateCount++;
              break;
            case "JAMAAH":
              jamaahCount++;
              break;
          }
        } else {
          unsetCount++;
        }
        totalPossiblePrayers++;
      });
    });

    const completedPrayers = onTimeCount + lateCount + jamaahCount;
    const overallCompletion =
      totalPossiblePrayers > 0
        ? Math.round((completedPrayers / totalPossiblePrayers) * 100)
        : 0;

    const dailyAverage =
      dailyCompletions.length > 0
        ? Math.round(
            dailyCompletions.reduce((sum, day) => sum + day.completion, 0) /
              dailyCompletions.length
          )
        : 0;

    return {
      totalPrayers: totalPossiblePrayers,
      onTime: {
        count: onTimeCount,
        percentage:
          totalPossiblePrayers > 0
            ? Math.round((onTimeCount / totalPossiblePrayers) * 100)
            : 0,
      },
      late: {
        count: lateCount,
        percentage:
          totalPossiblePrayers > 0
            ? Math.round((lateCount / totalPossiblePrayers) * 100)
            : 0,
      },
      jamaah: {
        count: jamaahCount,
        percentage:
          totalPossiblePrayers > 0
            ? Math.round((jamaahCount / totalPossiblePrayers) * 100)
            : 0,
      },
      unset: {
        count: unsetCount,
        percentage:
          totalPossiblePrayers > 0
            ? Math.round((unsetCount / totalPossiblePrayers) * 100)
            : 0,
      },
      overallCompletion,
      dailyAverage,
      totalDays: historyData.length,
    };
  };

  const getCompletionPercentage = (
    logs: HistoryLog[],
    totalPrayers: number
  ): number => {
    if (totalPrayers === 0) return 0;
    const completedCount = logs.filter(
      (log) =>
        log.status === "ON_TIME" ||
        log.status === "JAMAAH" ||
        log.status === "LATE"
    ).length;
    return Math.round((completedCount / totalPrayers) * 100);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1); // Adjust for your date display logic
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const getCompletionBadgeColor = (percentage: number): string => {
    if (percentage >= 80) return "bg-emerald-100 text-emerald-800";
    if (percentage >= 60) return "bg-amber-100 text-amber-800";
    if (percentage >= 40) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const stats = calculateStatistics();

  const calculateLeaderboard = (): LeaderboardEntry[] => {
    if (!historyData.length) return [];

    const leaderboard: LeaderboardEntry[] = [];

    // Calculate user's points
    let userPoints = 0;
    historyData.forEach((dayData) => {
      dayData.user.logs.forEach((log) => {
        switch (log.status) {
          case "JAMAAH":
            userPoints += 3;
            break;
          case "ON_TIME":
            userPoints += 2;
            break;
          case "LATE":
            userPoints += 1;
            break;
        }
      });
    });

    leaderboard.push({
      name: "You",
      points: userPoints,
      isCurrentUser: true,
    });

    // Calculate friends' points
    const friendsPoints: { [key: string]: number } = {};
    historyData.forEach((dayData) => {
      dayData.friends.forEach((friend) => {
        if (!friendsPoints[friend.friendId]) {
          friendsPoints[friend.friendId] = 0;
        }
        friend.logs.forEach((log) => {
          switch (log.status) {
            case "JAMAAH":
              friendsPoints[friend.friendId] += 3;
              break;
            case "ON_TIME":
              friendsPoints[friend.friendId] += 2;
              break;
            case "LATE":
              friendsPoints[friend.friendId] += 1;
              break;
          }
        });
      });
    });

    // Get friend names and add to leaderboard
    const friendNames: { [key: string]: string } = {};
    historyData.forEach((dayData) => {
      dayData.friends.forEach((friend) => {
        friendNames[friend.friendId] = friend.friendName;
      });
    });

    Object.entries(friendsPoints).forEach(([friendId, points]) => {
      leaderboard.push({
        name: friendNames[friendId] || "Unknown",
        points,
        isCurrentUser: false,
      });
    });

    // Sort by points (descending)
    return leaderboard.sort((a, b) => b.points - a.points);
  };

  if (!historyData.length) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="w-5 h-5 text-blue-600" />
          Statistics for Current Page
          <Badge variant="outline" className="ml-2">
            {stats.totalDays} days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Prayer Status Breakdown
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* On Time */}
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  On Time
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-800">
                  {stats.onTime.count}
                </div>
                <div className="text-xs text-emerald-600">
                  {stats.onTime.percentage}%
                </div>
              </div>
            </div>

            {/* Jamaah */}
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">
                  Jamaah
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-800">
                  {stats.jamaah.count}
                </div>
                <div className="text-xs text-amber-600">
                  {stats.jamaah.percentage}%
                </div>
              </div>
            </div>

            {/* Late */}
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">Late</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-800">
                  {stats.late.count}
                </div>
                <div className="text-xs text-red-600">
                  {stats.late.percentage}%
                </div>
              </div>
            </div>

            {/* Not Set */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Not Set
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">
                  {stats.unset.count}
                </div>
                <div className="text-xs text-gray-600">
                  {stats.unset.percentage}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-700 space-y-1">
            {stats.jamaah.count > 0 && (
              <p>
                🕌 Great job praying {stats.jamaah.count} prayers in Jamaah!
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            📊 Leaderboard
          </h4>

          <div className="space-y-2">
            {calculateLeaderboard().map((entry, index) => (
              <div
                key={entry.name}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  entry.isCurrentUser
                    ? index === 0
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                    : index === 0
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {index === 0 ? (
                      <div className="text-2xl">👑</div>
                    ) : index === 1 ? (
                      <div className="text-2xl">🥈</div>
                    ) : index === 2 ? (
                      <div className="text-2xl">🥉</div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{index + 1}
                      </div>
                      <div className="text-sm text-gray-600">{entry.name}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">
                    {entry.points} pts
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scoring Rules */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h5 className="font-medium text-gray-900 mb-2">Scoring Rules</h5>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• Jamaah: 3 Points</p>
              <p>• On time (Alone): 2 Points</p>
              <p>• Late: 1 Point</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerStatistics;

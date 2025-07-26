"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { User } from "next-auth";
import { UserPlus, Users, AlertCircle } from "lucide-react";
import FriendCard from "./FriendCard";
import AddFriendDrawer from "./AddFriendDrawer";
import { Friend, FriendLogSummary } from "@/utils/types";
import { friendsStatusStyles } from "@/utils/constants";
import { formatDate } from "@/utils/functions";

interface FriendsSharingProps {
  user: User;
  selectedDate: Date;
}

const FriendsSharing = ({ user, selectedDate }: FriendsSharingProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [friendLogs, setFriendLogs] = useState<FriendLogSummary[]>([]);
  const [error, setError] = useState("");
  const [logsError, setLogsError] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [userId] = useState<string | undefined>(user?.id);
  const [userName] = useState<string | undefined | null>(user?.name);

  const fetchFriends = useCallback(async () => {
    try {
      setFriendsLoading(true);
      setError("");
      const res = await fetch(`/api/friends?userId=${userId}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to load friends");
      }

      const data = await res.json();
      setFriends(data);
    } catch (err) {
      setError("Unable to load friends. Please try again.");
      console.error("Error fetching friends:", err);
    } finally {
      setFriendsLoading(false);
    }
  }, [userId]);

  const fetchLogs = useCallback(async () => {
    try {
      setLogsLoading(true);
      setLogsError("");
      const res = await fetch(
        `/api/friends/logs?userId=${userId}&date=${selectedDate.toLocaleDateString(
          "en-CA"
        )}`
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to load prayer logs (${res.status})`
        );
      }

      const data = await res.json();
      setFriendLogs(data);
    } catch (err) {
      setLogsError("Unable to load prayer logs. Please try again.");
      console.error("Error fetching logs:", err);
    } finally {
      setLogsLoading(false);
    }
  }, [userId, selectedDate]);

  useEffect(() => {
    fetchFriends();
  }, [userId]);

  useEffect(() => {
    fetchLogs();
  }, [userId, selectedDate]);

  const handleAddFriend = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      setAddLoading(true);

      try {
        const res = await fetch("/api/friends", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, email: email.trim() }),
        });

        const data = await res.json();

        if (res.ok) {
          setFriends(data);
          fetchLogs(); // Refresh logs after adding friend
          return { success: true };
        } else {
          // Enhanced error messages based on common scenarios
          let errorMessage = data.error || "Failed to add friend";

          if (res.status === 404) {
            errorMessage = "User not found. Please check the email address.";
          } else if (res.status === 409) {
            errorMessage =
              data.error || "This user is already in your friends list.";
          } else if (res.status === 400) {
            errorMessage = data.error || "Invalid email address provided.";
          } else if (res.status >= 500) {
            errorMessage = "Server error occurred. Please try again later.";
          }

          return { success: false, error: errorMessage };
        }
      } catch (err) {
        console.error("Error adding friend:", err);
        return {
          success: false,
          error:
            "Unable to add friend. Please check your connection and try again.",
        };
      } finally {
        setAddLoading(false);
      }
    },
    [userId, fetchLogs]
  );

  const handleRemoveFriend = useCallback(
    async (friendId: string) => {
      setRemoveLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/friends?userId=${userId}&friendId=${friendId}`,
          {
            method: "DELETE",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setFriends(data);
          // Optimistically remove from logs as well
          setFriendLogs((prev) =>
            prev.filter((log) => log.friendId !== friendId)
          );
          fetchLogs();
        } else {
          const errorData = await res.json().catch(() => ({}));
          let errorMessage = errorData.error || "Failed to remove friend";

          if (res.status === 404) {
            errorMessage = "Friend not found or already removed.";
          } else if (res.status >= 500) {
            errorMessage = "Server error occurred. Please try again later.";
          }

          setError(errorMessage);
        }
      } catch (err) {
        setError(
          "Unable to remove friend. Please check your connection and try again."
        );
        console.error("Error removing friend:", err);
      } finally {
        setRemoveLoading(false);
      }
    },
    [userId, fetchLogs]
  );

  const totalJamaah = useMemo(() => {
    return friendLogs.reduce((total, log) => {
      return (
        total +
        log.logs.filter((prayerLog) => prayerLog.status === "JAMAAH").length
      );
    }, 0);
  }, [friendLogs]);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
      <div className="container mx-auto max-w-md p-4">
        {/* Header */}
        <header className="flex justify-between items-center py-6">
          <div className="flex flex-col">
            <div className="flex justify-start items-center max-w-[260px] truncate">
              <span className="text-xl font-bold text-gray-900">
                Prayer Circle
              </span>
              {userName && (
                <span className="text-base font-medium text-gray-800">
                  , {userName}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(selectedDate)}
            </p>
          </div>
          <button
            onClick={() => setShowAddFriend(true)}
            className="bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
            title="Add friend"
          >
            <UserPlus size={20} />
          </button>
        </header>

        {/* Main Error Banner */}
        {error && (
          <div className="bg-red-100 text-red-700 mb-4 p-3 rounded-lg flex items-center space-x-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Your Circle
                  </h3>
                  {friendsLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {friends.length}{" "}
                      {friends.length === 1 ? "friend" : "friends"}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                {logsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-8 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-green-600">
                      {totalJamaah}
                    </p>
                    <p className="text-xs text-gray-500">jamaah today</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">Prayer Status</h3>
            <div className="flex justify-between">
              {Object.entries(friendsStatusStyles).map(([key, style]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${style.color}`}></div>
                  <span className="text-xs text-gray-600">{style.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Friends List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Friends Prayer Status
            </h2>
            {logsError && (
              <div className="flex items-center space-x-1 text-red-500">
                <AlertCircle size={14} />
                <p className="text-xs">{logsError}</p>
              </div>
            )}
          </div>

          {friendsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : friends.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <Users className="mx-auto text-gray-400" size={48} />
              <h3 className="font-medium text-gray-900 mt-4">No friends yet</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add friends to see their prayer status
              </p>
              <button
                type="button"
                onClick={() => setShowAddFriend(true)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Add Friend
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  friendLogs={friendLogs}
                  onRemove={handleRemoveFriend}
                  removeLoading={removeLoading}
                  isLoadingLogs={logsLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Friend Drawer */}
      <AddFriendDrawer
        isOpen={showAddFriend}
        onClose={() => setShowAddFriend(false)}
        onAddFriend={handleAddFriend}
        isLoading={addLoading}
      />
    </div>
  );
};

export default FriendsSharing;

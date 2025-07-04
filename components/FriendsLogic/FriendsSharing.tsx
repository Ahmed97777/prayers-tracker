"use client";
import React, { useState, useEffect } from "react";
import { UserPlus, Users, AlertCircle } from "lucide-react";
import FriendCard from "./FriendCard";
import {
  Friend,
  FriendLogSummary,
  friendsStatusStyles,
} from "@/utils/constants";
import AddFriendDrawer from "./AddFriendDrawer";
import { formatDate } from "@/utils/functions";

interface FriendManagerProps {
  userId: string;
  selectedDate: Date;
}

const FriendsManagerWithShadcn = ({
  userId,
  selectedDate,
}: FriendManagerProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [friendLogs, setFriendLogs] = useState<FriendLogSummary[]>([]);
  const [error, setError] = useState("");
  const [logsError, setLogsError] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);

  // Enhanced error handling function
  const getErrorMessage = (error: any, defaultMessage: string): string => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    return defaultMessage;
  };

  // Fetch friends with enhanced error handling
  const fetchFriends = async () => {
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
  };

  // Fetch friends' logs for selected date with enhanced error handling
  const fetchLogs = async () => {
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
      const errorMessage = getErrorMessage(
        err,
        "Unable to load prayer logs. Please try again."
      );
      setLogsError(errorMessage);
      console.error("Error fetching logs:", err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [userId]);

  useEffect(() => {
    fetchLogs();
  }, [userId, selectedDate]);

  const handleAddFriend = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
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
      const errorMessage = getErrorMessage(
        err,
        "Unable to add friend. Please check your connection and try again."
      );
      console.error("Error adding friend:", err);
      return { success: false, error: errorMessage };
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
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
        fetchLogs(); // Refresh logs after removing friend
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
      const errorMessage = getErrorMessage(
        err,
        "Unable to remove friend. Please check your connection and try again."
      );
      setError(errorMessage);
      console.error("Error removing friend:", err);
    } finally {
      setRemoveLoading(false);
    }
  };

  // Calculate total Jamaah prayers
  const totalJamaah = friendLogs.reduce((total, log) => {
    return (
      total +
      log.logs.filter((prayerLog) => prayerLog.status === "JAMAAH").length
    );
  }, 0);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
      <div className="container mx-auto max-w-md p-4">
        {/* Header */}
        <header className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Prayer Circle</h1>
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
                  <p className="text-sm text-gray-500">
                    {friends.length}{" "}
                    {friends.length === 1 ? "friend" : "friends"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {totalJamaah}
                </p>
                <p className="text-xs text-gray-500">jamaah today</p>
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
              <div className="loading loading-spinner loading-lg text-green-600"></div>
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

export default FriendsManagerWithShadcn;

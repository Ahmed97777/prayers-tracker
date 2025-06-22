"use client";
import React, { useState } from 'react';
import { 
  UserPlus, 
  Users, 
  Moon, 
  Sun, 
  CloudSun, 
  Sunset, 
  MoonStar, 
  Clock, 
  User, 
  Mail,
  ArrowLeft,
  Search,
  Check,
  X
} from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";

const prayers = [
  { name: 'Fajr', icon: Moon },
  { name: 'Dhuhr', icon: Sun },
  { name: 'Asr', icon: CloudSun },
  { name: 'Maghrib', icon: Sunset },
  { name: 'Isha', icon: MoonStar },
];

const statusStyles = {
  late: { color: 'bg-red-500', icon: Clock, label: 'Late', textColor: 'text-red-600', bgColor: 'bg-red-50' },
  'on-time': { color: 'bg-green-500', icon: User, label: 'On time', textColor: 'text-green-600', bgColor: 'bg-green-50' },
  jamaah: { color: 'bg-yellow-500', icon: Users, label: 'In jamaah', textColor: 'text-yellow-600', bgColor: 'bg-yellow-50' },
};

// Mock friends data
const mockFriends = [
  {
    id: 1,
    name: 'Ahmed Ali',
    email: 'ahmed@example.com',
    avatar: 'AA',
    prayers: {
      Fajr: 'jamaah',
      Dhuhr: 'on-time',
      Asr: null,
      Maghrib: null,
      Isha: null,
    }
  },
  {
    id: 2,
    name: 'Sarah Mohamed',
    email: 'sarah@example.com',
    avatar: 'SM',
    prayers: {
      Fajr: 'on-time',
      Dhuhr: 'jamaah',
      Asr: 'late',
      Maghrib: null,
      Isha: null,
    }
  },
  {
    id: 3,
    name: 'Omar Hassan',
    email: 'omar@example.com',
    avatar: 'OH',
    prayers: {
      Fajr: 'late',
      Dhuhr: 'jamaah',
      Asr: 'on-time',
      Maghrib: 'jamaah',
      Isha: null,
    }
  },
  {
    id: 4,
    name: 'Fatima Khan',
    email: 'fatima@example.com',
    avatar: 'FK',
    prayers: {
      Fajr: 'jamaah',
      Dhuhr: 'jamaah',
      Asr: 'jamaah',
      Maghrib: 'on-time',
      Isha: 'jamaah',
    }
  },
];

const FriendCard = ({ friend }: { friend: typeof mockFriends[0] }) => {
  const completedPrayers = Object.values(friend.prayers).filter(p => p !== null).length;
  const totalPrayers = 5;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{friend.avatar}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{friend.name}</h3>
            <p className="text-sm text-gray-500">{friend.email}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{completedPrayers}/{totalPrayers}</p>
          <p className="text-xs text-gray-500">prayers</p>
        </div>
      </div>
      
      <div className="flex justify-between space-x-2">
        {prayers.map((prayer) => {
          const status = friend.prayers[prayer.name as keyof typeof friend.prayers];
          const statusInfo = status ? statusStyles[status as keyof typeof statusStyles] : null;
          const Icon = prayer.icon;
          
          return (
            <div key={prayer.name} className="flex flex-col items-center space-y-1">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                statusInfo ? statusInfo.bgColor : 'bg-gray-100'
              }`}>
                <Icon size={16} className={statusInfo ? statusInfo.textColor : 'text-gray-400'} />
              </div>
              {statusInfo && (
                <div className={`w-2 h-2 rounded-full ${statusInfo.color}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AddFriendDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        { id: 5, name: 'Yusuf Ibrahim', email: 'yusuf@example.com', avatar: 'YI' },
        { id: 6, name: 'Aisha Rahman', email: 'aisha@example.com', avatar: 'AR' },
      ].filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
      
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  const handleAddFriend = (user: any) => {
    // Simulate adding friend
    console.log('Adding friend:', user);
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <DrawerTitle className="text-xl font-bold text-gray-900">
                Add Friend
              </DrawerTitle>
              <DrawerDescription className="text-gray-600">
                Search for friends by email to share your prayer journey
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        
        <div className="px-4 pb-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Enter friend's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!email.trim() || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Search size={18} />
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </button>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Search Results</h3>
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{user.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFriend(user)}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors duration-200"
                  >
                    <UserPlus size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default function FriendsPage() {
  const [showAddFriend, setShowAddFriend] = useState(false);

  const formatDate = (date: Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const fixedDate = new Date(2025, 5, 14);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
      <div className="container mx-auto max-w-md p-4">
        {/* Header */}
        <header className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Prayer Circle</h1>
            <p className="text-sm text-gray-600 mt-1">{formatDate(fixedDate)}</p>
          </div>
          <button 
            onClick={() => setShowAddFriend(true)}
            className="bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
          >
            <UserPlus size={20} />
          </button>
        </header>

        {/* Stats Overview */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Your Circle</h3>
                  <p className="text-sm text-gray-500">{mockFriends.length} friends</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">12</p>
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
              {Object.entries(statusStyles).map(([key, style]) => (
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
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
            Friends Prayer Status
          </h2>
          <div className="space-y-3">
            {mockFriends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        </div>
      </div>

      {/* Add Friend Drawer */}
      <AddFriendDrawer 
        isOpen={showAddFriend} 
        onClose={() => setShowAddFriend(false)} 
      />
    </div>
  );
}
"use client";
import React, { useState } from 'react';
import { Plus, Moon, Sun, CloudSun, Sunset, MoonStar, Clock, User, Users, X, Ban, Clock4 } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import FriendsPage from '@/components/logic/FriendsSharing';

const prayers = [
  { name: 'Fajr', icon: Moon, status: 'late' as const },
  { name: 'Dhuhr', icon: Sun, status: 'on-time' as const },
  { name: 'Asr', icon: CloudSun, status: 'none' as const },
  { name: 'Maghrib', icon: Sunset, status: 'none' as const },
  { name: 'Isha', icon: MoonStar, status: 'none' as const},
];

const statusStyles = {
  late: { color: 'bg-red-500', icon: Clock, label: 'Late', textColor: 'text-red-600' },
  'on-time': { color: 'bg-green-500', icon: User, label: 'On time', textColor: 'text-green-600' },
  jamaah: { color: 'bg-yellow-500', icon: Users, label: 'In jamaah', textColor: 'text-yellow-600' },
  'not-prayed': { color: 'bg-gray-400', icon: Ban, label: 'Not prayed', textColor: 'text-gray-600' },
  none: { color: 'bg-gray-200', icon: null, label: 'Pending', textColor: 'text-gray-400' },
};

const fixedDate = new Date(2025, 5, 14);

const formatDate = (date: Date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

const DayButton = ({ day, date, selected }: { day: string; date: number; selected?: boolean }) => (
  <button
    className={`flex flex-col items-center justify-center w-12 h-16 rounded-xl transition-all duration-200 ${
      selected 
        ? 'bg-blue-600 text-white shadow-lg scale-105' 
        : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100'
    }`}
  >
    <span className="text-xs font-medium">{day}</span>
    <span className="text-lg font-bold mt-1">{date}</span>
  </button>
);

const PrayerCard = ({ prayer, onSelect }: { prayer: typeof prayers[0], onSelect: () => void }) => {
  const Icon = prayer.icon;
  const statusInfo = statusStyles[prayer.status];
  const StatusIcon = statusInfo.icon;

  return (
    <DrawerTrigger asChild onClick={onSelect}>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Icon className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{prayer.name}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {StatusIcon && (
              <div className={`w-8 h-8 rounded-full ${statusInfo.color} flex items-center justify-center`}>
                <StatusIcon size={16} className="text-white" />
              </div>
            )}
            <span className={`text-sm font-medium ${statusInfo.textColor}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>
    </DrawerTrigger>
  );
};

export default function Home() {
  const [selectedPrayer, setSelectedPrayer] = useState<typeof prayers[0] | null>(null);

  const week = [
    { day: 'SUN', date: 8 },
    { day: 'MON', date: 9 },
    { day: 'TUE', date: 10 },
    { day: 'WED', date: 11 },
    { day: 'THU', date: 12 },
    { day: 'FRI', date: 13 },
    { day: 'SAT', date: 14 },
  ];

  const prayerStatusOptions = [
    { id: 'late', label: 'Late', icon: Clock4, color: 'hover:bg-red-50 hover:border-red-200' },
    { id: 'on-time', label: 'On time', icon: User, color: 'hover:bg-green-50 hover:border-green-200' },
    { id: 'jamaah', label: 'In jamaah', icon: Users, color: 'hover:bg-yellow-50 hover:border-yellow-200' },
  ];

  return (
    <>
    <Drawer open={!!selectedPrayer} onOpenChange={(isOpen) => !isOpen && setSelectedPrayer(null)}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="container mx-auto max-w-md p-4">
          {/* Header */}
          <header className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Today, {formatDate(fixedDate)}
              </h1>
              <p className="text-sm text-gray-600 mt-1">18 Thul-Hijjah 1446</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200">
              <Plus size={20} />
            </button>
          </header>

          {/* Week Navigation */}
          <div className="mb-8">
            <div className="flex justify-between space-x-1">
              {week.map((dayInfo) => (
                <DayButton key={dayInfo.day} {...dayInfo} selected={dayInfo.day === 'SAT'} />
              ))}
            </div>
          </div>

          {/* Prayers Section */}
          <div>
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
              Today's Prayers
            </h2>
            <div className="space-y-3">
              {prayers.map((prayer) => (
                <PrayerCard key={prayer.name} prayer={prayer} onSelect={() => setSelectedPrayer(prayer)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="pb-4">
          {selectedPrayer && (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <selectedPrayer.icon size={32} className="text-blue-600" />
              </div>
              <DrawerTitle className="text-xl font-bold text-gray-900">
                {selectedPrayer.name} Prayer
              </DrawerTitle>
              <DrawerDescription className="text-gray-600 mt-2">
                How did you complete your {selectedPrayer.name} prayer today?
              </DrawerDescription>
            </div>
          )}
        </DrawerHeader>
        
        <div className="px-4 pb-6">
          <div className="space-y-2">
            {prayerStatusOptions.map((option) => (
              <button 
                key={option.id} 
                className={`w-full flex items-center p-4 rounded-xl border border-gray-200 text-left transition-all duration-200 ${option.color}`}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <option.icon className="text-gray-600" size={20} />
                </div>
                <span className="font-medium text-gray-900">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>

     {/* Friends Sharing */}
    <FriendsPage/>

    </>
  );
}
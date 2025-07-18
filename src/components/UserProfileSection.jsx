import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export const UserProfileSection = () => {
  // Navigation menu items data
  const menuItems = [
    { icon: HomeIcon, label: "ホーム", active: true, url: "/home" },
    { icon: SearchIcon, label: "検索", active: false, url: "/search" },
    { icon: BellIcon, label: "通知", active: false, url: "/notifications" },
    { icon: MailIcon, label: "受信箱", active: false, url: "/messages" },
    { icon: UserIcon, label: "Profile", active: false, url: "profile" },
  ];

  return (
    <aside className="flex flex-col w-64 items-start gap-6 p-4 relative bg-white border-r border-solid border">
      {/* Brand/Logo Section */}
      <div className="flex items-center gap-3 relative self-stretch w-full">
        <div className="flex w-10 h-10 items-center justify-center relative bg-[#1d9bf0] rounded-lg">
          <span className="font-bold text-white">Kw</span>
        </div>
        <h1 className="font-bold text-xl text-[#314158]">Kwitter</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col items-start gap-2 relative self-stretch w-full">
        {menuItems.map((item, index) => (
          <Link
            href={item.url}
            key={index}
            className={`flex h-12 items-center gap-3 px-[15px] py-3 relative self-stretch w-full rounded-lg hover:bg-slate-100 ${
              item.active ? "bg-slate-100" : ""
            }`}
          >
            <div className="inline-flex h-9 items-center justify-center gap-1.5 py-2 relative">
              <item.icon
                className={`w-5 h-5 ${
                  item.active ? "text-[#1d9bf0]" : "text-[#62748e]"
                }`}
              />
              <span
                className={`font-semibold text-center whitespace-nowrap ${
                  item.active ? "text-[#1d9bf0]" : "text-[#62748e]"
                }`}
              >
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="flex flex-col items-start gap-4 pt-4 pb-0 px-0 relative self-stretch w-full">
        {/* User Info */}
        <div className="items-center gap-3 self-stretch w-full flex relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/avatar-4.png" alt="Koji Ando" />
            <AvatarFallback>KA</AvatarFallback>
          </Avatar>

          <div className="flex-col items-start gap-0.5 flex-1 grow flex relative">
            <span className="self-stretch font-semibold text-sm text-[#314158]">
              Koji Ando
            </span>
            <span className="self-stretch text-xs text-[#62748e]">@koji</span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="flex h-10 items-center justify-center gap-2 p-2 relative self-stretch w-full bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          <LogOutIcon className="w-5 h-5 text-[#62748e]" />
          <span className="font-semibold text-[#62748e]">ログアウト</span>
        </Button>
      </div>
    </aside>
  );
};

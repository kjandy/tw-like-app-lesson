"use client";

// 他のモジュールやライブラリを読み込んでいます
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// 他のモジュールやライブラリを読み込んでいます
import { Button } from "@/components/ui/button";
// 他のモジュールやライブラリを読み込んでいます
import { useAuth } from "@/lib/auth-context";
// 他のモジュールやライブラリを読み込んでいます
import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
// 他のモジュールやライブラリを読み込んでいます
import Link from "next/link";
// 他のモジュールやライブラリを読み込んでいます
import { usePathname, useRouter } from "next/navigation";
// 他のモジュールやライブラリを読み込んでいます
import React from "react";

export const Navigation = () => {
  // Navigation menu items data
  const menuItems = [
    { icon: HomeIcon, label: "ホーム", url: "/home" },
    { icon: SearchIcon, label: "検索", url: "/search" },
    { icon: BellIcon, label: "通知", url: "/notifications" },
    { icon: MailIcon, label: "受信箱", url: "/messages" },
    // { icon: UserIcon, label: "Profile", url: "profile" },
  ];
  const { logout, user, userProfile } = useAuth();
  const router = useRouter();
  // usePathname: 現在のページのパスを取得するNext.jsのフック
  // 例: "/home"、"/search"など
  const pathname = usePathname();
  //ログアウト処理の関数
  const handleLogout = async () => {
    try {
      // const result = await logout();
      await logout();
      // if (result.success) {
      //   setTimeout(() => {
      //     // window.location.href = "/";
      //     router.push("/");
      //   }, 1000);
      // }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  // ここから画面に表示する内容を記述します
  return (
    <aside className="z-10 w-full md:w-64 fixed md:sticky bottom-0 left-0 right-0 md:top-0 md:bottom-auto md:right-auto flex flex-col items-start md:gap-6 px-4 py-2 md:py-10 bg-white border-r border-solid border">
      {/* Brand/Logo Section */}
      <div className="flex items-center justify-center md:justify-start gap-3 relative self-stretch w-full">
        {/* ロゴ - デスクトップのみ表示 */}
        {/* hidden md:block: モバイルでは非表示、デスクトップでは表示 */}
        <div className="z-10 fixed md:relative top-4 md:top-auto flex w-10 h-10 items-center justify-center bg-[#1d9bf0] rounded-lg">
          <span className="font-bold text-white">Kw</span>
        </div>
        <h1 className="hidden md:block font-bold text-xl text-[#314158]">
          Kwitter
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex justify-around md:flex-col items-start gap-2 relative self-stretch w-full">
        {menuItems.map((item, index) => {
          // アイコンコンポーネントを取得
          const Icon = item.icon;
          // 現在のページかどうかを判定（アクティブ状態）
          const isActive = pathname === item.url;
          // ここから画面に表示する内容を記述します
          return (
            <Button
              key={index}
              asChild
              variant={isActive ? "default" : "ghost"}
              className={`flex items-center justify-center md:justify-start w-12 h-12 md:w-full md:h-auto md:px-4 md:py-3 gap-1.5 py-2rounded-lg hover:bg-slate-100 ${
                isActive ? "bg-slate-100" : ""
              }`}
            >
              <Link
                href={item.url}
                className="md:w-full"
                // className={`flex h-12 items-center gap-3 px-[15px] py-3 relative self-stretch w-full rounded-lg hover:bg-slate-100 ${
                //   item.active ? "bg-slate-100" : ""
                // }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "text-[#1d9bf0]" : "text-[#62748e]"
                  }`}
                />
                <span
                  className={`hidden md:inline font-semibold text-center whitespace-nowrap ${
                    isActive ? "text-[#1d9bf0]" : "text-[#62748e]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="fixed top-0 left-0 md:relative flex flex-col items-start gap-4 pt-4 pb-4 md:pb-0 px-0 self-stretch w-full bg-white">
        {/* User Info */}
        <div className="pl-6 md:pl-0 flex justify-start md:justify-start items-center gap-3 self-stretch w-full relative">
          {/* <Avatar className="w-10 h-10">
            <AvatarImage src="/avatar-4.png" alt="Koji Ando" />
            <AvatarFallback>KA</AvatarFallback>
          </Avatar> */}
          <Link href="/profile">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={
                  userProfile?.avatar || user?.photoURL || "/placeholder.svg"
                }
              />
              <AvatarFallback>
                {userProfile?.name?.charAt(0) ||
                  user?.displayName?.charAt(0) ||
                  "U"}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="hidden md:flex flex-col items-start gap-0.5 flex-1 grow relative">
            <span className="self-stretch font-semibold text-sm text-[#314158]">
              {userProfile?.name}
            </span>
            <span className="self-stretch text-xs text-[#62748e]">
              @{userProfile?.username}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="fixed md:relative top-4 md:top-auto right-4 md:right-auto inline-flex md:flex md:w-full h-10 items-center justify-center gap-2 p-2 self-stretch bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          <LogOutIcon className="w-5 h-5 text-[#62748e]" />
          <span className="hidden md:inline font-semibold text-[#62748e]">
            ログアウト
          </span>
        </Button>
      </div>
    </aside>
  );
};

// src/hooks/use-CurrentFullUrl.js
// useCurrentFullUrl: 現在のフルURLを取得するカスタムフック
// Next.jsのusePathnameとuseSearchParamsを使用して、現在の

// src/hooks/use-current-url.js
"use client";
// 他のモジュールやライブラリを読み込んでいます
import { usePathname, useSearchParams } from "next/navigation";

// Reactのコンポーネントを定義しています
export function useCurrentFullUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (typeof window === "undefined") return "";
  const query = searchParams.toString();
  return `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
}

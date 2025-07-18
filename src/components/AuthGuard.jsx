"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// 認証が必要なページを保護するコンポーネント
// ログインしていないユーザーをログインページにリダイレクト
// children: 保護したいページのコンテンツ
export default function AuthGuard({ children }) {
  // 認証状態を取得
  const { user, loading } = useAuth();
  // ページ遷移用のルーター
  const router = useRouter();

  // 認証状態をチェックしてリダイレクト
  useEffect(() => {
    // ローディングが完了し、ユーザーがログインしていない場合
    if (!loading && !user) {
      // ログインページにリダイレクト
      router.push("/");
    }
  }, [user, loading, router]); // 依存関係：これらの値が変更された時に実行

  // ローディング中の表示
  if (loading) {
    return (
      // 画面中央にローディングスピナーを表示
      <div className="min-h-screen flex items-center justify-center">
        {/* Loader2: 回転するローディングアイコン */}
        {/* animate-spin: 回転アニメーション */}
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // ユーザーがログインしていない場合は何も表示しない
  // （リダイレクト処理が実行される）
  if (!user) {
    return null;
  }

  // ユーザーがログインしている場合は子コンポーネントを表示
  return children;
}

"use client";

import { useState, useCallback } from "react";

// トースト通知を管理するカスタムフック
// アプリ全体で統一された通知システムを提供します
export function useToast() {
  // トーストメッセージのリストを管理
  const [toasts, setToasts] = useState([]);

  // トースト表示関数
  // useCallback: 関数をメモ化してパフォーマンスを向上
  const toast = useCallback(
    ({ title, description, duration = 3000, className = "" }) => {
      // ランダムなIDを生成（重複を防ぐため）
      const id = Math.random().toString(36).substr(2, 9);

      // 新しいトーストオブジェクトを作成
      const newToast = {
        id, // 一意のID
        title, // タイトル
        description, // 説明文
        duration, // 表示時間（ミリ秒）
        className, // CSSクラス（アニメーション等）
      };

      // トーストリストに追加
      setToasts((prev) => [...prev, newToast]);

      // 指定時間後に自動削除
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      // トーストIDを返す（手動削除に使用可能）
      return id;
    },
    []
  );

  // トースト手動削除関数
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 外部で使用する関数とデータを返す
  return {
    toast, // トースト表示関数
    dismiss, // トースト削除関数
    toasts, // 現在のトーストリスト
  };
}

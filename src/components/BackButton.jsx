// 他のモジュールやライブラリを読み込んでいます
import Link from "next/link";
// 他のモジュールやライブラリを読み込んでいます
import React from "react";
// 他のモジュールやライブラリを読み込んでいます
import { Button } from "./ui/button";
// 他のモジュールやライブラリを読み込んでいます
import { ArrowLeft } from "lucide-react";

// Reactのコンポーネントを定義しています
export default function BackButton() {
  // ここから画面に表示する内容を記述します
  return (
    <div className="flex items-center mb-6">
      <Link href="/home">
        <Button variant="ghost" size="sm" className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">ホーム</h1>
    </div>
  );
}

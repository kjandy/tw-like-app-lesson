"use client";

// 他のモジュールやライブラリを読み込んでいます
import BackButton from "@/components/BackButton";
// 他のモジュールやライブラリを読み込んでいます
import { Button } from "@/components/ui/button";
// 他のモジュールやライブラリを読み込んでいます
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// 他のモジュールやライブラリを読み込んでいます
import { Input } from "@/components/ui/input";
// 他のモジュールやライブラリを読み込んでいます
import { Label } from "@/components/ui/label";
// 他のモジュールやライブラリを読み込んでいます
import { Separator } from "@/components/ui/separator";
// 他のモジュールやライブラリを読み込んでいます
import { useAuth } from "@/lib/auth-context";
// 他のモジュールやライブラリを読み込んでいます
import { Lock, Mail } from "lucide-react";
// 他のモジュールやライブラリを読み込んでいます
import Link from "next/link";
// 他のモジュールやライブラリを読み込んでいます
import { useRouter } from "next/navigation";
// 他のモジュールやライブラリを読み込んでいます
import React, { useState } from "react";

// Reactのコンポーネントを定義しています
export default function loginPage() {
  const { signInUser, signInWithGoogle } = useAuth();
  const router = useRouter();
  // フォームの状態管理
  // useStateは状態（データ）を管理するためのReactフックです
  const [formData, setFormData] = useState({
    email: "", // メールアドレス
    password: "", // パスワード
  });
  // useStateは状態（データ）を管理するためのReactフックです
  const [loading, setLoading] = useState(false); // ローディング状態

  // Googleログイン処理
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 入力値の変更処理
  // e.target.name: 入力フィールドのname属性
  // e.target.value: 入力された値
  const handleChange = (e) => {
    // 入力フィールドのname属性と値を取得
    // スプレッド演算子を使用して既存の状態を保持しつつ、特定のフィールドを更新
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // フォーム送信処理
  // e.preventDefault()でフォームのデフォルト送信を防ぎ、非同期処理を行います
  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    setLoading(true); // ローディング開始

    try {
      // 認証コンテキストのログイン関数を呼び出し
      const result = await signInUser(formData.email, formData.password);
      // 成功時の処理
      // result.success: ログインが成功したかどうか
      // result.message: 成功または失敗のメッセージ
      // ログイン成功時はホームページにリダイレクト
      // ログイン失敗時はエラーメッセージを表示
      if (result.success) {
        // ログイン成功時
        // ホームページにリダイレクト
        router.push("/home");
      } else {
        // ログイン失敗時
      }
    } catch (error) {
      // 予期しないエラー
    } finally {
      setLoading(false); // ローディング終了
    }
  };
  // ここから画面に表示する内容を記述します
  return (
    <>
      <div className="fixed">
        <BackButton />
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-10 space-y-5 border-0 sm:border shadow-muted md:shadow-sm">
          <CardHeader className="text-center px-0">
            <div className="bg-[#1d9bf0] text-white w-[40px] h-[40px] rounded-[8px] flex justify-center items-center mx-auto">
              kw
            </div>
            <CardTitle className="text-2xl">おかえりなさい</CardTitle>
            <CardDescription>アカウントにログインしてください</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="メールアドレスを入力してください"
                    className="text-base h-11 pl-10"
                    value={formData.email} // 入力値
                    onChange={handleChange} // 入力変更時のハンドラー
                    required // 入力必須
                    disabled={loading} // ローディング中は入力不可
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="パスワードを入力してください"
                    className="text-base h-11 pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1d9bf0] hover:bg-[#1da3f0] text-base font-semibold p-7"
              >
                ログイン
              </Button>
            </form>
            <Separator className="my-6" />
            <p className="text-center my-6">or</p>
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full mb-6 p-7 text-base font-semibold"
            >
              <img src="/brand-google.svg" width="32" height="32" alt="" />
              Continue with Google
            </Button>
            <div>
              アカウントの新規作成
              <Link
                href="/auth/signup"
                className="text-[#1d9bf0] hover:text-[#1da3f0] ml-2"
              >
                サインアップ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

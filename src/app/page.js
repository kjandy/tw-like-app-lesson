"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Heart, Share } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useConter } from "@/lib/count-context";

const featureCards = [
  {
    icon: <Globe className="w-8 h-8" />,
    title: "世界中とつながろう",
    description:
      "世界中の人々とつながり、国境を越えてあなたのネットワークを広げましょう。",
    note: "ChatGPT に質問する",
    bgColor: "bg-slate-100",
  },
  {
    icon: <Share className="w-8 h-8" />,
    title: "すぐに共有",
    description:
      "あなたの考えや写真、体験をフォロワーとリアルタイムで共有しましょう。",
    note: "ChatGPT に質問する",
    bgColor: "bg-green-100",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "つながり続けよう",
    description:
      "話題のトピックを見つけ、コンテンツに参加し、自分にとって大切な最新情報を手に入れましょう。",
    note: "",
    bgColor: "bg-[#fef3c6]",
  },
];

export default function LandingPage() {
  const { count } = useConter();
  return (
    <div className="flex flex-col items-start relative bg-slate-50 min-h-screen">
      <header className="flex h-20 items-center justify-between px-8 py-0 relative w-full bg-white border border-solid border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex w-10 h-10 items-center justify-center relative bg-[#1d9bf0] rounded-lg">
            <span className="text-white font-bold text-lg">Kw</span>
          </div>
          <span className="text-[#314158] font-bold text-xl">Kwitter</span>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="h-9 bg-[#1d9bf0] text-slate-50 rounded-lg">
            <Link href="/auth/login">ログイン</Link>
          </Button>
          <Button
            variant="outline"
            className="h-9 text-[#1d9bf0] border-[#1d9bf0] bg-white rounded-lg"
          >
            サインアップ
          </Button>
        </div>
      </header>

      <main className="flex flex-col items-start gap-16 px-8 py-16 relative w-full">
        <section className="flex flex-col items-center gap-6 relative w-full">
          <h1 className="[font-family:'Inter-Bold',Helvetica] font-bold text-slate-800 text-5xl leading-[57.6px] text-center">
            Kitter へようこそ！{count}
          </h1>

          <p className="[font-family:'Inter-Regular',Helvetica] font-normal text-slate-500 text-lg leading-[21.6px] text-center">
            あなたの想いを共有し、新たな視点を発見し、世界中の人々と深いつながりを築きましょう。
          </p>

          <div className="flex items-center gap-4">
            <Button className="bg-[#1d9bf0] text-white rounded-lg h-auto py-2.5">
              Get Started
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white text-[#1d9bf0] border-[#1d9bf0] rounded-lg h-auto py-2.5"
            >
              <Link href="/auth/login">ログイン</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white text-[#1d9bf0] border-[#1d9bf0] rounded-lg h-auto py-2.5"
            >
              <Link href="/notifications">カウンター</Link>
            </Button>
          </div>
        </section>

        <section className="flex flex-col items-start gap-8 relative w-full">
          <h2 className="w-full [font-family:'Inter-Bold',Helvetica] font-bold text-slate-800 text-[32px] text-center leading-[38.4px]">
            なぜ私たちのSNSを選ぶのか？
          </h2>

          <div className="flex items-start gap-6 w-full justify-center flex-wrap md:flex-nowrap">
            {featureCards.map((card, index) => (
              <Card
                key={index}
                className="w-full md:w-[360px] h-auto border-slate-200 rounded-xl"
              >
                <CardContent className="flex flex-col items-start gap-4 p-8">
                  <div
                    className={`flex w-16 h-16 items-center justify-center rounded-xl ${card.bgColor}`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="self-stretch [font-family:'Inter-SemiBold',Helvetica] font-semibold text-slate-800 text-xl leading-6">
                    {card.title}
                  </h3>
                  <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-slate-500 text-sm leading-[16.8px]">
                    {card.description}
                    {card.note && (
                      <>
                        <br />
                        {card.note}
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

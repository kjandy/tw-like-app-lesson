"use client";
import { Button } from "@/components/ui/button";
import { useConter } from "@/lib/count-context";
import Link from "next/link";
import React from "react";

export default function notificationsPage() {
  const { count, setCount } = useConter();
  const handleIncrease = () => {
    setCount((prev) => prev + 1);
  };
  const handleDecrease = () => {
    setCount((prev) => prev - 1);
  };
  return (
    <div className="max-w-sm mx-auto p-10 space-y-4 text-center">
      <p>
        <Link href="/">トップへ</Link>
      </p>
      <h1>Counter：{count}</h1>
      <div className="inline-flex gap-4">
        <Button onClick={handleIncrease}>+</Button>
        <Button onClick={handleDecrease}>-</Button>
      </div>
    </div>
  );
}

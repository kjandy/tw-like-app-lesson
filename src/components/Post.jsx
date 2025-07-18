"use client";
import Link from "next/link";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";

export const Post = ({
  id, //投稿ID
  content, //投稿内容
  authorId, //投稿者のユーザーID
  authorName, //投稿者名
  authorUsername, //投稿者のユーザー名
  authorAvatar, //投稿者のアバター画像
  images = [], //添付画像の配列
  likes = [], //いいねしたユーザーIDの配列
  comments, //コメントの配列
  createdAt, //作成日時
  visibility, //公開設定(etc, Friend Only)
}) => {
  // 投稿時間を「○時間前」の形式で表示
  const formatTimestamp = (date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    return date.toLocaleDateString();
  };
  return (
    <Card className="w-full p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={authorAvatar} alt={authorName} />
            {/* 画像がない場合は名前の最初の文字を表示 */}
            <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{authorName}</h3>
              <span className="font-text-sm-normal text-[#62748e] whitespace-nowrap">
                @{authorUsername}
              </span>
              <span className="font-text-sm-normal text-[#62748e] whitespace-nowrap">
                {formatTimestamp(createdAt)}
              </span>
              <Badge
                variant="outline"
                className="bg-slate-50 text-[#1d9bf0] border-[#1d9bf0] opacity-80 rounded-2xl"
              >
                Public
              </Badge>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
      <Link href={`/post/${id}`}>
        <p className="font-text-sm-normal text-[#314158] mb-4">{content}</p>
      </Link>

      <div className="h-[200px] bg-gray-100 rounded-lg w-full mb-4" />

      <div className="flex items-center justify-end gap-4 w-full">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-500 text-sm">{likes}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-500 text-sm">{comments}</span>
        </div>
      </div>
    </Card>
  );
};

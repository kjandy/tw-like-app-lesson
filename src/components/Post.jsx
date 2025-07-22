"use client";
// 他のモジュールやライブラリを読み込んでいます
import Link from "next/link";
// 他のモジュールやライブラリを読み込んでいます
import { Card } from "./ui/card";
// 他のモジュールやライブラリを読み込んでいます
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// 他のモジュールやライブラリを読み込んでいます
import { Badge } from "./ui/badge";
// 他のモジュールやライブラリを読み込んでいます
import { Button } from "./ui/button";
// 他のモジュールやライブラリを読み込んでいます
import {
  Heart,
  MessageCircle,
  Share,
  Loader2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
// 他のモジュールやライブラリを読み込んでいます
import { useAuth } from "@/lib/auth-context";
// 他のモジュールやライブラリを読み込んでいます
import { usePosts } from "@/lib/posts-context";
// 他のモジュールやライブラリを読み込んでいます
import { useToast } from "@/hooks/use-toast";
// 他のモジュールやライブラリを読み込んでいます
import { useEffect, useState } from "react";
// 他のモジュールやライブラリを読み込んでいます
import { useCurrentFullUrl } from "@/hooks/use-CurrentFullUrl";
// 他のモジュールやライブラリを読み込んでいます
import { usePathname } from "next/navigation";
// 他のモジュールやライブラリを読み込んでいます
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
// 他のモジュールやライブラリを読み込んでいます
import { ref, deleteObject } from "firebase/storage";
// 他のモジュールやライブラリを読み込んでいます
import { db, storage } from "../../firebase.config";

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
  // 認証情報と投稿管理機能を取得
  const { user } = useAuth();
  const { updatePostLikes, removePostFromList } = usePosts();
  const { toast } = useToast();

  // いいね状態の管理
  // Array.isArray: 配列かどうかをチェック
  // includes: 配列に特定の値が含まれているかチェック
  // useStateは状態（データ）を管理するためのReactフックです
  const [isLiked, setIsLiked] = useState(
    Array.isArray(likes) && user?.uid ? likes.includes(user.uid) : false
  );
  // useStateは状態（データ）を管理するためのReactフックです
  const [likeCount, setLikeCount] = useState(
    Array.isArray(likes) ? likes.length : 0
  );
  // useStateは状態（データ）を管理するためのReactフックです
  const [loading, setLoading] = useState(false); // いいね処理中の状態
  // useStateは状態（データ）を管理するためのReactフックです
  const [deleteLoading, setDeleteLoading] = useState(false); // 削除処理中の状態
  // useStateは状態（データ）を管理するためのReactフックです
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // 削除確認ダイアログの表示状態

  // コメント数の状態管理
  // useStateは状態（データ）を管理するためのReactフックです
  const [commentCount, setCommentCount] = useState(
    Array.isArray(comments) ? comments.length : 0
  );
  // useStateは状態（データ）を管理するためのReactフックです
  const [commentCountLoading, setCommentCountLoading] = useState(false);

  console.log("Post component -  data:", {
    id,
    content,
    authorId,
    authorName,
    authorUsername,
    authorAvatar,
    images,
    likes,
    comments,
    createdAt,
    visibility,
  });

  // // 投稿時間を「○時間前」の形式で表示
  // const formatTimestamp = (date) => {
  //   const now = new Date();
  //   const diffInHours = Math.floor(
  //     (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  //   );

  //   if (diffInHours < 1) return "now";
  //   if (diffInHours < 24) return `${diffInHours}h`;
  //   return date.toLocaleDateString();
  // };
  // 投稿時間の表示用フォーマット
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "now";

    let date;
    // Firestore Timestampの処理
    // Reactのコンポーネントを定義しています
    if (timestamp && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    // 時間差に応じて表示形式を変更
    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    return date.toLocaleDateString();
  };

  // 現在のURLを取得
  const currentUrl = useCurrentFullUrl();
  // 現在のURLが投稿詳細ページかどうかを判定
  const pathname = usePathname(); // 現在のパス名を取得
  const isPostDetail = pathname.startsWith("/post/"); // startsWith: パス名が"/post/"で始まるかチェック

  // いいねボタンの処理
  // firebaseから投稿データを取得するためasync
  const handleLike = async () => {
    // 未認証ユーザーの場合はエラーメッセージを表示
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // Firestoreから投稿データを取得
      const postRef = doc(db, "posts", id);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        toast({
          title: "Error",
          description: "Post not found",
          variant: "destructive",
          duration: 2000,
          className: "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        });
        return;
      }

      const postData = postDoc.data();
      const currentLikes = Array.isArray(postData.likes) ? postData.likes : [];
      const userHasLiked = currentLikes.includes(user.uid);

      if (userHasLiked) {
        // いいねを取り消す
        // arrayRemove: 配列から特定の値を削除
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
        });
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        if (updatePostLikes) {
          updatePostLikes(id, user.uid, false);
        }
      } else {
        // いいねを追加
        // arrayUnion: 配列に値を追加（重複は自動で防がれる）
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
        });
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        if (updatePostLikes) {
          updatePostLikes(id, user.uid, true);
        }
      }

      // 成功メッセージを表示
      toast({
        description: userHasLiked ? "Post unliked!" : "Post liked!",
        duration: 2000,
        className: "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
      });
    } catch (error) {
      console.error("Toggle like error:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
        duration: 2000,
        className: "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
      });
    } finally {
      setLoading(false);
    }
  };
  // ここまでいいね機能

  // 有効なユーザー名がある場合のみプロフィールリンクを表示
  const shouldShowProfileLink =
    authorName && authorUsername !== "undefined" && authorUsername !== "user";
  console.log("Profile link data:", {
    authorUsername,
    shouldShowProfileLink,
    linkHref: `/profile/${shouldShowProfileLink}`,
  });
  // ここから画面に表示する内容を記述します
  return (
    <Card className="w-full p-5">
      {/* <p>{currentUrl}</p> */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 条件付きアバターリンク */}
          {shouldShowProfileLink ? (
            <Link href={`/profile/${authorUsername}`}>
              <Avatar className="w-10 h-10">
                <AvatarImage src={authorAvatar} alt={authorName} />
                {/* 画像がない場合は名前の最初の文字を表示 */}
                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Avatar className="w-10 h-10">
              <AvatarImage src={authorAvatar} alt={authorName} />
              {/* 画像がない場合は名前の最初の文字を表示 */}
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{authorName}</h3>
              <span className="font-text-sm-normal text-[#62748e] whitespace-nowrap">
                @{authorUsername}
              </span>
              <span className="font-text-sm-normal text-[#62748e] whitespace-nowrap">
                {formatTimestamp(createdAt)}
              </span>
              {/* 友達限定投稿の表示 */}
              {visibility === "friends" && (
                <Badge
                  variant="outline"
                  className="bg-slate-50 text-[#1d9bf0] border-[#1d9bf0] opacity-80 rounded-2xl"
                >
                  Friend Only
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
      {/* 投稿内容の表示
          投稿詳細ページは、リンクなし、それ以外はリンクあり
       */}
      {isPostDetail ? (
        <>
          <p className="font-text-sm-normal text-[#314158] mb-4">{content}</p>
          {/* 投稿画像 */}
          {Array.isArray(images) && images.length > 0 && (
            <div
              className={`grid gap-2 mb-3 ${
                images.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`Post image ${index + 1}`}
                  className="rounded-lg object-cover w-full h-48"
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <Link href={`/post/${id}`}>
          {/* 投稿本文 */}
          <p className="font-text-sm-normal text-[#314158] mb-4">{content}</p>
          {/* 投稿画像 */}
          {Array.isArray(images) && images.length > 0 && (
            <div
              className={`grid gap-2 mb-3 ${
                images.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`Post image ${index + 1}`}
                  className="rounded-lg object-cover w-full h-48"
                />
              ))}
            </div>
          )}
        </Link>
      )}
      {/* ここまで投稿リンクありなしの条件分岐 */}

      {/* ここからいいね、コメントボタン */}
      <div className="flex items-center justify-end pt-3 border-t">
        {/* いいねボタン */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center space-x-2 ${
            isLiked ? "text-red-500" : "text-gray-500"
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          )}
          <span>{likeCount}</span>
        </Button>

        {/* コメントボタン - リアルタイムカウント付き */}
        <Link href={`/post/${id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="flex items-center">
              {commentCountLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                commentCount
              )}
            </span>
          </Button>
        </Link>
      </div>
    </Card>
  );
};

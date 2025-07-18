// components/create-post.jsx
// CreatePost: 投稿作成フォームのコンポーネント

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, X, Loader2, Globe, Users } from "lucide-react";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context"; // 認証情報を取得
import { usePosts } from "@/lib/posts-context"; // 投稿管理のコンテキストを使用
import { collection, addDoc } from "firebase/firestore"; // Firestoreのインポート
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storageのインポート
import { db, storage } from "../../firebase.config";

// 投稿作成フォームのコンポーネント（デスクトップ版）
// デスクトップでのみ表示され、投稿の作成を行います
export default function CreatePost() {
  // 認証情報と投稿管理機能を取得
  const { user, userProfile } = useAuth(); // 現在のユーザー情報とプロフィールを取得
  const { addPostToList } = usePosts(); // 投稿をリストに追加する関数
  const { toast } = useToast(); // 通知表示用

  // フォームの状態管理
  const [content, setContent] = useState(""); // 投稿内容
  const [visibility, setVisibility] = useState("public"); // 公開設定
  const [images, setImages] = useState([]); // 添付画像
  const [loading, setLoading] = useState(false); // 送信中状態

  // 画像ファイル選択処理
  const handleImageUpload = (e) => {
    // e.target.files: 選択されたファイルのリスト
    // Array.from: FileListを配列に変換
    const files = Array.from(e.target.files);
    // スプレッド演算子で既存の画像に新しい画像を追加
    setImages((prev) => [...prev, ...files]);
  };

  // 画像削除処理
  // index: 削除する画像のインデックス
  const removeImage = (index) => {
    // filter: 指定されたインデックス以外の画像を残す
    setImages(images.filter((_, i) => i !== index));
  };

  // 投稿送信処理
  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ

    // 投稿内容が空の場合は処理を停止
    if (!content.trim()) return;

    setLoading(true); // ローディング開始

    try {
      // 画像をFirebase Storageにアップロード
      const imageUrls = [];
      for (const image of images) {
        if (image && image.size > 0) {
          // ref: Firebase Storageの参照を作成
          // Date.now(): 現在時刻をファイル名に含めて重複を防ぐ
          const imageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
          // uploadBytes: ファイルをアップロード
          const snapshot = await uploadBytes(imageRef, image);
          // getDownloadURL: アップロードされたファイルのURLを取得
          const downloadURL = await getDownloadURL(snapshot.ref);
          imageUrls.push(downloadURL);
        }
      }

      // 投稿データを作成
      const postData = {
        content, // 投稿内容
        visibility, // 公開設定
        authorId: user.uid, // 投稿者のユーザーID
        authorName: userProfile?.name || user.displayName || "User", // 投稿者名
        authorAvatar: userProfile?.avatar || user.photoURL || "", // 投稿者のアバター
        authorUsername:
          userProfile?.username ||
          (userProfile?.email ? userProfile.email.split("@")[0] : null), // ユーザー名
        images: imageUrls, // 画像URLの配列
        likes: [], // いいねリスト（初期は空）
        comments: [], // コメントリスト（初期は空）
        createdAt: new Date().toISOString(), // 作成日時
      };

      // Firestoreに投稿を保存
      // addDoc: 新しいドキュメントを追加
      const docRef = await addDoc(collection(db, "posts"), postData);

      // 新しい投稿をリストに即座に追加（リロード不要）
      const newPost = {
        id: docRef.id, // Firestoreで生成されたドキュメントID
        ...postData, // 投稿データを展開
      };
      addPostToList(newPost);

      // 成功メッセージを表示
      const visibilityText =
        visibility === "friends" ? "friends only" : "public";
      toast({
        title: "Post created successfully!",
        description: `Your ${visibilityText} post has been shared.`,
        duration: 3000,
        className: "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
      });

      // フォームをリセット
      setContent("");
      setImages([]);
      setVisibility("public");
    } catch (error) {
      console.error("Create post error:", error);
      // エラーメッセージを表示
      toast({
        title: "Failed to create post",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 3000,
        className: "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
      });
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  return (
    // デスクトップでのみ表示（hidden md:block）
    <div className="hidden md:block w-full">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Create a post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="flex space-x-3">
              {/* ユーザーのアバター */}
              <Avatar>
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

              <div className="flex-1">
                {/* 投稿内容の入力エリア */}
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)} // 入力内容を更新
                  className="min-h-[100px] resize-none border-none p-0 text-lg placeholder:text-gray-500 focus-visible:ring-0"
                  disabled={loading} // ローディング中は入力不可
                />
              </div>
            </div>

            {/* 画像プレビュー */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    {/* URL.createObjectURL: ファイルオブジェクトからプレビューURLを作成 */}
                    <img
                      src={URL.createObjectURL(image) || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="rounded-lg object-cover w-full h-32"
                    />
                    {/* 画像削除ボタン */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-4">
                {/* 画像アップロードボタン */}
                <label htmlFor="image-upload">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600"
                    asChild
                  >
                    <span>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Image
                    </span>
                  </Button>
                </label>
                {/* ファイル選択の隠しinput */}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />

                {/* 公開設定セレクター */}
                <Select
                  value={visibility}
                  onValueChange={setVisibility}
                  disabled={loading}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* 公開設定 */}
                    <SelectItem value="public">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-green-600" />
                        <div>
                          <div className="font-medium">Public</div>
                        </div>
                      </div>
                    </SelectItem>
                    {/* 友達限定設定 */}
                    <SelectItem value="friends">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-600" />
                        <div>
                          <div className="font-medium">Friends only</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 投稿ボタン */}
              <Button
                type="submit"
                disabled={!content.trim() || loading}
                className="px-6"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

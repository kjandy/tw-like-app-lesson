"use client";

// 他のモジュールやライブラリを読み込んでいます
import AuthGuard from "@/components/AuthGuard";
// 他のモジュールやライブラリを読み込んでいます
import { Navigation } from "@/components/Navigation";
// 他のモジュールやライブラリを読み込んでいます
import { PostList } from "@/components/PostList";
// 他のモジュールやライブラリを読み込んでいます
import { Button } from "@/components/ui/button";
// 他のモジュールやライブラリを読み込んでいます
import { Card, CardContent } from "@/components/ui/card";
// 他のモジュールやライブラリを読み込んでいます
import { Input } from "@/components/ui/input";
// 他のモジュールやライブラリを読み込んでいます
import { Textarea } from "@/components/ui/textarea";
// 他のモジュールやライブラリを読み込んでいます
import { useAuth } from "@/lib/auth-context";
// 他のモジュールやライブラリを読み込んでいます
import { usePosts } from "@/lib/posts-context";
// 他のモジュールやライブラリを読み込んでいます
import { useToast } from "@/hooks/use-toast";
// 他のモジュールやライブラリを読み込んでいます
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// 他のモジュールやライブラリを読み込んでいます
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// 他のモジュールやライブラリを読み込んでいます
import { Label } from "@radix-ui/react-label";
// 他のモジュールやライブラリを読み込んでいます
import { Calendar, Edit, LinkIcon, Loader2, MapPin } from "lucide-react";
// 他のモジュールやライブラリを読み込んでいます
import React, { useEffect, useState } from "react";
// 他のモジュールやライブラリを読み込んでいます
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
// 他のモジュールやライブラリを読み込んでいます
import { db } from "../../../firebase.config";
// 他のモジュールやライブラリを読み込んでいます
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// 他のモジュールやライブラリを読み込んでいます
import { storage } from "../../../firebase.config";
// 他のモジュールやライブラリを読み込んでいます
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// 他のモジュールやライブラリを読み込んでいます
import { Post } from "@/components/Post";
// import { validateImageFile, compressImage } from "@/lib/image-utils";

// Reactのコンポーネントを定義しています
export default function profilePage() {
  const { user, userProfile } = useAuth();
  const { posts } = usePosts();
  const { toast } = useToast();

  // 編集状態の管理
  // useStateは状態（データ）を管理するためのReactフックです
  const [isEditing, setIsEditing] = useState(false);
  // useStateは状態（データ）を管理するためのReactフックです
  const [loading, setLoading] = useState(false);

  // プロフィール編集フォームの状態
  // useStateは状態（データ）を管理するためのReactフックです
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
  });

  // useStateは状態（データ）を管理するためのReactフックです
  const [avatarFile, setAvatarFile] = useState(null);
  // useStateは状態（データ）を管理するためのReactフックです
  const [coverFile, setCoverFile] = useState(null);
  // useStateは状態（データ）を管理するためのReactフックです
  const [avatarPreview, setAvatarPreview] = useState("");
  // useStateは状態（データ）を管理するためのReactフックです
  const [coverPreview, setCoverPreview] = useState("");
  // useStateは状態（データ）を管理するためのReactフックです
  const [imageLoading, setImageLoading] = useState(false);

  // ユーザーの投稿をフィルタリング
  const userPosts = posts.filter((post) => post.authorId === user?.uid);

  // 画像付きの投稿をフィルタリング
  const mediaPosts = userPosts.filter(
    (post) => Array.isArray(post.images) && post.images.length > 0
  );

  // プロフィールデータの初期化
  // useEffectは副作用（データ取得や初期処理など）を扱うReactフックです
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        location: userProfile.location || "",
        website: userProfile.website || "",
      });
    }
  }, [userProfile]);

  // アバターフォールバック文字を取得する関数
  const getAvatarFallback = () => {
    // 優先順位: username > name > "U"
    if (userProfile?.username && userProfile.username !== "undefined") {
      return userProfile.username.charAt(0).toUpperCase();
    }
    if (userProfile?.name && userProfile.name !== "Unknown User") {
      return userProfile.name.charAt(0).toUpperCase();
    }
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    return "U";
  };

  // フォーム入力の変更処理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 過去の投稿とコメントの表示名を更新する関数
  const updateUserContentName = async (newName) => {
    if (!user?.uid) return 0;

    try {
      // Firestore バッチ処理を使用して複数のドキュメントを効率的に更新
      const batch = writeBatch(db);
      let updateCount = 0;

      console.log("Starting to update user content with new name:", newName);

      // 1. 投稿の表示名を更新
      const postsQuery = query(
        collection(db, "posts"),
        where("authorId", "==", user.uid)
      );
      const postsSnapshot = await getDocs(postsQuery);

      console.log(`Found ${postsSnapshot.size} posts to update`);

      postsSnapshot.forEach((docSnapshot) => {
        const postRef = docSnapshot.ref;
        batch.update(postRef, {
          authorName: newName,
          // author オブジェクトも更新（新しい形式の投稿用）
          "author.name": newName,
        });
        updateCount++;
      });

      // 2. コメントの表示名を更新
      const commentsQuery = query(
        collection(db, "comments"),
        where("authorId", "==", user.uid)
      );
      const commentsSnapshot = await getDocs(commentsQuery);

      console.log(`Found ${commentsSnapshot.size} comments to update`);

      commentsSnapshot.forEach((docSnapshot) => {
        const commentRef = docSnapshot.ref;
        batch.update(commentRef, {
          "author.name": newName,
        });
        updateCount++;
      });

      // 3. ネストしたコメント（返信）の表示名を更新
      // 全てのコメントドキュメントを取得して、replies配列内のauthorIdをチェック
      const allCommentsQuery = query(collection(db, "comments"));
      const allCommentsSnapshot = await getDocs(allCommentsQuery);

      console.log(
        `Checking ${allCommentsSnapshot.size} comment documents for nested replies`
      );

      allCommentsSnapshot.forEach((docSnapshot) => {
        const commentData = docSnapshot.data();
        if (commentData.replies && Array.isArray(commentData.replies)) {
          let hasUserReplies = false;
          const updatedReplies = commentData.replies.map((reply) => {
            if (reply.authorId === user.uid) {
              hasUserReplies = true;
              return {
                ...reply,
                author: {
                  ...reply.author,
                  name: newName,
                },
              };
            }
            return reply;
          });

          // ユーザーの返信がある場合のみ更新
          if (hasUserReplies) {
            batch.update(docSnapshot.ref, { replies: updatedReplies });
            updateCount++;
          }
        }
      });

      // バッチ処理を実行
      if (updateCount > 0) {
        await batch.commit();
        console.log(`Successfully updated name in ${updateCount} documents`);
      }

      return updateCount;
    } catch (error) {
      console.error("Error updating user content name:", error);
      throw error;
    }
  };

  // アバター画像選択処理
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 画像ファイルのバリデーション
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      // 画像を圧縮（アバターは500KB以下に）
      const compressedFile = await compressImage(file, 500);
      setAvatarFile(compressedFile);
      const previewUrl = URL.createObjectURL(compressedFile);
      setAvatarPreview(previewUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // カバー画像選択処理
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 画像ファイルのバリデーション
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      // 画像を圧縮（カバーは1MB以下に）
      const compressedFile = await compressImage(file, 1000);
      setCoverFile(compressedFile);
      const previewUrl = URL.createObjectURL(compressedFile);
      setCoverPreview(previewUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // 画像をFirebase Storageにアップロード
  const uploadImage = async (file, path) => {
    const imageRef = ref(storage, `${path}/${user.uid}_${Date.now()}`);
    const snapshot = await uploadBytes(imageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  // プロフィール保存処理
  const handleSaveProfile = async () => {
    if (!user) return;

    // 名前の基本バリデーション
    if (!profileData.name.trim()) {
      toast({
        title: "Invalid name",
        description: "Name cannot be empty",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    setImageLoading(true);

    try {
      let avatarUrl = userProfile?.avatar || "";
      let coverUrl = userProfile?.coverImage || "";

      // アバター画像をアップロード
      if (avatarFile) {
        toast({
          description: "Uploading avatar image...",
          duration: 2000,
        });
        avatarUrl = await uploadImage(avatarFile, "avatars");
      }

      // カバー画像をアップロード
      if (coverFile) {
        toast({
          description: "Uploading cover image...",
          duration: 2000,
        });
        coverUrl = await uploadImage(coverFile, "covers");
      }

      // 表示名が変更されたかチェック
      const nameChanged = profileData.name.trim() !== userProfile?.name;

      if (nameChanged) {
        toast({
          description: "Updating your name across all posts and comments...",
          duration: 3000,
        });
      }

      // ユーザープロフィールを更新
      const userRef = doc(db, "users", user.uid);
      const updateData = {
        name: profileData.name.trim(),
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
      };

      // 画像URLが更新された場合のみ追加
      if (avatarFile) updateData.avatar = avatarUrl;
      if (coverFile) updateData.coverImage = coverUrl;

      await updateDoc(userRef, updateData);

      // 表示名が変更された場合、過去の投稿とコメントも更新
      let contentUpdateCount = 0;
      if (nameChanged) {
        contentUpdateCount = await updateUserContentName(
          profileData.name.trim()
        );
      }

      // 状態をリセット
      setIsEditing(false);
      setAvatarFile(null);
      setCoverFile(null);
      setAvatarPreview("");
      setCoverPreview("");

      // 成功メッセージを表示
      let successMessage = "Your profile has been updated successfully.";
      if (nameChanged && contentUpdateCount > 0) {
        successMessage += ` Updated your name in ${contentUpdateCount} posts and comments.`;
      }

      toast({
        title: "Profile updated!",
        description: successMessage,
        duration: 4000,
        className: "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
      });
    } catch (error) {
      console.error("Error updating profile:", error);

      // エラーの種類に応じて適切なメッセージを表示
      let errorMessage = "Failed to update profile. Please try again.";

      if (error.message?.includes("permission")) {
        errorMessage = "You don't have permission to update this content.";
      } else if (error.message?.includes("network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
        className: "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
      });
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  // 参加日の表示
  const getJoinDate = () => {
    if (userProfile?.createdAt) {
      const date = new Date(userProfile.createdAt);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
    return "Recently";
  };

  // ここから画面に表示する内容を記述します
  return (
    <AuthGuard>
      <main className="flex flex-row w-full min-h-screen bg-slate-50 py-20 md:py-0">
        <div className="flex flex-row-reverse w-full items-start">
          <div className="flex flex-col items-start md:gap-6 md:px-6 bg-gray-50 flex-1">
            <div className="flex flex-col w-full max-w-4xl items-start gap-6">
              <div className="flex flex-col items-start gap-4 w-full">
                {/* カバー写真 */}
                <div className="w-full relative h-48 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden">
                  {userProfile?.coverImage && (
                    <img
                      src={userProfile.coverImage || "/placeholder.svg"}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {/* プロフィール情報 */}
                <Card className="relative -mt-16 mb-6 w-full">
                  <CardContent className="pt-16 pb-6">
                    {/* アバター - 画像がない場合はユーザー名の最初の文字を表示 */}
                    <Avatar className="absolute flex justify-center items-center -top-16 left-6 h-32 w-32 border-4 border-white overflow-hidden rounded-full bg-[#1d9bf0]">
                      <AvatarImage
                        className="w-full h-full object-cover"
                        src={userProfile?.avatar || user?.photoURL || undefined}
                      />
                      <AvatarFallback className="text-4xl text-white">
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex justify-end mb-4">
                      <Dialog open={isEditing} onOpenChange={setIsEditing}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* アバター画像アップロード */}
                            <div className="text-center">
                              <Label>Profile Picture</Label>
                              <div className="flex flex-col items-center space-y-3 mt-2">
                                <Avatar className="h-20 w-20">
                                  <AvatarImage
                                    src={
                                      avatarPreview ||
                                      userProfile?.avatar ||
                                      user?.photoURL ||
                                      undefined
                                    }
                                  />
                                  <AvatarFallback className="text-lg">
                                    {getAvatarFallback()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                    disabled={loading}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      document
                                        .getElementById("avatar-upload")
                                        .click()
                                    }
                                    disabled={loading}
                                  >
                                    Change Avatar
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* カバー画像アップロード */}
                            <div>
                              <Label>Cover Image</Label>
                              <div className="mt-2">
                                <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg overflow-hidden">
                                  {(coverPreview ||
                                    userProfile?.coverImage) && (
                                    <img
                                      src={
                                        coverPreview || userProfile?.coverImage
                                      }
                                      alt="Cover preview"
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                    <input
                                      id="cover-upload"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleCoverUpload}
                                      className="hidden"
                                      disabled={loading}
                                    />
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      onClick={() =>
                                        document
                                          .getElementById("cover-upload")
                                          .click()
                                      }
                                      disabled={loading}
                                    >
                                      Change Cover
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 名前フィールド */}
                            <div>
                              <Label htmlFor="name">Display Name</Label>
                              <Input
                                id="name"
                                name="name"
                                value={profileData.name}
                                onChange={handleInputChange}
                                disabled={loading}
                                placeholder="Your display name"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                This name will appear on all your posts and
                                comments
                              </p>
                            </div>

                            {/* 自己紹介フィールド */}
                            <div>
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                name="bio"
                                value={profileData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself..."
                                disabled={loading}
                              />
                            </div>

                            {/* 場所フィールド */}
                            <div>
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                name="location"
                                value={profileData.location}
                                onChange={handleInputChange}
                                placeholder="Where are you located?"
                                disabled={loading}
                              />
                            </div>

                            {/* ウェブサイトフィールド */}
                            <div>
                              <Label htmlFor="website">Website</Label>
                              <Input
                                id="website"
                                name="website"
                                value={profileData.website}
                                onChange={handleInputChange}
                                placeholder="https://your-website.com"
                                disabled={loading}
                              />
                            </div>

                            <Button
                              onClick={handleSaveProfile}
                              className="w-full"
                              disabled={loading || imageLoading}
                            >
                              {(loading || imageLoading) && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              {imageLoading
                                ? "Uploading images..."
                                : loading
                                ? "Updating..."
                                : "Save Changes"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-3 -mt-12">
                      <div>
                        <h1 className="text-2xl font-bold">
                          {profileData.name || user?.displayName || "User"}
                        </h1>
                        <p className="text-gray-600">
                          @
                          {userProfile?.username ||
                            user?.email?.split("@")[0] ||
                            "user"}
                        </p>
                      </div>

                      {profileData.bio && (
                        <p className="text-gray-900">{profileData.bio}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {profileData.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {profileData.location}
                          </div>
                        )}
                        {profileData.website && (
                          <div className="flex items-center">
                            <LinkIcon className="h-4 w-4 mr-1" />
                            <a
                              href={profileData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {profileData.website}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Joined {getJoinDate()}
                        </div>
                      </div>

                      <div className="flex space-x-6 text-sm">
                        <div>
                          <span className="font-bold">
                            {userProfile?.following?.length || 0}
                          </span>
                          <span className="text-gray-600 ml-1">Following</span>
                        </div>
                        <div>
                          <span className="font-bold">
                            {userProfile?.followers?.length || 0}
                          </span>
                          <span className="text-gray-600 ml-1">Followers</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* 投稿リスト */}
                <div className="w-full space-y-8">
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => <Post key={post.id} {...post} />)
                  ) : (
                    <div className=" text-center py-8 text-gray-500">
                      <p>まだ投稿がありません!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Navigation />
        </div>
        {/* flex-row-reverse */}
      </main>
    </AuthGuard>
  );
}

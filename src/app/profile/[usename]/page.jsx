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
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Edit,
  LinkIcon,
  Loader2,
  MapPin,
  UserMinus,
  UserPlus,
} from "lucide-react";
// 他のモジュールやライブラリを読み込んでいます
import React, { useEffect, useState } from "react";
// 他のモジュールやライブラリを読み込んでいます
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// 他のモジュールやライブラリを読み込んでいます
import { db } from "../../../../firebase.config";
// 他のモジュールやライブラリを読み込んでいます
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// 他のモジュールやライブラリを読み込んでいます
import { storage } from "../../../../firebase.config";
// 他のモジュールやライブラリを読み込んでいます
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// 他のモジュールやライブラリを読み込んでいます
import { Post } from "@/components/Post";
// 他のモジュールやライブラリを読み込んでいます
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// import { validateImageFile, compressImage } from "@/lib/image-utils";

// 他のユーザーのプロフィールページを表示するコンポーネント
// URLパラメータからユーザー名を取得してプロフィールを表示します
// Reactのコンポーネントを定義しています
export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile, updateFollowingList } = useAuth();
  const { fetchUserPosts, refreshPostsAfterFollowChange, posts } = usePosts();
  const { toast } = useToast();

  // 状態管理
  // useStateは状態（データ）を管理するためのReactフックです
  const [profileUser, setProfileUser] = useState(null);
  // useStateは状態（データ）を管理するためのReactフックです
  const [userPosts, setUserPosts] = useState([]);
  // useStateは状態（データ）を管理するためのReactフックです
  const [loading, setLoading] = useState(true);
  // useStateは状態（データ）を管理するためのReactフックです
  const [postsLoading, setPostsLoading] = useState(false);
  // useStateは状態（データ）を管理するためのReactフックです
  const [userNotFound, setUserNotFound] = useState(false);
  // useStateは状態（データ）を管理するためのReactフックです
  const [isFollowing, setIsFollowing] = useState(false);
  // useStateは状態（データ）を管理するためのReactフックです
  const [followLoading, setFollowLoading] = useState(false);
  // useStateは状態（データ）を管理するためのReactフックです
  const [followerCount, setFollowerCount] = useState(0);
  // useStateは状態（データ）を管理するためのReactフックです
  const [followingCount, setFollowingCount] = useState(0);
  // useStateは状態（データ）を管理するためのReactフックです
  const [error, setError] = useState(null);
  // useStateは状態（データ）を管理するためのReactフックです
  const [parameterError, setParameterError] = useState(false);

  // URLパラメータからユーザー名を抽出・検証
  // const extractUsername = () => {
  //   console.log("Raw params object:", params);
  //   console.log("Params keys:", Object.keys(params || {}));

  //   if (!params) {
  //     console.log("No params object found");
  //     return null;
  //   }

  //   // ユーザー名を抽出する複数の方法を試行
  //   let username = null;

  //   // 方法1: 直接アクセス
  //   if (params.username) {
  //     username = params.username;
  //     console.log("Found username via direct access:", username);
  //   }

  //   // 方法2: 配列かどうかをチェック（Next.jsは時々配列を返す）
  //   else if (Array.isArray(params.username)) {
  //     username = params.username[0];
  //     console.log("Found username via array access:", username);
  //   }

  //   // 方法3: すべてのパラメータ値をチェック
  //   else {
  //     const paramValues = Object.values(params);
  //     if (paramValues.length > 0) {
  //       username = paramValues[0];
  //       console.log("Found username via first param value:", username);
  //     }
  //   }

  //   // ユーザー名をクリーンアップして検証
  //   if (username) {
  //     // URLエンコーディングを処理
  //     try {
  //       username = decodeURIComponent(username);
  //     } catch (e) {
  //       console.log("Failed to decode username:", e);
  //     }

  //     // ユーザー名をクリーンアップ
  //     username = username.toString().trim();

  //     // @記号を削除
  //     if (username.startsWith("@")) {
  //       username = username.substring(1);
  //     }

  //     console.log("Cleaned username:", username);

  //     // ユーザー名の形式を検証
  //     if (username.length === 0) {
  //       console.log("Username is empty after cleaning");
  //       return null;
  //     }

  //     // 基本的な検証 - 英数字、アンダースコア、ドット、ハイフンを許可
  //     const usernameRegex = /^[a-zA-Z0-9._-]+$/;
  //     if (!usernameRegex.test(username)) {
  //       console.log("Username contains invalid characters:", username);
  //       return null;
  //     }

  //     return username;
  //   }

  //   console.log("No username found in params");
  //   return null;
  // };

  // URLパラメータからユーザー名を抽出・検証
  let username = "";
  if (params.username) {
    username = params.username;
    console.log("Found username via direct access:", username);
  }

  // ユーザー名でユーザープロフィールを取得（複数のフォールバック戦略）
  const fetchUserProfile = async (targetUsername) => {
    if (!targetUsername) {
      throw new Error("usernameがありません");
    }

    const cleanUsername = targetUsername.toLowerCase();
    console.log("usernameをfetchingします", cleanUsername);

    try {
      const usersRef = collection(db, "users");

      // 戦略1: 直接ユーザー名マッチ（大文字小文字区別）
      console.log("Strategy 1: Direct username match");
      let q = query(usersRef, where("username", "==", targetUsername));
      let querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = { id: userDoc.id, ...userDoc.data() };
        console.log("Found user by direct username match:", userData);
        return userData;
      }

      // 戦略2: 大文字小文字を区別しないユーザー名マッチ
      console.log("Strategy 2: Case-insensitive username match");
      q = query(usersRef, where("username", "==", cleanUsername));
      querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = { id: userDoc.id, ...userDoc.data() };
        console.log("Found user by case-insensitive username match:", userData);
        return userData;
      }

      // 戦略3: メールプレフィックスマッチ
      console.log("Strategy 3: Email prefix match");
      const allUsersSnapshot = await getDocs(usersRef);
      let foundUser = null;

      allUsersSnapshot.forEach((doc) => {
        if (foundUser) return;

        const userData = doc.data();
        const emailPrefix = userData.email?.split("@")[0]?.toLowerCase();

        if (emailPrefix === cleanUsername) {
          foundUser = { id: doc.id, ...userData };
          console.log("Found user by email prefix:", foundUser);
        }
      });

      if (foundUser) return foundUser;

      // 戦略4: 部分的な名前マッチ（最後の手段）
      console.log("Strategy 4: Partial name match");
      allUsersSnapshot.forEach((doc) => {
        if (foundUser) return;

        const userData = doc.data();
        const userName = userData.name?.toLowerCase();

        if (userName && userName.replace(/\s+/g, "") === cleanUsername) {
          foundUser = { id: doc.id, ...userData };
          console.log("Found user by name match:", foundUser);
        }
      });

      return foundUser;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      throw error;
    }
  };

  // 可視性フィルタリング付きでユーザーの投稿を取得
  const fetchUserPostsWithVisibility = async (userId) => {
    if (!userId) return;

    try {
      setPostsLoading(true);
      console.log("Fetching posts for user ID:", userId);

      // 現在のユーザーがこのプロフィールユーザーをフォローしているかチェック
      const viewerIsFollowing =
        user && userProfile && Array.isArray(userProfile.following)
          ? userProfile.following.includes(userId)
          : false;

      // // 可視性フィルタリングを処理するコンテキストメソッドを使用
      const posts = await fetchUserPosts(userId, viewerIsFollowing);

      // // 表示用の追加メタデータを追加
      // const postsWithMetadata = posts.map((post) => ({
      //   ...post,
      //   authorName: profileUser?.name || post.authorName,
      //   authorAvatar: profileUser?.avatar || post.authorAvatar,
      //   authorUsername: profileUser?.username || post.authorUsername,
      // }));

      // console.log("Fetched user posts:", postsWithMetadata.length);
      // console.log("Viewer is following profile user:", viewerIsFollowing);

      // // 可視性別の投稿数をカウント
      // const publicCount = postsWithMetadata.filter(
      //   (p) => p.visibility === "public" || !p.visibility
      // ).length;
      // const friendsCount = postsWithMetadata.filter(
      //   (p) => p.visibility === "friends" || p.visibility === "friends only"
      // ).length;

      // console.log(
      //   "Public posts:",
      //   publicCount,
      //   "Friends-only posts:",
      //   friendsCount
      // );

      // setUserPosts(postsWithMetadata);
      setUserPosts(posts); // PostsProviderからのデータ
    } catch (error) {
      console.error("Error fetching user posts:", error);

      // インデックスエラーかどうかを特別にチェック
      if (error.message && error.message.includes("requires an index")) {
        toast({
          title: "Database Index Required",
          description:
            "Please create the required database index to improve performance.",
          variant: "destructive",
          duration: 10000,
        });

        // 開発者向けにインデックス作成URLをログ出力
        console.error("🔥 FIRESTORE INDEX REQUIRED:");
        console.error(
          "Create the index here: https://console.firebase.google.com/v1/r/project/tw-like-next/firestore/indexes?create_composite=Ckpwcm9qZWN0cy90dy1saWtlLW5leHQvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Bvc3RzL2luZGV4ZXMvXxABGgwKCGF1dGhvcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg"
        );
        console.error(
          "Index needed for: Collection 'posts', Fields: authorId (ASC), createdAt (DESC)"
        );
      } else {
        toast({
          title: "Error",
          description: "Failed to load posts",
          variant: "destructive",
        });
      }
    } finally {
      setPostsLoading(false);
    }
  };

  // 現在のユーザーがこのプロフィールをフォローしているかチェック
  const checkFollowStatus = async (targetUserId) => {
    if (!user || !targetUserId || user.uid === targetUserId) {
      setIsFollowing(false);
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const currentUserQuery = query(usersRef, where("uid", "==", user.uid));
      const currentUserSnapshot = await getDocs(currentUserQuery);

      if (!currentUserSnapshot.empty) {
        const currentUserData = currentUserSnapshot.docs[0].data();
        const following = currentUserData.following || [];
        setIsFollowing(following.includes(targetUserId));
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
      setIsFollowing(false);
    }
  };

  // フォロー/アンフォロー処理
  const handleFollowToggle = async () => {
    if (!user || !userProfile || !profileUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users",
        variant: "destructive",
      });
      return;
    }

    if (user.uid === profileUser.id) {
      toast({
        title: "Cannot follow yourself",
        description: "You cannot follow your own profile",
        variant: "destructive",
      });
      return;
    }

    setFollowLoading(true);

    try {
      const currentUserRef = doc(db, "users", user.uid);
      const profileUserRef = doc(db, "users", profileUser.id);

      // 即座のUIフィードバックのためにローカル状態を更新
      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      setFollowerCount((prev) =>
        newFollowState ? prev + 1 : Math.max(0, prev - 1)
      );

      // Firestoreを更新
      if (isFollowing) {
        await updateDoc(currentUserRef, {
          following: arrayRemove(profileUser.id),
        });
        await updateDoc(profileUserRef, {
          followers: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(currentUserRef, {
          following: arrayUnion(profileUser.id),
        });
        await updateDoc(profileUserRef, {
          followers: arrayUnion(user.uid),
        });
      }

      // 認証コンテキストのフォローリストを即座に更新
      updateFollowingList(profileUser.id, newFollowState);

      // 投稿コンテキストでタイムライン更新をトリガー
      refreshPostsAfterFollowChange();

      toast({
        description: newFollowState
          ? `Following @${getDisplayUsername()}`
          : `Unfollowed @${getDisplayUsername()}`,
      });

      // 友達限定投稿の表示/非表示のために投稿を更新
      await fetchUserPostsWithVisibility(profileUser.id);
    } catch (error) {
      console.error("Error toggling follow:", error);

      // エラー時にローカル状態を元に戻す
      setIsFollowing(!isFollowing);
      setFollowerCount((prev) =>
        isFollowing ? prev + 1 : Math.max(0, prev - 1)
      );

      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  // UI用の表示ユーザー名を取得
  const getDisplayUsername = () => {
    if (!profileUser) return username || "user";
    // ここから画面に表示する内容を記述します
    return (
      profileUser.username ||
      profileUser.email?.split("@")[0] ||
      username ||
      "user"
    );
  };

  // アバターフォールバック文字を取得する関数
  const getAvatarFallback = () => {
    if (!profileUser) return "U";

    // 優先順位: username > name > "U"
    if (profileUser.username && profileUser.username !== "undefined") {
      return profileUser.username.charAt(0).toUpperCase();
    }
    if (profileUser.name && profileUser.name !== "Unknown User") {
      return profileUser.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  // 参加日をフォーマット
  const formatJoinDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return "Recently";
    }
  };

  // メインデータ読み込み関数
  const loadProfileData = async () => {
    try {
      setLoading(true);
      setUserNotFound(false);
      setError(null);
      setParameterError(false);
      setProfileUser(null);
      setUserPosts([]);

      console.log("Loading profile data for username:", username);

      // ユーザープロフィールを取得
      const foundUser = await fetchUserProfile(username);

      if (foundUser) {
        console.log("Profile user found:", foundUser);
        setProfileUser(foundUser);

        // フォロワー/フォロー数を設定
        setFollowerCount(
          Array.isArray(foundUser.followers) ? foundUser.followers.length : 0
        );
        setFollowingCount(
          Array.isArray(foundUser.following) ? foundUser.following.length : 0
        );

        // フォロー状態チェックと投稿取得を並列実行
        await Promise.all([
          checkFollowStatus(foundUser.id),
          fetchUserPostsWithVisibility(foundUser.id),
        ]);
      } else {
        console.log("Profile user not found for username:", username);
        setUserNotFound(true);
        setError("User not found");
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      setUserNotFound(true);
      setError(error.message || "Failed to load profile");
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時またはユーザー名変更時にデータを読み込み
  // useEffectは副作用（データ取得や初期処理など）を扱うReactフックです
  useEffect(() => {
    // useEffectは副作用（データ取得や初期処理など）を扱うReactフックです
    console.log("useEffect triggered");
    console.log("- params:", params);
    console.log("- username:", username);

    // パラメータが利用可能になるまで少し待つ（Next.jsルーティング）
    const timer = setTimeout(() => {
      if (!username) {
        console.log("No valid username found, showing parameter error");
        setParameterError(true);
        setLoading(false);
        return;
      }

      console.log("Valid username found, loading profile data");
      loadProfileData();
    }, 100); // パラメータが読み込まれるまでの小さな遅延

    // ここから画面に表示する内容を記述します
    return () => clearTimeout(timer);
  }, [params, username]);

  // 本当に無効なURLのパラメータエラーを表示
  if (parameterError) {
    // ここから画面に表示する内容を記述します
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Navigation />
        <main className="flex-1 pb-16 md:pb-0">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center mb-6">
              <Link href="/home">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Profile</h1>
            </div>

            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h2 className="text-xl font-semibold mb-2">
                  Invalid Profile URL
                </h2>
                <p className="text-gray-500 mb-4">
                  The profile URL is not valid or is missing a username.
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Expected format: /profile/username
                </p>
                <div className="space-y-2">
                  <Link href="/search">
                    <Button className="mr-2">Search for users</Button>
                  </Link>
                  <Link href="/home">
                    <Button variant="outline">Go to Home</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const isOwnProfile = user && profileUser && user.uid === profileUser.id;

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
                    <div className="flex justify-end items-start">
                      {/* アバター - 画像がない場合はユーザー名の最初の文字を表示 */}
                      <Avatar className="absolute flex justify-center items-center -top-16 left-6 h-32 w-32 border-4 border-white overflow-hidden rounded-full bg-[#1d9bf0]">
                        <AvatarImage src={profileUser?.avatar || undefined} />
                        <AvatarFallback className="text-4xl text-white">
                          {getAvatarFallback()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="mt-16">
                        {isOwnProfile ? (
                          <Link href="/profile">
                            <Button variant="outline">Edit profile</Button>
                          </Link>
                        ) : (
                          <Button
                            onClick={handleFollowToggle}
                            disabled={followLoading}
                            variant={isFollowing ? "outline" : "default"}
                            className={
                              isFollowing
                                ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                : "bg-[#1d9bf0]"
                            }
                          >
                            {followLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : isFollowing ? (
                              <UserMinus className="h-4 w-4 mr-2" />
                            ) : (
                              <UserPlus className="h-4 w-4 mr-2" />
                            )}
                            {isFollowing ? "Unfollow" : "Follow"}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 -mt-12">
                      <div>
                        <h2 className="text-xl font-bold">
                          {profileUser?.name || "User"}
                        </h2>
                        <p className="text-gray-500">@{getDisplayUsername()}</p>
                      </div>

                      {profileUser?.bio && (
                        <p className="text-gray-900">{profileUser.bio}</p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {profileUser?.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{profileUser.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Joined {formatJoinDate(profileUser?.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-6 text-sm">
                        <div>
                          <span className="font-bold">{followingCount}</span>
                          <span className="text-gray-500 ml-1">Following</span>
                        </div>
                        <div>
                          <span className="font-bold">{followerCount}</span>
                          <span className="text-gray-500 ml-1">Followers</span>
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

// lib/posts-context.jsx
// PostsContext: 投稿データを管理するコンテキスト
// useContext: ReactのコンテキストAPIを使用して、アプリ全体で投稿データを共有します
// useState: 投稿データの状態を管理するためのフック
// useEffect: コンポーネントのライフサイクル
// collection, getDocs, query, orderBy: Firestoreから投稿データを取得
// db: Firestoreのインスタンス
// useAuth: 認証情報を取得するためのカスタムフック

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useAuth } from "./auth-context";

// 投稿管理のコンテキストを作成
// 投稿データをアプリ全体で共有するための仕組み
const PostsContext = createContext({});

// 投稿コンテキストを使用するためのカスタムフック
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};

// 投稿プロバイダーコンポーネント
// 投稿データの取得、管理、フィルタリングを行います
export function PostsProvider({ children }) {
  // 認証情報を取得
  const { user, userProfile } = useAuth();

  // 投稿データの状態管理
  const [posts, setPosts] = useState([]); // 投稿リスト
  const [loading, setLoading] = useState(true); // ローディング状態

  // 現在のユーザーのフォロー中リストを取得
  const getCurrentUserFollowing = () => {
    if (!userProfile || !Array.isArray(userProfile.following)) {
      return []; // フォロー中のユーザーがいない場合は空配列
    }
    return userProfile.following;
  };

  // 投稿の表示権限をチェックしてフィルタリング
  // allPosts: すべての投稿データ
  const filterPostsByVisibility = (allPosts) => {
    if (!user) {
      // 未認証ユーザーは公開投稿のみ表示
      return allPosts.filter(
        (post) => post.visibility === "public" || !post.visibility
      );
    }

    const following = getCurrentUserFollowing();

    return allPosts.filter((post) => {
      // 自分の投稿は常に表示
      if (post.authorId === user.uid) {
        return true;
      }

      // 公開投稿は誰でも表示可能
      if (post.visibility === "public" || !post.visibility) {
        return true;
      }

      // 友達限定投稿はフォロワーのみ表示可能
      if (post.visibility === "friends" || post.visibility === "friends only") {
        return following.includes(post.authorId);
      }

      // デフォルトは表示
      return true;
    });
  };

  // フォロー関係が変更された時に投稿を再フィルタリング
  const refreshPostsAfterFollowChange = () => {
    console.log("Refreshing posts after follow change...");

    // 現在の投稿に対して表示権限を再チェック
    setPosts((prevPosts) => {
      const refiltered = filterPostsByVisibility(prevPosts);
      console.log(
        "Posts re-filtered:",
        prevPosts.length,
        "->",
        refiltered.length
      );
      return refiltered;
    });

    // 新しく表示可能になった投稿を取得
    fetchPosts();
  };

  // 投稿一覧を取得する関数（公開投稿 + フォロー中のユーザーの友達限定投稿）
  const fetchPosts = async () => {
    try {
      setLoading(true);

      // Firestoreから投稿を作成日時の降順で取得
      // collection: コレクション参照を作成
      // query: クエリを作成
      // orderBy: ソート条件を指定
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const allPosts = [];
      // forEach: 各ドキュメントに対して処理を実行
      querySnapshot.forEach((doc) => {
        allPosts.push({
          id: doc.id, // ドキュメントID
          ...doc.data(), // ドキュメントのデータ
        });
      });

      // 表示権限に基づいて投稿をフィルタリング
      const visiblePosts = filterPostsByVisibility(allPosts);

      console.log("Total posts fetched:", allPosts.length);
      console.log("Visible posts after filtering:", visiblePosts.length);
      console.log(
        "Current user following:",
        getCurrentUserFollowing().length,
        "users"
      );

      setPosts(visiblePosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 特定のユーザーの投稿を取得（プロフィールページ用）
  // userId: 取得対象のユーザーID
  // viewerIsFollowing: 閲覧者がそのユーザーをフォローしているか
  const fetchUserPosts = async (userId, viewerIsFollowing = false) => {
    try {
      const postsRef = collection(db, "posts");

      // 最適化されたクエリを試行
      try {
        // where: 条件を指定してフィルタリング
        // orderBy: ソート条件を指定
        const q = query(
          postsRef,
          where("authorId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const userPosts = [];
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          userPosts.push({
            id: doc.id,
            ...postData,
          });
        });

        // 表示権限に基づいてフィルタリング
        const visiblePosts = userPosts.filter((post) => {
          // 自分の投稿は常に表示
          if (user && post.authorId === user.uid) {
            return true;
          }

          // 公開投稿は誰でも表示可能
          if (post.visibility === "public" || !post.visibility) {
            return true;
          }

          // 友達限定投稿はフォロワーのみ表示可能
          if (
            post.visibility === "friends" ||
            post.visibility === "friends only"
          ) {
            return viewerIsFollowing || (user && post.authorId === user.uid);
          }

          return true;
        });

        console.log("User posts fetched:", userPosts.length);
        console.log("Visible user posts:", visiblePosts.length);
        console.log("Viewer is following:", viewerIsFollowing);

        return visiblePosts;
      } catch (indexError) {
        // インデックスが利用できない場合のフォールバック処理
        console.warn(
          "Composite index not available, falling back to client-side sorting:",
          indexError
        );

        // ソートなしでクエリを実行し、クライアント側でソート
        const fallbackQuery = query(postsRef, where("authorId", "==", userId));
        const fallbackSnapshot = await getDocs(fallbackQuery);

        const unsortedPosts = [];
        fallbackSnapshot.forEach((doc) => {
          const postData = doc.data();
          unsortedPosts.push({
            id: doc.id,
            ...postData,
          });
        });

        // クライアント側でソート
        const sortedPosts = unsortedPosts.sort((a, b) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
          return dateB - dateA;
        });

        // 表示権限に基づいてフィルタリング
        const visiblePosts = sortedPosts.filter((post) => {
          if (user && post.authorId === user.uid) {
            return true;
          }

          if (post.visibility === "public" || !post.visibility) {
            return true;
          }

          if (
            post.visibility === "friends" ||
            post.visibility === "friends only"
          ) {
            return viewerIsFollowing || (user && post.authorId === user.uid);
          }

          return true;
        });

        return visiblePosts;
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return [];
    }
  };

  // 新しい投稿をリストに追加する関数
  // newPost: 新しい投稿データ
  const addPostToList = (newPost) => {
    // 新しい投稿が現在のユーザーに表示可能かチェック
    const visiblePosts = filterPostsByVisibility([newPost]);
    if (visiblePosts.length > 0) {
      // リストの先頭に追加（最新の投稿が上に表示される）
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };

  // 投稿をリストから削除する関数（削除用）
  // postId: 削除する投稿のID
  const removePostFromList = (postId) => {
    // filter: 条件に合う要素のみを残す
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    console.log("Post removed from local state:", postId);
  };

  // 投稿のいいね状態を更新する関数
  // postId: 投稿ID、userId: ユーザーID、isLiked: いいね状態
  const updatePostLikes = (postId, userId, isLiked) => {
    setPosts((prevPosts) =>
      // map: 各要素を変換して新しい配列を作成
      prevPosts.map(
        (post) =>
          post.id === postId
            ? {
                ...post, // 既存の投稿データを保持
                likes: isLiked
                  ? [...(post.likes || []), userId] // いいねを追加
                  : (post.likes || []).filter((id) => id !== userId), // いいねを削除
              }
            : post // 対象外の投稿はそのまま
      )
    );
  };

  // ユーザーのフォロー状態が変更された時に投稿を再取得
  useEffect(() => {
    fetchPosts();
  }, [user, userProfile?.following]); // userまたはfollowingが変更された時に実行

  // コンテキストで提供する値
  const value = {
    posts, // 投稿リスト
    loading, // ローディング状態
    addPostToList, // 投稿追加関数
    removePostFromList, // 投稿削除関数
    updatePostLikes, // いいね更新関数
    refetch: fetchPosts, // 投稿再取得関数
    fetchUserPosts, // ユーザー投稿取得関数
    filterPostsByVisibility, // 表示権限フィルタリング関数
    refreshPostsAfterFollowChange, // フォロー変更後の更新関数
  };

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
}

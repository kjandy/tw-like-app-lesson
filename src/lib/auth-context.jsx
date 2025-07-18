"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.config";

// 認証コンテキストを作成
// React Contextは、コンポーネント間でデータを共有するための仕組み
const AuthContext = createContext({});

// 認証コンテキストを使用するためのカスタムフック
// このフックを使うことで、どのコンポーネントからでも認証状態にアクセスできます
export const useAuth = () => {
  const context = useContext(AuthContext);
  // コンテキストが正しく設定されているかチェック
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 認証プロバイダーコンポーネント
// アプリ全体を包んで、認証状態を管理します
// children: 子コンポーネント（アプリ全体）
export function AuthProvider({ children }) {
  // useState: Reactの状態管理フック
  const [user, setUser] = useState(null); // 現在のユーザー情報
  const [userProfile, setUserProfile] = useState(null); // ユーザープロフィール情報
  const [loading, setLoading] = useState(true); // ローディング状態

  // useEffect: コンポーネントのマウント時や依存関係の変更時に実行される
  useEffect(() => {
    // 認証状態の変更を監視
    // onAuthStateChanged: Firebaseの認証状態が変わった時に呼ばれる
    // auth: Firebase Authenticationのインスタンス
    // setUser: 現在のユーザー情報を更新する関数
    // setUserProfile: ユーザープロフィール情報を更新する関数
    // getDoc: Firestoreからドキュメントを取得する関数
    // doc: Firestoreのドキュメント参照を作成する関数
    // db: Firestoreのインスタンス
    // user: 現在のユーザー情報
    // userProfile: ユーザープロフィール情報
    // loading: ローディング状態
    // setLoading: ローディング状態を更新する関数
    // 依存配列が空なので、コンポーネントのマウント時のみ実行される
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ユーザーがログインしている場合
        setUser(user);

        // Firestoreからユーザープロフィールを取得
        try {
          // doc: Firestoreのドキュメント参照を作成
          // getDoc: ドキュメントを取得
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            // ドキュメントが存在する場合、データを設定
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        // ユーザーがログアウトしている場合
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false); // ローディング完了
    });

    // クリーンアップ関数
    // コンポーネントがアンマウントされる時に監視を停止
    return () => unsubscribe();
  }, []); // 空の依存配列 = マウント時のみ実行

  // フォロー状態をリアルタイムで更新する関数
  // targetUserId: フォロー対象のユーザーID
  // isFollowing: フォロー中かどうか
  const updateFollowingList = (targetUserId, isFollowing) => {
    if (!userProfile) return;

    // setUserProfile: ユーザープロフィールの状態を更新
    setUserProfile((prev) => {
      if (!prev) return prev;

      // 現在のフォローリストを取得（配列でない場合は空配列）
      const currentFollowing = Array.isArray(prev.following)
        ? prev.following
        : [];

      return {
        ...prev, // 既存のプロフィール情報を保持
        following: isFollowing // フォロー中かどうか
          ? [...currentFollowing, targetUserId] // フォローする場合：追加
          : currentFollowing.filter((id) => id !== targetUserId), // アンフォローする場合：削除
      };
    });
  };

  // ユーザー登録関数
  // email: メールアドレス、password: パスワード、name: 表示名
  const signUpUser = async (email, password, name) => {
    try {
      // Firebase Authenticationでユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firestoreにユーザープロフィールを保存
      const userProfile = {
        uid: user.uid, // ユーザーID
        email: user.email, // メールアドレス
        name: name, // 表示名
        username: email.split("@")[0], // メールアドレスからユーザー名を生成
        bio: "", // 自己紹介（空）
        avatar: "", // アバター画像（空文字列 - フォールバックで文字を表示）
        createdAt: new Date().toISOString(), // 作成日時
        followers: [], // フォロワーリスト（空）
        following: [], // フォロー中リスト（空）
      };

      // setDoc: Firestoreにドキュメントを保存
      await setDoc(doc(db, "users", user.uid), userProfile);
      setUserProfile(userProfile);

      // 成功時の戻り値
      return { success: true, message: "Account created successfully!" };
    } catch (error) {
      console.error("Sign up error:", error);
      // エラー時の戻り値
      return { success: false, message: error.message };
    }
  };

  // ユーザーログイン関数
  const signInUser = async (email, password) => {
    try {
      // Firebase Authenticationでログイン
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true, message: "Logged in successfully!" };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, message: error.message };
    }
  };

  // Googleログイン関数
  const signInWithGoogle = async () => {
    try {
      // GoogleAuthProvider: Googleログイン用のプロバイダー
      const provider = new GoogleAuthProvider();
      // signInWithPopup: ポップアップでGoogleログインを実行
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ユーザーが初回ログインかチェック
      // getDoc: Firestoreからユーザードキュメントを取得
      // doc: Firestoreのドキュメント参照を作成
      // db: Firestoreのインスタンス
      // user.uid: 現在のユーザーのID
      // userDoc: ユーザードキュメントの参照
      // userProfile: ユーザープロフィール情報
      // setDoc: Firestoreにドキュメントを保存
      // userProfile: ユーザープロフィール情報を設定
      // userProfile: ユーザープロフィール情報を設定
      // setUserProfile: ユーザープロフィールの状態を更新
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        // 初回ログインの場合、プロフィールを作成
        const userProfile = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User", // Googleアカウントの表示名
          username: user.email.split("@")[0],
          bio: "",
          // Googleアカウントの画像がある場合は使用、ない場合は空文字列
          avatar: user.photoURL || "",
          createdAt: new Date().toISOString(),
          followers: [],
          following: [],
        };

        await setDoc(doc(db, "users", user.uid), userProfile);
        setUserProfile(userProfile);
      }

      return { success: true, message: "Logged in with Google successfully!" };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { success: false, message: error.message };
    }
  };

  // ログアウト関数
  const logout = async () => {
    try {
      // Firebase Authenticationからログアウト
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // コンテキストの値
  // この値が子コンポーネントで使用できるようになります
  const value = {
    user, // 現在のユーザー情報
    userProfile, // ユーザープロフィール情報
    loading, // ローディング状態
    signUpUser, // ユーザー登録関数
    signInUser, // ログイン関数
    signInWithGoogle, // Googleログイン関数
    logout, // ログアウト関数
    updateFollowingList, // フォロー状態更新関数
  };

  // AuthContext.Providerで子コンポーネントを包む
  // これにより、子コンポーネントでuseAuth()が使用できるようになります
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

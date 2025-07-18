// Import the functions you need from the SDKs you need
import "firebase/auth"; // ← Firebase Authenticationを使用するために必要
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ──────────────────────────────────────────────
// アプリを「一度だけ」初期化
// 複数回初期化を防ぐためのチェック
// ──────────────────────────────────────────────
// getApps(): 既に初期化されたFirebaseアプリの配列を取得
// 配列が空（length === 0）の場合は初期化、そうでなければ既存のアプリを取得
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ──────────────────────────────────────────────
// 各 Firebase サービスのインスタンスを作成
// ──────────────────────────────────────────────
export const auth = getAuth(app); // Firebase Authentication - ユーザー認証
export const db = getFirestore(app); // Cloud Firestore - NoSQLデータベース
// export const storage = getStorage(app) // Cloud Storage - ファイルストレージ

// デフォルトエクスポート（必要に応じて使用）
export default app;

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import type { AnalysisResult } from "../types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env
    .VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export class FirebaseService {
  private static instance: FirebaseService;

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async saveAnalysis(analysis: AnalysisResult): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "analyses"), {
        ...analysis,
        createdAt: new Date(analysis.createdAt),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving analysis:", error);
      throw new Error("Failed to save analysis");
    }
  }

  async getAnalyses(limitCount: number = 50): Promise<AnalysisResult[]> {
    try {
      const q = query(
        collection(db, "analyses"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toMillis(),
      })) as AnalysisResult[];
    } catch (error) {
      console.error("Error getting analyses:", error);
      throw new Error("Failed to get analyses");
    }
  }

  async deleteAnalysis(analysisId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "analyses", analysisId));
    } catch (error) {
      console.error("Error deleting analysis:", error);
      throw new Error("Failed to delete analysis");
    }
  }

  async getAnalysesByKind(
    kind: string,
    limitCount: number = 20
  ): Promise<AnalysisResult[]> {
    try {
      const q = query(
        collection(db, "analyses"),
        where("kind", "==", kind),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toMillis(),
      })) as AnalysisResult[];
    } catch (error) {
      console.error("Error getting analyses by kind:", error);
      throw new Error("Failed to get analyses by kind");
    }
  }
}

export const firebaseService = FirebaseService.getInstance();

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
      // En lugar de fallar, generar un ID local y continuar
      const localId = `local_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      console.warn("Using local ID for analysis:", localId);
      return localId;
    }
  }

  async getAnalyses(limitCount: number = 50): Promise<AnalysisResult[]> {
    try {
      console.log("Attempting to fetch analyses from Firebase...");
      const q = query(
        collection(db, "analyses"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toMillis(),
      })) as AnalysisResult[];

      console.log(`Successfully fetched ${results.length} analyses from Firebase`);
      return results;
    } catch (error) {
      console.error("Error getting analyses:", error);
      // En lugar de fallar, retornar array vacío
      console.warn("Firebase not available, returning empty analyses list");
      return [];
    }
  }

  async deleteAnalysis(analysisId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "analyses", analysisId));
    } catch (error) {
      console.error("Error deleting analysis:", error);
      // En lugar de fallar, solo loggear el error
      console.warn("Could not delete analysis from Firebase:", error);
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
      // En lugar de fallar, retornar array vacío
      console.warn(
        "Firebase not available, returning empty analyses list for kind:",
        kind
      );
      return [];
    }
  }
}

export const firebaseService = FirebaseService.getInstance();

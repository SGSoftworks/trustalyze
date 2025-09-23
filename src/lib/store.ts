import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { AnalysisResult } from "../types";

export async function saveResult(result: Omit<AnalysisResult, "createdAt">) {
  const payload = { ...result, createdAt: Date.now(), ts: serverTimestamp() };
  const ref = await addDoc(collection(db, "results"), payload);
  return ref.id;
}

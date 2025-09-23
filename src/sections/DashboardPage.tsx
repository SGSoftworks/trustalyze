import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { AnalysisResult } from "../types";
import { Logo } from "../components/Logo";

export function DashboardPage() {
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const qy = query(
          collection(db, "results"),
          orderBy("ts", "desc"),
          limit(20)
        );
        const snap = await getDocs(qy);
            const data = snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<AnalysisResult, 'id'>),
            })) as AnalysisResult[];
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Logo size="lg" showText={true} className="justify-center mb-4" />
        <h1 className="text-3xl font-semibold text-slate-800">Panel General</h1>
        <p className="text-slate-600 mt-2">
          Análisis recientes de detección de contenido IA
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-slate-600">Cargando análisis...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No hay análisis aún
          </h3>
          <p className="text-slate-600">
            Realiza tu primer análisis en las secciones de arriba
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it.id}
              className="border rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {it.kind.toUpperCase()}
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(it.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-xs text-slate-500 mb-1">IA</div>
                  <div className="text-2xl font-bold text-red-600">
                    {it.aiProbability}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500 mb-1">Humano</div>
                  <div className="text-2xl font-bold text-green-600">
                    {it.humanProbability}%
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-700 leading-relaxed">
                {it.justification}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { AnalysisResult } from "../types";

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
          ...(d.data() as any),
        })) as AnalysisResult[];
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Panel General</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it.id} className="border rounded-lg bg-white p-4">
              <div className="text-sm text-slate-500">
                {it.kind.toUpperCase()}
              </div>
              <div className="mt-2 flex items-center gap-6">
                <div>
                  <div className="text-xs text-slate-500">IA</div>
                  <div className="text-xl font-semibold">
                    {it.aiProbability}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Humano</div>
                  <div className="text-xl font-semibold">
                    {it.humanProbability}%
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm">{it.justification}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

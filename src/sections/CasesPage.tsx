import { useState } from "react";

export function CasesPage() {
  const [query, setQuery] = useState("detección de deepfakes");
  const [items, setItems] = useState<{
    title: string;
    link: string;
    snippet: string;
  }[]>([]);

  const search = async () => {
    const resp = await fetch(
      `/api/search-related?q=${encodeURIComponent(query)}`
    );
    const data = await resp.json();
    setItems(data.items || []);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Casos y Recursos</h1>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Buscar en Google Custom Search"
        />
        <button
          onClick={search}
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
        >
          Buscar
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((it, idx) => (
          <li key={idx} className="border rounded p-3 bg-white">
            <a
              className="text-blue-700 underline"
              href={it.link}
              target="_blank"
              rel="noreferrer"
            >
              {it.title}
            </a>
            <p className="text-sm text-slate-600">{it.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

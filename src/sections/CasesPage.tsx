import { useState } from "react";

export function CasesPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<{ title: string; link: string; snippet: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const resp = await fetch(
        `/api/search-related?q=${encodeURIComponent(query)}`
      );
      const data = await resp.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Search error:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const suggestedQueries = [
    "detección de deepfakes",
    "contenido generado por IA",
    "herramientas de verificación",
    "inteligencia artificial en medios",
    "combatir desinformación",
    "verificación de imágenes",
    "análisis de videos",
    "detección de texto IA"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Casos y Recursos</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explora casos reales, investigaciones y recursos sobre detección de contenido IA
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
              Buscar Recursos Especializados
            </h2>
            
            <div className="flex gap-3 mb-6">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Buscar casos, investigaciones, herramientas..."
              />
              <button
                onClick={search}
                disabled={loading || !query.trim()}
                className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Buscando...
                  </div>
                ) : (
                  "Buscar"
                )}
              </button>
            </div>

            {/* Suggested Queries */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Búsquedas sugeridas:</h3>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(suggestion);
                      search();
                    }}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="bg-white rounded-xl shadow-sm border p-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-3 text-slate-600">Buscando recursos...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No se encontraron resultados</h3>
                <p className="text-slate-600">Intenta con términos de búsqueda diferentes</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Resultados de búsqueda
                  </h2>
                  <span className="text-sm text-slate-500">
                    {items.length} resultado{items.length !== 1 ? 's' : ''} encontrado{items.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-lg font-semibold text-blue-700 hover:text-blue-800 hover:underline mb-2 block"
                          >
                            {item.title}
                          </a>
                          <p className="text-slate-600 leading-relaxed mb-3">
                            {item.snippet}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Enlace externo
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Recurso especializado
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Information Section */}
        {!hasSearched && (
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
              Recursos y Casos de Estudio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-slate-200 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Investigaciones</h3>
                <p className="text-sm text-slate-600">Estudios académicos y papers sobre detección de IA</p>
              </div>
              
              <div className="text-center p-6 border border-slate-200 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Herramientas</h3>
                <p className="text-sm text-slate-600">Software y plataformas de verificación de contenido</p>
              </div>
              
              <div className="text-center p-6 border border-slate-200 rounded-lg">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Casos de Estudio</h3>
                <p className="text-sm text-slate-600">Ejemplos reales de detección de contenido IA</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
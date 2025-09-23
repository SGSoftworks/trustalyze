import { NavLink } from "react-router-dom";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <img
                src="/logo.png"
                alt="Trustalyze Logo"
                className="mx-auto h-32 w-auto object-contain"
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Sistema de Detección de
              <span className="text-blue-600 block">Contenido IA</span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Plataforma avanzada basada en inteligencia artificial para
              detectar y analizar contenido generado por IA vs contenido humano
              en textos, documentos, imágenes y videos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink
                to="/texto"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Analizar Texto
              </NavLink>
              <NavLink
                to="/documentos"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
              >
                Analizar Documentos
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Tecnología Avanzada de Detección
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Utilizamos modelos de IA de última generación para proporcionar
              análisis precisos y confiables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Análisis de Texto
              </h3>
              <p className="text-slate-600">
                Detecta contenido generado por IA en textos y artículos
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Documentos
              </h3>
              <p className="text-slate-600">
                Analiza PDF, DOCX y otros formatos de documentos
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Imágenes
              </h3>
              <p className="text-slate-600">
                Detecta imágenes generadas o manipuladas por IA
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Videos
              </h3>
              <p className="text-slate-600">
                Identifica deepfakes y videos manipulados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Tecnologías de Vanguardia
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Integramos las mejores APIs y modelos de IA para garantizar la
              máxima precisión
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">HF</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Hugging Face
                </h3>
              </div>
              <p className="text-slate-600">
                Modelos especializados en detección de contenido generado por
                IA, incluyendo roberta-base-openai-detector para análisis de
                patrones lingüísticos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Google Gemini
                </h3>
              </div>
              <p className="text-slate-600">
                Gemini 2.0 Flash para análisis semántico avanzado y evaluación
                contextual de la coherencia y naturalidad del contenido.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">GS</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Google Search
                </h3>
              </div>
              <p className="text-slate-600">
                API de búsqueda personalizada para verificar información y
                encontrar fuentes relacionadas que ayuden en la validación del
                contenido.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para verificar tu contenido?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a la lucha contra la desinformación con herramientas de IA de
            última generación
          </p>
          <NavLink
            to="/texto"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg inline-block"
          >
            Comenzar Análisis
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transparencia y protección de datos en Trustalyze
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Cumplimiento con Ley 1581 de 2012 (Colombia)
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="prose prose-slate max-w-none">
            {/* Datos que Recopilamos */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                <h2 className="text-2xl font-bold text-slate-900 m-0">
                  Datos que Recopilamos
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Contenido para Análisis
                  </h3>
                  <ul className="text-slate-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Textos enviados para análisis de IA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Metadatos de archivos (nombre, tamaño, tipo)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Contenido extraído de documentos</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">
                    Datos de Análisis
                  </h3>
                  <ul className="text-slate-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Resultados de probabilidad IA/Humano</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Factores de análisis técnicos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Metodología y recomendaciones</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Qué Almacenamos */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">
                  Qué Almacenamos
                </h2>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-3 h-3 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">
                      Política de Almacenamiento Limitado
                    </h3>
                    <p className="text-amber-800 leading-relaxed">
                      <strong>NO almacenamos archivos completos</strong>{" "}
                      (imágenes, videos, documentos). El sistema procesa el
                      contenido en tiempo real y solo conserva metadatos y
                      resultados de análisis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    ✅ SÍ Almacenamos
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-slate-900">
                          Metadatos de archivos
                        </span>
                        <p className="text-sm text-slate-600">
                          Nombre, tamaño, tipo de archivo
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-slate-900">
                          Resultados de análisis
                        </span>
                        <p className="text-sm text-slate-600">
                          Probabilidades, determinaciones, factores
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-slate-900">
                          Texto extraído
                        </span>
                        <p className="text-sm text-slate-600">
                          Solo el contenido textual de documentos
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-slate-900">
                          Timestamps
                        </span>
                        <p className="text-sm text-slate-600">
                          Fecha y hora de análisis
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    ❌ NO Almacenamos
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-slate-900">
                          Archivos originales
                        </span>
                        <p className="text-sm text-slate-600">
                          Imágenes, videos, documentos completos
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-slate-900">
                          Datos personales
                        </span>
                        <p className="text-sm text-slate-600">
                          Información identificable del usuario
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-slate-900">
                          Contenido multimedia
                        </span>
                        <p className="text-sm text-slate-600">
                          Archivos binarios de imágenes/videos
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-slate-900">
                          Cookies persistentes
                        </span>
                        <p className="text-sm text-slate-600">
                          Solo cookies técnicas necesarias
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Protección de Datos */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">
                  Protección de Datos
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-slate-200 rounded-lg">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Encriptación
                  </h3>
                  <p className="text-sm text-slate-600">
                    Todos los datos se transmiten y almacenan con encriptación
                    de extremo a extremo
                  </p>
                </div>

                <div className="text-center p-6 border border-slate-200 rounded-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Acceso Restringido
                  </h3>
                  <p className="text-sm text-slate-600">
                    Solo personal autorizado puede acceder a los datos de
                    análisis
                  </p>
                </div>

                <div className="text-center p-6 border border-slate-200 rounded-lg">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Retención Limitada
                  </h3>
                  <p className="text-sm text-slate-600">
                    Los datos se eliminan automáticamente después de 30 días
                  </p>
                </div>
              </div>
            </section>

            {/* Consentimiento */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">
                  Consentimiento y Uso
                </h2>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">
                  Consentimiento Explícito
                </h3>
                <p className="text-purple-800 mb-4">
                  Al utilizar Trustalyze, usted acepta que:
                </p>
                <ul className="space-y-2 text-purple-800">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Sus archivos se procesan temporalmente para análisis de
                      detección de IA
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Los metadatos y resultados se almacenan para mejorar el
                      servicio
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Los archivos originales NO se conservan en nuestros
                      servidores
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Los datos se utilizan únicamente para análisis de
                      detección de IA
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Cumplimiento Legal */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l-2.83 2.83M6 7l2.83 2.83m0 0L9 16l-2.83-2.83M9 16l2.83-2.83M9 16l-2.83-2.83"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">
                  Cumplimiento Legal
                </h2>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">
                  Ley 1581 de 2012 - Colombia
                </h3>
                <p className="text-red-800 mb-4">
                  Trustalyze cumple con la normativa colombiana de protección de
                  datos personales:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">
                      Derechos del Usuario
                    </h4>
                    <ul className="space-y-1 text-sm text-red-800">
                      <li>• Acceso a sus datos</li>
                      <li>• Rectificación de información</li>
                      <li>• Supresión de datos</li>
                      <li>• Revocación del consentimiento</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">
                      Nuestros Compromisos
                    </h4>
                    <ul className="space-y-1 text-sm text-red-800">
                      <li>• Transparencia en el tratamiento</li>
                      <li>• Finalidad específica y legítima</li>
                      <li>• Calidad y veracidad de datos</li>
                      <li>• Seguridad y confidencialidad</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">
                  Contacto y Consultas
                </h2>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <p className="text-slate-700 mb-4">
                  Para ejercer sus derechos o realizar consultas sobre el manejo
                  de datos:
                </p>
                <div className="flex items-center gap-2 text-slate-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Email: privacidad@trustalyze.com</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>Última actualización: {new Date().toLocaleDateString("es-CO")}</p>
          <p>Trustalyze - Sistema de Detección de Contenido IA</p>
        </div>
      </div>
    </div>
  );
}

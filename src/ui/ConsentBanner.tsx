import { useState, useEffect } from "react";
import { privacyService } from "../lib/privacy";

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const hasConsent = privacyService.hasValidConsent();
    setIsVisible(!hasConsent);
  }, []);

  const handleAccept = () => {
    const consent = {
      dataCollection: true,
      dataStorage: true,
      dataAnalysis: true,
      dataSharing: false,
      timestamp: Date.now(),
    };
    privacyService.setConsent(consent);
    setIsVisible(false);
  };

  const handleReject = () => {
    const consent = {
      dataCollection: false,
      dataStorage: false,
      dataAnalysis: false,
      dataSharing: false,
      timestamp: Date.now(),
    };
    privacyService.setConsent(consent);
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowDetails(true);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-6 z-50 border-t border-slate-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-6">
            <h3 className="text-lg font-semibold mb-2">
              Protección de Datos y Privacidad
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Trustalyze respeta tu privacidad. Necesitamos tu consentimiento
              para procesar y analizar el contenido que subas. Solo almacenamos
              los resultados del análisis, nunca el contenido original.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                Aceptar y Continuar
              </button>
              <button
                onClick={handleCustomize}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
              >
                Personalizar
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors"
              >
                Solo Navegar
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {showDetails && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h4 className="font-semibold mb-4">Configuración de Privacidad</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2">¿Qué datos recopilamos?</h5>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Contenido que analizas (temporalmente)</li>
                  <li>• Resultados del análisis de IA</li>
                  <li>• Metadatos básicos (fecha, tipo)</li>
                  <li>• Configuraciones de privacidad</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">¿Qué NO almacenamos?</h5>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Contenido original que subes</li>
                  <li>• Archivos que analizas</li>
                  <li>• Información personal</li>
                  <li>• Datos de navegación detallados</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors"
              >
                Aceptar Todo
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
              >
                Rechazar Todo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

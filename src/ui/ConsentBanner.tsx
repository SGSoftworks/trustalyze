import { useEffect, useState } from "react";

export function ConsentBanner() {
  const [accepted, setAccepted] = useState<boolean>(true);

  useEffect(() => {
    const v = localStorage.getItem("trustalyze-consent");
    setAccepted(v === "yes");
  }, []);

  const accept = () => {
    localStorage.setItem("trustalyze-consent", "yes");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      <div className="max-w-6xl mx-auto m-4 p-4 rounded-lg border bg-white shadow">
        <p className="text-sm">
          Usamos tus datos únicamente para realizar el análisis y mejorar la
          calidad del servicio. Al continuar, aceptas la{" "}
          <a href="/privacidad" className="text-blue-700 underline">
            política de privacidad
          </a>
          .
        </p>
        <div className="mt-3">
          <button
            onClick={accept}
            className="px-4 py-2 rounded-md bg-blue-600 text-white"
          >
            Aceptar y continuar
          </button>
        </div>
      </div>
    </div>
  );
}

import { Outlet, NavLink } from "react-router-dom";
import { ConsentBanner } from "./ConsentBanner";
import { Logo } from "../components/Logo";

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="md" showText={true} />
          <nav className="flex gap-4 text-sm">
            <NavLink
              to="/texto"
              className={({ isActive }) =>
                `hover:text-blue-700 ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Texto
            </NavLink>
            <NavLink
              to="/documentos"
              className={({ isActive }) =>
                `hover:text-blue-700 ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Documentos
            </NavLink>
            <NavLink
              to="/imagenes"
              className={({ isActive }) =>
                `hover:text-blue-700 ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Imágenes
            </NavLink>
            <NavLink
              to="/videos"
              className={({ isActive }) =>
                `hover:text-blue-700 ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Videos
            </NavLink>
            <NavLink
              to="/casos"
              className={({ isActive }) =>
                `hover:text-blue-700 ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Casos
            </NavLink>
            <NavLink
              to="/privacidad"
              className={({ isActive }) =>
                `hover:text-blue-700 ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Privacidad
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <ConsentBanner />
      <footer className="border-t text-sm text-slate-500 py-6">
        <div className="max-w-6xl mx-auto px-4">
          © {new Date().getFullYear()} Trustalyze
        </div>
      </footer>
    </div>
  );
}

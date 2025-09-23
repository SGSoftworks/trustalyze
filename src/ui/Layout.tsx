import { Outlet, NavLink } from "react-router-dom";
import { ConsentBanner } from "./ConsentBanner";
import { Logo } from "../components/Logo";

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="font-semibold tracking-tight text-xl">
            <Logo size="md" showText={true} />
          </NavLink>
          <nav className="hidden md:flex gap-6 text-sm">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `hover:text-blue-700 transition-colors ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/texto"
              className={({ isActive }) =>
                `hover:text-blue-700 transition-colors ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Texto
            </NavLink>
            <NavLink
              to="/documentos"
              className={({ isActive }) =>
                `hover:text-blue-700 transition-colors ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Documentos
            </NavLink>
            <NavLink
              to="/imagenes"
              className={({ isActive }) =>
                `hover:text-blue-700 transition-colors ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Imágenes
            </NavLink>
            <NavLink
              to="/videos"
              className={({ isActive }) =>
                `hover:text-blue-700 transition-colors ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Videos
            </NavLink>
            <NavLink
              to="/casos"
              className={({ isActive }) =>
                `hover:text-blue-700 transition-colors ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Casos
            </NavLink>
            <NavLink
              to="/acerca"
              className={({ isActive }) =>
                `hover:text-blue-700 transition-colors ${
                  isActive ? "text-blue-700 font-medium" : ""
                }`
              }
            >
              Acerca de
            </NavLink>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-slate-600 hover:text-slate-900">
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t bg-white text-sm text-slate-500 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="Trustalyze" className="h-8 w-8" />
                <span className="font-semibold text-slate-900">Trustalyze</span>
              </div>
              <p className="text-slate-600">
                Sistema de detección de contenido generado por IA
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Análisis</h3>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <NavLink to="/texto" className="hover:text-blue-600">
                    Texto
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/documentos" className="hover:text-blue-600">
                    Documentos
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/imagenes" className="hover:text-blue-600">
                    Imágenes
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/videos" className="hover:text-blue-600">
                    Videos
                  </NavLink>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Información</h3>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <NavLink to="/acerca" className="hover:text-blue-600">
                    Acerca de
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/casos" className="hover:text-blue-600">
                    Casos
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard" className="hover:text-blue-600">
                    Dashboard
                  </NavLink>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Legal</h3>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <NavLink to="/privacidad" className="hover:text-blue-600">
                    Privacidad
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-center">
            <p>
              © {new Date().getFullYear()} Trustalyze - UNINPAHU. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </footer>
      <ConsentBanner />
    </div>
  );
}

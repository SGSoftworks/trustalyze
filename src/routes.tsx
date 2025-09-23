import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./ui/Layout";
import { HomePage } from "./sections/HomePage";
import { TextPage } from "./sections/TextPage";
import { DocumentsPage } from "./sections/DocumentsPage";
import { ImagesPage } from "./sections/ImagesPage";
import { VideosPage } from "./sections/VideosPage";
import { CasesPage } from "./sections/CasesPage";
import { DashboardPage } from "./sections/DashboardPage";
import { PrivacyPage } from "./sections/PrivacyPage";
import { AboutPage } from "./sections/AboutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "texto", element: <TextPage /> },
      { path: "documentos", element: <DocumentsPage /> },
      { path: "imagenes", element: <ImagesPage /> },
      { path: "videos", element: <VideosPage /> },
      { path: "casos", element: <CasesPage /> },
      { path: "privacidad", element: <PrivacyPage /> },
      { path: "acerca", element: <AboutPage /> },
    ],
  },
]);

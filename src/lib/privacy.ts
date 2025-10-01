import type { UserConsent, PrivacySettings } from "../types";

export class PrivacyService {
  private static instance: PrivacyService;
  private static readonly CONSENT_KEY = "trustalyze_consent";
  private static readonly PRIVACY_KEY = "trustalyze_privacy";

  public static getInstance(): PrivacyService {
    if (!PrivacyService.instance) {
      PrivacyService.instance = new PrivacyService();
    }
    return PrivacyService.instance;
  }

  getConsent(): UserConsent | null {
    try {
      const stored = localStorage.getItem(PrivacyService.CONSENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  setConsent(consent: UserConsent): void {
    localStorage.setItem(PrivacyService.CONSENT_KEY, JSON.stringify(consent));
  }

  getPrivacySettings(): PrivacySettings {
    try {
      const stored = localStorage.getItem(PrivacyService.PRIVACY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback to default settings
    }

    return {
      consent: {
        dataCollection: false,
        dataStorage: false,
        dataAnalysis: false,
        dataSharing: false,
        timestamp: 0,
      },
      dataRetention: 30, // 30 days
      allowAnalytics: false,
      allowCookies: false,
    };
  }

  setPrivacySettings(settings: PrivacySettings): void {
    localStorage.setItem(PrivacyService.PRIVACY_KEY, JSON.stringify(settings));
  }

  hasValidConsent(): boolean {
    const consent = this.getConsent();
    if (!consent) return false;

    // Check if consent is not older than 1 year
    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    if (consent.timestamp < oneYearAgo) return false;

    return consent.dataCollection && consent.dataAnalysis;
  }

  getDataCollectionInfo() {
    return {
      whatWeCollect: [
        "Contenido que analizas (texto, documentos, imágenes, videos)",
        "Resultados del análisis de IA",
        "Metadatos básicos (fecha, tipo de contenido, duración del análisis)",
        "Configuraciones de privacidad que selecciones",
      ],
      whatWeStore: [
        "Solo resultados de análisis (sin el contenido original)",
        "Metadatos de uso para mejorar el servicio",
        "Configuraciones de privacidad",
      ],
      whatWeDontStore: [
        "Contenido original que analizas",
        "Archivos que subes",
        "Información personal identificable",
        "Datos de navegación detallados",
      ],
      howWeProtect: [
        "Cifrado de extremo a extremo",
        "Almacenamiento seguro en Firebase",
        "Eliminación automática después del período de retención",
        "No compartimos datos con terceros",
      ],
      yourRights: [
        "Eliminar tus datos en cualquier momento",
        "Exportar tus análisis",
        "Modificar configuraciones de privacidad",
        "Retirar consentimiento",
      ],
    };
  }

  getLegalCompliance() {
    return {
      colombia: {
        ley1581:
          "Cumplimos con la Ley 1581 de 2012 de Protección de Datos Personales",
        decreto1377:
          "Aplicamos el Decreto 1377 de 2013 sobre tratamiento de datos",
        habeasData: "Respetamos el derecho fundamental al habeas data",
      },
      international: {
        gdpr: "Aplicamos principios del RGPD para protección de datos",
        transparency: "Proporcionamos transparencia total en el uso de datos",
        userControl: "Los usuarios tienen control total sobre sus datos",
      },
    };
  }
}

export const privacyService = PrivacyService.getInstance();

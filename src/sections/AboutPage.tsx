import { NavLink } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Acerca de Trustalyze</h1>
          <p className="text-xl text-slate-600">
            Sistema Basado en Inteligencia Artificial para la Detección de Contenido Generado por IA
          </p>
        </div>

        {/* Project Info */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Información del Proyecto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Institución</h3>
              <p className="text-slate-600">Fundación Universitaria para el desarrollo humano UNINPAHU</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Programa</h3>
              <p className="text-slate-600">Ingeniería de Software</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Autores</h3>
              <p className="text-slate-600">Iván Jair Mendoza Solano, Juan David Gómez Ruidiaz</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Docente</h3>
              <p className="text-slate-600">Martha Cecilia Vidal Arizabaleta</p>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">El Problema</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            En la era digital, el acceso a la información es más fácil y rápido que nunca, pero esto también ha dado lugar a un aumento significativo en la propagación de noticias falsas y contenido generado por IA. Las plataformas digitales y las redes sociales permiten la difusión de contenido sin filtros ni verificaciones rigurosas, lo que genera una creciente problemática en términos de desinformación.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Según datos del Ministerio de Tecnologías de la Información y las Comunicaciones (2022), el 70% de los colombianos se informan a través de redes sociales, lo que aumenta la vulnerabilidad a la desinformación. Casos recientes han tenido un impacto significativo en la toma de decisiones políticas y en la adopción de medidas de salud pública.
          </p>
        </div>

        {/* Solution */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Nuestra Solución</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Trustalyze es un sistema basado en inteligencia artificial que combina múltiples tecnologías de vanguardia para detectar y analizar contenido generado por IA vs contenido humano. Nuestro enfoque integra:
          </p>
          
          <ul className="list-disc list-inside text-slate-700 space-y-2 mb-6">
            <li><strong>Modelos de Hugging Face:</strong> Especializados en detección de patrones de contenido generado por IA</li>
            <li><strong>Google Gemini 2.0 Flash:</strong> Para análisis semántico y evaluación contextual avanzada</li>
            <li><strong>Google Search API:</strong> Para verificación de información y búsqueda de fuentes relacionadas</li>
            <li><strong>Procesamiento de múltiples formatos:</strong> Texto, documentos (PDF, DOCX), imágenes y videos</li>
          </ul>

          <p className="text-slate-700 leading-relaxed">
            El sistema proporciona análisis detallados con explicaciones claras, porcentajes de probabilidad y justificaciones técnicas, ayudando a los usuarios a tomar decisiones informadas sobre la autenticidad del contenido.
          </p>
        </div>

        {/* Methodology */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Metodología</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Nuestro proyecto adopta un enfoque cuantitativo, aplicado y experimental, estructurado en cinco fases principales:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">1. Recolección y Limpieza</h3>
              <p className="text-blue-800 text-sm">Recopilación de datos etiquetados de noticias verdaderas y falsas</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">2. Preprocesamiento</h3>
              <p className="text-green-800 text-sm">Procesamiento de lenguaje natural y normalización de datos</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">3. Entrenamiento</h3>
              <p className="text-purple-800 text-sm">Desarrollo de modelos de clasificación con IA avanzada</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">4. Validación</h3>
              <p className="text-orange-800 text-sm">Evaluación del rendimiento y ajuste de parámetros</p>
            </div>
          </div>
        </div>

        {/* Expected Results */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Resultados Esperados</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Con este proyecto esperamos crear una herramienta útil y accesible que permita detectar contenido generado por IA de forma automática, especialmente en medios digitales y redes sociales. Los resultados esperados incluyen:
          </p>
          
          <ul className="list-disc list-inside text-slate-700 space-y-2">
            <li>Un prototipo funcional que analice textos, documentos, imágenes y videos</li>
            <li>Una interfaz web sencilla para usuarios sin conocimientos técnicos</li>
            <li>Contribución a la alfabetización digital y verificación de información</li>
            <li>Impacto positivo en la forma como las personas acceden y comparten información</li>
            <li>Reducción estimada del 30% en la propagación de contenido falso</li>
          </ul>
        </div>

        {/* Legal Compliance */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Cumplimiento Legal</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Nuestro sistema cumple con las normativas colombianas e internacionales:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Colombia</h3>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>• Ley 1581 de 2012 (Protección de datos personales)</li>
                <li>• Marco Ético para la IA (Ministerio de Ciencia, 2021)</li>
                <li>• Estrategia Nacional de IA (MinTIC, 2022)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Internacional</h3>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>• Principios de la OCDE sobre IA (2019)</li>
                <li>• Recomendaciones UNESCO sobre ética de IA (2021)</li>
                <li>• RGPD de la Unión Europea (como referencia)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <NavLink 
            to="/texto" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg inline-block"
          >
            Probar Trustalyze
          </NavLink>
        </div>
      </div>
    </div>
  );
}

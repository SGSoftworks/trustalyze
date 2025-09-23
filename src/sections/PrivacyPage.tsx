export function PrivacyPage() {
  return (
    <div className="prose max-w-none">
      <h1>Política de Privacidad y Manejo de Datos</h1>
      <h2>Qué datos recopilamos</h2>
      <ul>
        <li>
          Contenido enviado para análisis (texto, imágenes, metadatos de video).
        </li>
        <li>
          Registro básico de resultados (probabilidades y fecha) para el panel.
        </li>
      </ul>
      <h2>Qué almacenamos</h2>
      <p>
        Solo guardamos resultados agregados en Firebase Firestore. El contenido
        fuente no se persiste salvo que el usuario lo habilite.
      </p>
      <h2>Cómo protegemos los datos</h2>
      <p>
        Claves de API se gestionan como variables privadas en Vercel. Firestore
        aplica reglas de seguridad por proyecto.
      </p>
      <h2>Cómo eliminar tus datos</h2>
      <p>
        Escribe al administrador con el identificador del resultado para su
        eliminación o solicita un borrado completo por rango de fechas.
      </p>
      <h2>Consentimiento</h2>
      <p>
        Antes de subir contenido, el usuario debe aceptar el uso con fines de
        análisis y mejora del sistema.
      </p>
      <h2>Cumplimiento legal (Colombia)</h2>
      <p>
        Se adhiere a la Ley 1581 de 2012 y demás normas de protección de datos
        personales. El usuario puede ejercer derechos de acceso, rectificación y
        supresión.
      </p>
    </div>
  );
}

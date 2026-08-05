import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad | FEPV",
  description: "Política de Privacidad de la Fundación Encuentros Para la Vida (FEPV)",
};

export default function PoliticaPrivacidad() {
  return (
    <main className="flex-grow pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="mb-10 text-center">
            <span className="inline-block text-xs font-bold tracking-widest text-fepv-green uppercase bg-fepv-green/10 px-3 py-1.5 rounded-full mb-4">
              Legal
            </span>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-fepv-darkblue mb-4">
              Política de Privacidad
            </h1>
            <p className="text-fepv-gray/80">
              Última actualización: {new Date().toLocaleDateString('es-CO')}
            </p>
          </div>

          <div className="prose prose-lg prose-fepv max-w-none text-fepv-gray">
            <p>
              En la <strong>Fundación Encuentros Para la Vida (FEPV)</strong> estamos comprometidos con la protección de su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando visita nuestro sitio web o interactúa con nuestros programas.
            </p>
            
            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">1. Información que recopilamos</h2>
            <p>
              Podemos recopilar información personal que usted nos proporcione voluntariamente, como su nombre, dirección de correo electrónico, número de teléfono y otra información relevante cuando se inscribe en nuestros programas, hace una donación o se comunica con nosotros.
            </p>

            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">2. Uso de la información</h2>
            <p>
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Gestionar y coordinar nuestros programas sociales y actividades de cooperación.</li>
              <li>Procesar donaciones y emitir los certificados correspondientes.</li>
              <li>Comunicarnos con usted sobre eventos, convocatorias y actualizaciones de la fundación.</li>
              <li>Mejorar nuestro sitio web y los servicios que ofrecemos a la comunidad.</li>
            </ul>

            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">3. Protección de datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas, administrativas y físicas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
              <Link href="/" className="fepv-btn fepv-btn-secondary">
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

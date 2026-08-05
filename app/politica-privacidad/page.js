import Link from "next/link";

export const metadata = {
  title: "PolÃ­tica de Privacidad | FEPV",
  description: "PolÃ­tica de Privacidad de la FundaciÃ³n Encuentros Para la Vida (FEPV)",
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
              PolÃ­tica de Privacidad
            </h1>
            <p className="text-fepv-gray/80">
              Ãšltima actualizaciÃ³n: {new Date().toLocaleDateString('es-CO')}
            </p>
          </div>

          <div className="prose prose-lg prose-fepv max-w-none text-fepv-gray">
            <p>
              En la <strong>FundaciÃ³n Encuentros Para la Vida (FEPV)</strong> estamos comprometidos con la protecciÃ³n de su privacidad. Esta PolÃ­tica de Privacidad explica cÃ³mo recopilamos, usamos, divulgamos y protegemos su informaciÃ³n cuando visita nuestro sitio web o interactÃºa con nuestros programas.
            </p>
            
            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">1. InformaciÃ³n que recopilamos</h2>
            <p>
              Podemos recopilar informaciÃ³n personal que usted nos proporcione voluntariamente, como su nombre, direcciÃ³n de correo electrÃ³nico, nÃºmero de telÃ©fono y otra informaciÃ³n relevante cuando se inscribe en nuestros programas, hace una donaciÃ³n o se comunica con nosotros.
            </p>

            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">2. Uso de la informaciÃ³n</h2>
            <p>
              Utilizamos la informaciÃ³n recopilada para:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Gestionar y coordinar nuestros programas sociales y actividades de cooperaciÃ³n.</li>
              <li>Procesar donaciones y emitir los certificados correspondientes.</li>
              <li>Comunicarnos con usted sobre eventos, convocatorias y actualizaciones de la fundaciÃ³n.</li>
              <li>Mejorar nuestro sitio web y los servicios que ofrecemos a la comunidad.</li>
            </ul>

            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">3. ProtecciÃ³n de datos</h2>
            <p>
              Implementamos medidas de seguridad tÃ©cnicas, administrativas y fÃ­sicas apropiadas para proteger su informaciÃ³n personal contra acceso no autorizado, alteraciÃ³n, divulgaciÃ³n o destrucciÃ³n.
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

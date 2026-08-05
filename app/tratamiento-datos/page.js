import Link from "next/link";

export const metadata = {
  title: "Tratamiento de Datos Personales | FEPV",
  description: "PolÃ­tica de Tratamiento de Datos Personales de la FundaciÃ³n Encuentros Para la Vida (FEPV)",
};

export default function TratamientoDatos() {
  return (
    <main className="flex-grow pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="mb-10 text-center">
            <span className="inline-block text-xs font-bold tracking-widest text-fepv-green uppercase bg-fepv-green/10 px-3 py-1.5 rounded-full mb-4">
              Legal
            </span>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-fepv-darkblue mb-4">
              Tratamiento de Datos Personales
            </h1>
            <p className="text-fepv-gray/80">
              Ãšltima actualizaciÃ³n: {new Date().toLocaleDateString('es-CO')}
            </p>
          </div>

          <div className="prose prose-lg prose-fepv max-w-none text-fepv-gray">
            <p>
              En cumplimiento de la <strong>Ley 1581 de 2012</strong> y el Decreto 1377 de 2013 de la RepÃºblica de Colombia, la <strong>FundaciÃ³n Encuentros Para la Vida (FEPV)</strong> establece la siguiente polÃ­tica de tratamiento de datos personales.
            </p>
            
            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">1. Responsable del Tratamiento</h2>
            <p>
              La FundaciÃ³n Encuentros Para la Vida (FEPV), con sede en AgustÃ­n Codazzi, Cesar, es responsable del tratamiento de los datos personales suministrados por beneficiarios, donantes, voluntarios, aliados y pÃºblico en general.
            </p>

            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">2. Finalidad del Tratamiento</h2>
            <p>
              Los datos personales recolectados serÃ¡n utilizados para:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>El desarrollo de programas sociales y comunitarios.</li>
              <li>EnvÃ­o de informaciÃ³n institucional, convocatorias y boletines.</li>
              <li>Fines administrativos y de registro interno.</li>
              <li>Cumplimiento de obligaciones legales y contractuales.</li>
            </ul>

            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">3. Derechos de los Titulares</h2>
            <p>
              Como titular de la informaciÃ³n, usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Conocer, actualizar y rectificar sus datos personales.</li>
              <li>Solicitar prueba de la autorizaciÃ³n otorgada.</li>
              <li>Ser informado sobre el uso que se ha dado a sus datos.</li>
              <li>Revocar la autorizaciÃ³n y/o solicitar la supresiÃ³n del dato.</li>
            </ul>

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

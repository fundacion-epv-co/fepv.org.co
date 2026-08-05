import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones | FEPV",
  description: "Términos y Condiciones de la Fundación Encuentros Para la Vida (FEPV)",
};

export default function TerminosCondiciones() {
  return (
    <main className="flex-grow pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="mb-10 text-center">
            <span className="inline-block text-xs font-bold tracking-widest text-fepv-green uppercase bg-fepv-green/10 px-3 py-1.5 rounded-full mb-4">
              Legal
            </span>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-fepv-darkblue mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-fepv-gray/80">
              Última actualización: {new Date().toLocaleDateString('es-CO')}
            </p>
          </div>

          <div className="prose prose-lg prose-fepv max-w-none text-fepv-gray">
            <p>
              Bienvenido al sitio web de la <strong>Fundación Encuentros Para la Vida (FEPV)</strong>. Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes Términos y Condiciones de uso.
            </p>
            
            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">1. Uso del Sitio Web</h2>
            <p>
              El contenido de las páginas de este sitio web es para su información y uso general únicamente. Está sujeto a cambios sin previo aviso. Usted se compromete a utilizar el sitio web únicamente con fines lícitos y de una manera que no infrinja los derechos, ni restrinja o inhiba el uso y disfrute del sitio web por parte de cualquier tercero.
            </p>

            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">2. Propiedad Intelectual</h2>
            <p>
              Este sitio web contiene material que es propiedad nuestra o nos ha sido licenciado. Este material incluye, pero no se limita a, el diseño, la disposición, el aspecto, la apariencia y los gráficos. La reproducción está prohibida salvo de acuerdo con el aviso de derechos de autor, que forma parte de estos términos y condiciones.
            </p>

            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">3. Enlaces a Otros Sitios Web</h2>
            <p>
              De vez en cuando, este sitio web también puede incluir enlaces a otros sitios web. Estos enlaces se proporcionan para su conveniencia para proporcionar más información. No significan que respaldamos el(los) sitio(s) web. No tenemos responsabilidad por el contenido de los sitios web vinculados.
            </p>

            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mt-8 mb-4">4. Limitación de Responsabilidad</h2>
            <p>
              Ni nosotros ni terceros ofrecemos ninguna garantía sobre la exactitud, puntualidad, rendimiento, integridad o idoneidad de la información y los materiales que se encuentran u ofrecen en este sitio web para cualquier propósito particular.
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

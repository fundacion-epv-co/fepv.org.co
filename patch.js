const fs = require('fs');
let footer = fs.readFileSync('components/Footer.jsx', 'utf8');
footer = footer.replace('</footer>', '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4 border-t border-white/10 mt-6 text-xs text-white/50 text-justify"><p><strong>Aviso de Privacidad y Tratamiento de Datos Personales (Ley 1581 de 2012):</strong> La Fundación Encuentros Para la Vida (NIT 902074412-0) informa que los datos personales obtenidos a través de este sitio web serán procesados exclusivamente con fines institucionales y de gestión de usuarios. El titular tiene derecho a conocer, actualizar y rectificar su información contactándonos a fundacion.epv.co@gmail.com.</p></div></footer>');
fs.writeFileSync('components/Footer.jsx', footer, 'utf8');

let convo = fs.readFileSync('app/convocatorias/page.js', 'utf8');
convo = convo.replace('const [filterMunicipio, setFilterMunicipio] = useState("");', 'const [filterCategoriaConv, setFilterCategoriaConv] = useState("");\n  const [filterMunicipio, setFilterMunicipio] = useState("");');

const filterUI = "{/* Filtro de Categorias */}\n" +
"                  <div className=\"mb-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100\">\n" +
"                    <label className=\"text-sm font-bold text-gray-700\">Filtrar por Categoría:</label>\n" +
"                    <select \n" +
"                      value={filterCategoriaConv} \n" +
"                      onChange={(e) => setFilterCategoriaConv(e.target.value)}\n" +
"                      className=\"p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-fepv-green min-w-[200px]\"\n" +
"                    >\n" +
"                      <option value=\"\">Todas las categorías</option>\n" +
"                      {Array.from(new Set(convocatorias.map(c => c.categoria).filter(Boolean))).map((cat, i) => (\n" +
"                        <option key={i} value={cat}>{cat}</option>\n" +
"                      ))}\n" +
"                    </select>\n" +
"                  </div>\n" +
"                  {(filterCategoriaConv ? convocatorias.filter(c => (c.categoria || \"\").toLowerCase() === filterCategoriaConv.toLowerCase()) : convocatorias).length === 0 ? (";

convo = convo.replace('{convocatorias.length === 0 ? (', filterUI);
convo = convo.replace('{convocatorias.map((c, idx) => {', '{(filterCategoriaConv ? convocatorias.filter(c => (c.categoria || \"\").toLowerCase() === filterCategoriaConv.toLowerCase()) : convocatorias).map((c, idx) => {');
fs.writeFileSync('app/convocatorias/page.js', convo, 'utf8');
console.log('Files updated successfully.');

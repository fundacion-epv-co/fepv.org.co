const fs = require('fs');
let file = fs.readFileSync('app/intranet/page.js', 'utf8');
file = file.replace('setConsEmail(email);', 'setConsEmail(email);\n        setProfileNombre(res.nombre || "");\n        setProfileCargo(res.cargo || "");\n        setProfileDireccion(res.direccion || "");\n        setProfileTelefono(res.telefono || "");');
fs.writeFileSync('app/intranet/page.js', file, 'utf8');
console.log('Fixed handleLogin');

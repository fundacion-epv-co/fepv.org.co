# 🌱 Fundación Encuentros Para la Vida — Plataforma Web FEPV

> **"Encuentros que transforman vidas"**  
> Sitio web institucional, social y de cooperación de la Fundación FEPV — Agustín Codazzi, Cesar, Colombia.

---


## 🚀 Publicar en GitHub Pages (Paso a Paso)

### 1. Crear el repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en **New repository**
3. Nombre sugerido: `fepv-web` (o el que prefieras)
4. Selecciona **Public**
5. **NO** marques "Add a README file"
6. Haz clic en **Create repository**

### 2. Subir el código al repositorio

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd C:\Users\User\.gemini\antigravity\scratch\fepv-web-plataforma

git init
git add .
git commit -m "feat: plataforma web FEPV 1.0 - deploy inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/fepv-web.git
git push -u origin main
```

> ⚠️ Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

### 3. Activar GitHub Pages con GitHub Actions

1. En tu repositorio en GitHub, ve a **Settings** → **Pages**
2. En **Source**, selecciona: **GitHub Actions**
3. Haz clic en **Save**

El workflow de deploy (`.github/workflows/deploy.yml`) se ejecutará automáticamente en cada `push` a `main`.

### 4. Verificar el deploy

- Ve a la pestaña **Actions** de tu repositorio
- Espera a que el workflow `Deploy FEPV Web — GitHub Pages` termine (✅ verde)
- Tu sitio estará disponible en: `https://TU_USUARIO.github.io/fepv-web/`

---

## 💻 Desarrollo Local

```powershell
# Instalar dependencias
npm install

# Servidor de desarrollo (con hot reload)
npm run dev
# → Abre: http://localhost:3000

# Build de producción estático (genera carpeta /out)
npm run build
```

---

## 📁 Estructura del Proyecto

```
fepv-web-plataforma/
├── app/                    # Páginas (Next.js App Router)
│   ├── page.js             # Página de inicio
│   ├── nosotros/           # Quiénes somos, historia, equipo
│   ├── programas/          # Catálogo de programas temáticos
│   ├── convocatorias/      # Oportunidades activas con formulario
│   ├── participa/          # Registro beneficiarios/voluntarios/aliados
│   ├── donaciones/         # Información y guías de donación
│   └── contacto/           # Formulario PQRSF
├── components/
│   ├── Header.jsx          # Navegación principal con logo real
│   └── Footer.jsx          # Pie de página institucional
├── public/
│   ├── logo.jpg            # Logo oficial FEPV
│   └── .nojekyll           # Necesario para GitHub Pages
├── .github/workflows/
│   └── deploy.yml          # CI/CD GitHub Actions
└── next.config.mjs         # Configuración: output: 'export'
```

---

## 📬 Formularios y Contacto

> Los formularios funcionan mediante **WhatsApp pre-llenado** (compatible con sitios estáticos).  
> Al enviar un formulario, se abre WhatsApp con los datos del usuario ya escritos.
> 
> **Actualiza el número de WhatsApp** en los archivos:
> - `app/convocatorias/page.js` — línea con `wa.me/573000000000`
> - `app/participa/page.js` — línea con `wa.me/573000000000`
> - `app/contacto/page.js` — línea con `wa.me/573000000000`
> - `components/Footer.jsx` — enlace de WhatsApp en redes sociales

---

## 🏛️ Información Institucional

| Campo | Detalle |
|-------|---------|
| **Razón Social** | Fundación Encuentros Para la Vida |
| **Sigla** | FEPV |
| **NIT** | En trámite |
| **Sede** | Agustín Codazzi, Cesar, Colombia |
| **Representante Legal** | Jesús Manuel González Madrid |
| **Constitución** | 12 de mayo de 2026 |
| **Registro C&C** | 9 de junio de 2026 |

---

© 2026 Fundación Encuentros Para la Vida (FEPV). Todos los derechos reservados.  
Ley 1581 de 2012 — Protección de Datos Personales Colombia.

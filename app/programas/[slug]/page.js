import { getDynamicPrograms } from "../../../lib/api";
import ProgramDetailClient from "./ProgramDetailClient";

// Generar rutas estáticas a nivel de compilación para todos los programas
export async function generateStaticParams() {
  const defaultSlugs = [
    'salud-mental',
    'familias',
    'educacion',
    'inclusion-derechos',
    'medio-ambiente',
    'bienestar-animal',
    'emprendimiento',
    'cultura-deporte'
  ];

  try {
    const dynamicPrograms = await getDynamicPrograms();
    if (dynamicPrograms && dynamicPrograms.length > 0) {
      const dynamicSlugs = dynamicPrograms.map((prog) => prog.id).filter(Boolean);
      const combined = Array.from(new Set([...defaultSlugs, ...dynamicSlugs]));
      return combined.map((slug) => ({ slug }));
    }
  } catch (e) {
    console.warn("generateStaticParams fallback used:", e);
  }

  return defaultSlugs.map((slug) => ({ slug }));
}

export default async function ProgramDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  
  return <ProgramDetailClient slug={slug} />;
}


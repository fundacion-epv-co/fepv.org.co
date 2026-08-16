import { getDynamicPrograms } from "../../../lib/api";
import ProgramDetailClient from "./ProgramDetailClient";

// Generar rutas estáticas a nivel de compilación
export async function generateStaticParams() {
  const dynamicPrograms = await getDynamicPrograms();
  if (!dynamicPrograms || dynamicPrograms.length === 0) {
    return [{ slug: 'salud-mental' }]; // Fallback
  }
  return dynamicPrograms.map((prog) => ({
    slug: prog.id,
  }));
}

export default async function ProgramDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  
  return <ProgramDetailClient slug={slug} />;
}

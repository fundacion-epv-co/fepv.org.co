import { PROGRAM_DATA } from "../../../lib/programData";
import ProgramDetailClient from "./ProgramDetailClient";

// Generar rutas estáticas a nivel de compilación
export function generateStaticParams() {
  return Object.keys(PROGRAM_DATA).map((key) => ({
    slug: key,
  }));
}

export default async function ProgramDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  
  return <ProgramDetailClient slug={slug} />;
}

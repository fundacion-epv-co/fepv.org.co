import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Fundación Encuentros Para la Vida | FEPV",
  description: "Fundación Encuentros Para la Vida – FEPV. Programas de salud mental, atención psicosocial, educación, inclusión, fortalecimiento familiar, desarrollo comunitario, medio ambiente y bienestar animal.",
  keywords: "Fundación Encuentros Para la Vida, FEPV, Fundación en Cesar, Fundación Agustín Codazzi, programas sociales, salud mental, atención psicosocial, inclusión social, educación comunitaria, cooperación internacional",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${inter.variable} h-full antialiasedScroll`}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="min-h-full flex flex-col text-fepv-gray bg-fepv-white">
        <Header />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

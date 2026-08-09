import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ConfigProvider } from "@/components/ConfigContext";

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
  openGraph: {
    title: "Fundación Encuentros Para la Vida | FEPV",
    description: "Construimos oportunidades, fortalecemos comunidades y generamos transformación social en el territorio.",
    url: "https://fundacion-epv-co.github.io/fepv.org.co/",
    siteName: "Fundación Encuentros Para la Vida",
    images: [
      {
        url: "https://fundacion-epv-co.github.io/fepv.org.co/logo.png",
        width: 512,
        height: 512,
        alt: "Logo FEPV",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${inter.variable} h-full antialiasedScroll`}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="min-h-full flex flex-col text-fepv-gray bg-fepv-white">
        <ConfigProvider>
          <Header />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </ConfigProvider>
      </body>
    </html>
  );
}

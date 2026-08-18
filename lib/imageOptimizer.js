/**
 * FASE 3: IMAGE OPTIMIZER
 * 
 * Helper para optimizar imágenes con next/image
 * Soporta Google Drive URLs, CDN externo, y fallbacks
 */

/**
 * Convierte URL de Google Drive a formato optimizado
 * Reutiliza la función existente de api.js
 * 
 * @param {string} url - URL original (cualquier formato)
 * @returns {string} - URL optimizada para next/image
 */
export function optimizeImageUrl(url) {
  if (!url) return "/placeholder.png"; // Fallback
  
  const trimmed = url.trim();
  
  // Google Drive - convertir a lh3.googleusercontent.com
  if (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com")) {
    let id = "";
    const fileDMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch) {
      id = fileDMatch[1];
    } else {
      const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch) id = idMatch[1];
    }
    
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}=w800`; // Ancho optimizado
    }
  }
  
  // URLs externas - servir como están
  if (trimmed.startsWith("http")) {
    return trimmed;
  }
  
  // Paths relativos
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  
  return "/placeholder.png";
}

/**
 * Obtiene dimensions de imagen recomendadas según contexto
 * @param {string} context - 'thumbnail' | 'card' | 'hero' | 'banner'
 * @returns {Object} - { width, height, quality }
 */
export function getImageDimensions(context = "card") {
  const dimensions = {
    thumbnail: { width: 150, height: 150, quality: 70 },
    card: { width: 400, height: 300, quality: 75 },
    hero: { width: 1200, height: 600, quality: 80 },
    banner: { width: 1920, height: 400, quality: 85 },
    avatar: { width: 100, height: 100, quality: 75 },
    fullwidth: { width: 1024, height: 768, quality: 80 }
  };
  
  return dimensions[context] || dimensions.card;
}

/**
 * Genera srcSet para imágenes responsivas
 * @param {string} url - URL original
 * @param {string} context - Contexto de imagen
 * @returns {string} - srcSet para atributo img
 */
export function generateSrcSet(url, context = "card") {
  const optimized = optimizeImageUrl(url);
  
  if (!optimized || optimized === "/placeholder.png") {
    return optimized;
  }
  
  const dim = getImageDimensions(context);
  
  // Para Google Drive, agregar parametros de redimensionamiento
  if (optimized.includes("lh3.googleusercontent.com")) {
    return `
      ${optimized.replace("w800", "w400")} 400w,
      ${optimized.replace("w800", "w800")} 800w,
      ${optimized.replace("w800", "w1200")} 1200w
    `.trim();
  }
  
  return optimized;
}

/**
 * Wrapper de <img> con lazy loading y error handling
 * 
 * Uso:
 * <OptimizedImage 
 *   src="https://drive.google.com/open?id=ABC"
 *   alt="Programa"
 *   context="card"
 *   className="rounded-lg"
 * />
 */
export function OptimizedImage({ 
  src, 
  alt, 
  context = "card",
  className = "",
  onError = null,
  ...props 
}) {
  const [imageSrc, setImageSrc] = React.useState(optimizeImageUrl(src));
  const [isLoading, setIsLoading] = React.useState(true);
  const dim = getImageDimensions(context);
  
  const handleError = () => {
    setImageSrc("/placeholder.png");
    if (onError) onError();
  };
  
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}
         style={{ aspectRatio: `${dim.width}/${dim.height}` }}>
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        {...props}
      />
      
      {/* Placeholder durante carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
    </div>
  );
}

/**
 * Preload de imágenes (prefetch para better UX)
 * @param {string[]} urls - Array de URLs a precargar
 */
export function preloadImages(urls) {
  if (typeof window === "undefined") return;
  
  urls.forEach(url => {
    const optimized = optimizeImageUrl(url);
    if (optimized && optimized !== "/placeholder.png") {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = optimized;
      document.head.appendChild(link);
    }
  });
}

/**
 * Obtiene URL del placeholder según tamaño
 * @param {string} size - 'small' | 'medium' | 'large'
 * @returns {string} - URL del placeholder
 */
export function getPlaceholder(size = "medium") {
  const placeholders = {
    small: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3C/svg%3E",
    medium: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3C/svg%3E",
    large: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Crect width='1200' height='600' fill='%23e5e7eb'/%3E%3C/svg%3E"
  };
  
  return placeholders[size] || placeholders.medium;
}

import React from "react";
export default OptimizedImage;

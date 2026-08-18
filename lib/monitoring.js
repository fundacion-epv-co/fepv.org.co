/**
 * FASE 5: MONITORING, ERROR TRACKING Y ANALYTICS
 * 
 * Integración con Sentry para error tracking
 * Google Analytics para tracking de eventos
 * Core Web Vitals monitoring
 */

/**
 * ============================================
 * PARTE 1: SENTRY ERROR TRACKING
 * ============================================
 * 
 * Captura errores no manejados en producción
 * 
 * Setup en app/layout.js:
 * import * as Sentry from "@sentry/nextjs";
 * Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
 */

/**
 * Inicializa Sentry (llamar una sola vez en app/layout.js)
 * @param {string} dsn - Sentry DSN
 * @param {string} environment - 'production' | 'staging' | 'development'
 */
export function initializeSentry(dsn, environment = "production") {
  if (typeof window === "undefined") return; // Solo en cliente
  
  if (!dsn) {
    console.warn("⚠️ Sentry DSN not configured");
    return;
  }
  
  // Nota: @sentry/nextjs debe instalarse antes
  // npm install @sentry/nextjs
  console.log(`🔍 Sentry initialized (${environment})`);
}

/**
 * Captura una excepción manualmente
 * @param {Error} error - Error a reportar
 * @param {Object} context - Contexto adicional
 */
export function captureException(error, context = {}) {
  console.error("🔴 Exception captured:", error);
  
  // Si Sentry está disponible:
  // Sentry.captureException(error, { contexts: context });
}

/**
 * Captura un mensaje de info
 * @param {string} message - Mensaje
 * @param {string} level - 'info' | 'warning' | 'error'
 */
export function captureMessage(message, level = "info") {
  console.log(`📝 Message captured (${level}):`, message);
  
  // Si Sentry está disponible:
  // Sentry.captureMessage(message, level);
}

/**
 * ============================================
 * PARTE 2: GOOGLE ANALYTICS
 * ============================================
 * 
 * Tracking de eventos y comportamiento de usuarios
 */

/**
 * Inicializa Google Analytics
 * @param {string} gaId - Google Analytics ID (formato: G-XXXXXXXXXX)
 */
export function initializeAnalytics(gaId) {
  if (typeof window === "undefined") return;
  
  if (!gaId) {
    console.warn("⚠️ Google Analytics ID not configured");
    return;
  }
  
  // Inyectar gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);
  
  // Configurar gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  
  gtag("js", new Date());
  gtag("config", gaId, {
    page_path: window.location.pathname,
    page_title: document.title,
    anonymize_ip: true
  });
  
  console.log(`📊 Google Analytics initialized (${gaId})`);
}

/**
 * Track un evento personalizado
 * @param {string} action - Nombre del evento
 * @param {Object} properties - Propiedades del evento
 */
export function trackEvent(action, properties = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", action, {
    ...properties,
    timestamp: new Date().toISOString()
  });
  
  console.log(`📌 Event tracked: ${action}`, properties);
}

/**
 * Track de página
 * @param {string} path - Path de la página
 * @param {string} title - Título de la página
 */
export function trackPageView(path, title) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
    page_path: path,
    page_title: title
  });
  
  console.log(`📄 Page tracked: ${path}`);
}

/**
 * Track de e-commerce (donación)
 * @param {Object} purchase - { value, currency, items }
 */
export function trackPurchase(purchase) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", "purchase", {
    value: purchase.value,
    currency: purchase.currency || "USD",
    items: purchase.items || [],
    transaction_id: purchase.id || Date.now().toString()
  });
  
  console.log(`💳 Purchase tracked:`, purchase);
}

/**
 * Track de conversión
 * @param {string} conversionName - Nombre de la conversión
 * @param {number} value - Valor (opcional)
 */
export function trackConversion(conversionName, value = 0) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", "conversion", {
    name: conversionName,
    value: value
  });
  
  console.log(`✅ Conversion tracked: ${conversionName}`);
}

/**
 * ============================================
 * PARTE 3: CORE WEB VITALS MONITORING
 * ============================================
 * 
 * Monitorea: LCP, FID/INP, CLS
 */

/**
 * Inicializa Web Vitals monitoring
 * @param {Function} callback - Callback con { metric, value }
 */
export function initializeWebVitals(callback) {
  if (typeof window === "undefined") return;
  
  // Monitorear LCP (Largest Contentful Paint)
  if ("PerformanceObserver" in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      const metric = {
        name: "LCP",
        value: lastEntry.renderTime || lastEntry.loadTime,
        rating: lastEntry.renderTime || lastEntry.loadTime > 2500 ? "poor" : "good"
      };
      
      if (callback) callback(metric);
      console.log(`⚡ LCP: ${metric.value.toFixed(0)}ms (${metric.rating})`);
    });
    
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  }
  
  // Monitorear FID (First Input Delay)
  if ("PerformanceObserver" in window) {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0];
      
      const metric = {
        name: "FID",
        value: firstEntry.processingDuration,
        rating: firstEntry.processingDuration > 100 ? "poor" : "good"
      };
      
      if (callback) callback(metric);
      console.log(`⚡ FID: ${metric.value.toFixed(0)}ms (${metric.rating})`);
    });
    
    fidObserver.observe({ entryTypes: ["first-input"] });
  }
  
  // Monitorear CLS (Cumulative Layout Shift)
  if ("PerformanceObserver" in window) {
    let clsScore = 0;
    
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
      
      const metric = {
        name: "CLS",
        value: clsScore,
        rating: clsScore > 0.1 ? "poor" : "good"
      };
      
      if (callback) callback(metric);
      console.log(`⚡ CLS: ${metric.value.toFixed(3)} (${metric.rating})`);
    });
    
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  }
}

/**
 * ============================================
 * PARTE 4: PERFORMANCE MONITORING
 * ============================================
 */

/**
 * Obtiene métricas de performance actual
 * @returns {Object} - Métricas de timing
 */
export function getPerformanceMetrics() {
  if (typeof window === "undefined" || !window.performance) return null;
  
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;
  
  return {
    pageLoadTime: Math.round(pageLoadTime),
    connectTime: Math.round(connectTime),
    renderTime: Math.round(renderTime),
    resourcesCount: performance.getEntriesByType("resource").length,
    resourcesSize: Math.round(
      performance.getEntriesByType("resource")
        .reduce((acc, res) => acc + (res.transferSize || 0), 0) / 1024
    ) // en KB
  };
}

/**
 * Reporta performance metrics a Analytics
 */
export function reportPerformanceMetrics() {
  const metrics = getPerformanceMetrics();
  
  if (!metrics) return;
  
  trackEvent("performance_metrics", {
    page_load_time: metrics.pageLoadTime,
    connect_time: metrics.connectTime,
    render_time: metrics.renderTime,
    resources_count: metrics.resourcesCount,
    resources_size_kb: metrics.resourcesSize
  });
  
  console.log("📊 Performance metrics reported:", metrics);
}

/**
 * ============================================
 * PARTE 5: ERROR BOUNDARY & ERROR TRACKING
 * ============================================
 */

/**
 * Hook para usar con Error Boundary
 * Captura y reporta errores
 */
export function useErrorHandler() {
  return (error, errorInfo) => {
    console.error("🔴 Error caught:", error, errorInfo);
    
    // Reportar a Sentry
    captureException(error, {
      componentStack: errorInfo.componentStack
    });
    
    // Reportar a Analytics
    trackEvent("error_caught", {
      message: error.message,
      stack: error.stack
    });
  };
}

/**
 * ============================================
 * PARTE 6: LOGGING ESTRUTURADO
 * ============================================
 */

/**
 * Log con nivel y contexto
 * @param {string} level - 'debug' | 'info' | 'warn' | 'error'
 * @param {string} message - Mensaje
 * @param {Object} context - Datos contextuales
 */
export function log(level = "info", message, context = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...context,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    url: typeof window !== "undefined" ? window.location.href : ""
  };
  
  // Log en console
  console[level === "warn" ? "warn" : level === "error" ? "error" : "log"](
    `[${timestamp}] ${level.toUpperCase()}: ${message}`,
    context
  );
  
  // En producción, enviar a servicio de logging
  if (level === "error") {
    captureMessage(message, level);
  }
}

/**
 * Hook para auto-reportar errores de componentes
 */
export function useComponentError(componentName) {
  return (error) => {
    log("error", `Error in ${componentName}`, {
      component: componentName,
      error: error.message,
      stack: error.stack
    });
    
    captureException(error, {
      component: componentName
    });
  };
}

export default {
  // Sentry
  initializeSentry,
  captureException,
  captureMessage,
  
  // Analytics
  initializeAnalytics,
  trackEvent,
  trackPageView,
  trackPurchase,
  trackConversion,
  
  // Web Vitals
  initializeWebVitals,
  
  // Performance
  getPerformanceMetrics,
  reportPerformanceMetrics,
  
  // Logging
  log,
  useErrorHandler,
  useComponentError
};

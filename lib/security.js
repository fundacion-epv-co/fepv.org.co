/**
 * FASE 4: SECURITY UTILITIES
 * 
 * CSRF tokens, Rate limiting, Input sanitization
 */

/**
 * ============================================
 * PARTE 1: CSRF TOKEN GENERATION & VALIDATION
 * ============================================
 * 
 * Protege formularios contra Cross-Site Request Forgery
 */

const CSRF_TOKEN_PREFIX = "fepv_csrf_";
const CSRF_TOKEN_LENGTH = 32;

/**
 * Genera un token CSRF aleatorio
 * @returns {string} - Token CSRF aleatorio
 */
export function generateCSRFToken() {
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(array);
  const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  // Guardar en sessionStorage (se limpia al cerrar navegador)
  if (typeof window !== "undefined") {
    sessionStorage.setItem(CSRF_TOKEN_PREFIX + "session", token);
  }
  
  return token;
}

/**
 * Obtiene el token CSRF almacenado
 * @returns {string} - Token CSRF o null
 */
export function getCSRFToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(CSRF_TOKEN_PREFIX + "session");
}

/**
 * Valida un token CSRF
 * @param {string} token - Token a validar
 * @returns {boolean} - True si es válido
 */
export function validateCSRFToken(token) {
  const stored = getCSRFToken();
  
  if (!token || !stored) {
    console.warn("⚠️ CSRF Token missing");
    return false;
  }
  
  const isValid = token === stored;
  
  if (!isValid) {
    console.error("❌ CSRF Token validation failed");
  }
  
  // Consumir el token (one-time use)
  if (isValid && typeof window !== "undefined") {
    sessionStorage.removeItem(CSRF_TOKEN_PREFIX + "session");
  }
  
  return isValid;
}

/**
 * Hook React para obtener CSRF token
 */
export function useCSRFToken() {
  const [token, setToken] = React.useState(null);
  
  React.useEffect(() => {
    // Obtener token existente o generar uno nuevo
    const existing = getCSRFToken();
    if (existing) {
      setToken(existing);
    } else {
      setToken(generateCSRFToken());
    }
  }, []);
  
  return token;
}

/**
 * ============================================
 * PARTE 2: RATE LIMITING
 * ============================================
 * 
 * Previene abuso limitando requests por usuario/IP
 */

const RATE_LIMIT_PREFIX = "fepv_ratelimit_";
const DEFAULT_WINDOW = 60000; // 1 minuto
const DEFAULT_MAX_REQUESTS = 10; // 10 requests por minuto

/**
 * Verifica si un usuario está dentro del límite de rate
 * @param {string} identifier - IP, user_id, o email
 * @param {number} maxRequests - Max requests permitidos
 * @param {number} windowMs - Ventana de tiempo (ms)
 * @returns {Object} - { allowed: boolean, remaining: number, resetAt: timestamp }
 */
export function checkRateLimit(
  identifier,
  maxRequests = DEFAULT_MAX_REQUESTS,
  windowMs = DEFAULT_WINDOW
) {
  const key = RATE_LIMIT_PREFIX + identifier;
  const now = Date.now();
  
  let data = null;
  
  // Obtener datos del rate limit
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      if (stored) {
        data = JSON.parse(stored);
      }
    }
  } catch (error) {
    console.error("❌ Error reading rate limit:", error);
    return { allowed: true, remaining: maxRequests, resetAt: now + windowMs };
  }
  
  // Si no hay datos o ventana expiró, crear nuevo
  if (!data || now > data.resetAt) {
    data = {
      count: 1,
      resetAt: now + windowMs,
      createdAt: now
    };
    
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
    
    return { 
      allowed: true, 
      remaining: maxRequests - 1, 
      resetAt: data.resetAt,
      message: `Rate limit active. ${maxRequests - 1} requests remaining.`
    };
  }
  
  // Incrementar contador
  data.count += 1;
  
  const allowed = data.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - data.count);
  
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  if (!allowed) {
    console.warn(`⚠️ Rate limit exceeded for ${identifier}`);
  }
  
  return {
    allowed,
    remaining,
    resetAt: data.resetAt,
    message: allowed 
      ? `${remaining} requests remaining`
      : `Rate limit exceeded. Reset at ${new Date(data.resetAt).toLocaleTimeString()}`
  };
}

/**
 * Limpia el rate limit para un identifier
 * @param {string} identifier
 */
export function clearRateLimit(identifier) {
  const key = RATE_LIMIT_PREFIX + identifier;
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}

/**
 * ============================================
 * PARTE 3: INPUT SANITIZATION
 * ============================================
 * 
 * Básica sanitización sin dependencias externas
 * Para sanitización completa, usar DOMPurify en Fase 4.2
 */

/**
 * Escapa caracteres HTML peligrosos
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
export function escapeHTML(text) {
  if (!text) return "";
  
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Valida y sanitiza una URL
 * @param {string} url - URL a validar
 * @param {boolean} allowExternal - Permitir URLs externas
 * @returns {string|null} - URL válida o null
 */
export function sanitizeUrl(url, allowExternal = false) {
  if (!url) return null;
  
  try {
    const parsed = new URL(url, window.location.href);
    
    // Permitir solo http/https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      console.warn("⚠️ Invalid URL protocol:", parsed.protocol);
      return null;
    }
    
    // Si no se permiten externas, solo same-origin
    if (!allowExternal) {
      if (parsed.origin !== window.location.origin) {
        console.warn("⚠️ External URL not allowed:", parsed.origin);
        return null;
      }
    }
    
    return parsed.toString();
  } catch (error) {
    console.warn("⚠️ Invalid URL:", url);
    return null;
  }
}

/**
 * Valida email con regex básico
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida teléfono (formato básico)
 * @param {string} phone - Teléfono a validar
 * @returns {boolean}
 */
export function validatePhone(phone) {
  // Permite: +57 123 4567890, (123) 456-7890, 123-456-7890
  const regex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return regex.test(phone.replace(/\s/g, ''));
}

/**
 * Limita longitud de string
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Remueve caracteres especiales peligrosos
 * @param {string} text
 * @returns {string}
 */
export function removeDangerousChars(text) {
  if (!text) return "";
  return text.replace(/[<>\"'`]/g, '');
}

/**
 * ============================================
 * PARTE 4: SECURITY HEADERS HELPER
 * ============================================
 * 
 * Para usar en middleware o next.config.mjs
 */

export const SECURITY_HEADERS = {
  // Prevent clickjacking
  "X-Frame-Options": "SAMEORIGIN",
  
  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",
  
  // Enable XSS Protection
  "X-XSS-Protection": "1; mode=block",
  
  // Referrer Policy
  "Referrer-Policy": "strict-origin-when-cross-origin",
  
  // Permissions Policy
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  
  // Content Security Policy (básico)
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https: data:",
    "font-src 'self' https:",
    "connect-src 'self' https://docs.google.com https://script.google.com",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join("; ")
};

/**
 * ============================================
 * PARTE 5: LOGGING DE SEGURIDAD
 * ============================================
 */

/**
 * Log de evento de seguridad
 * @param {string} type - 'csrf_failed' | 'rate_limit' | 'invalid_input' | etc
 * @param {Object} data - Datos contextuales
 */
export function logSecurityEvent(type, data = {}) {
  const event = {
    timestamp: new Date().toISOString(),
    type,
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
    url: typeof window !== "undefined" ? window.location.href : "",
    ...data
  };
  
  console.warn(`🔒 Security Event: ${type}`, event);
  
  // En producción, enviar a servicio de logging (Sentry, etc)
  // sendToLoggingService(event);
}

export default {
  // CSRF
  generateCSRFToken,
  getCSRFToken,
  validateCSRFToken,
  useCSRFToken,
  
  // Rate Limiting
  checkRateLimit,
  clearRateLimit,
  
  // Sanitization
  escapeHTML,
  sanitizeUrl,
  validateEmail,
  validatePhone,
  truncate,
  removeDangerousChars,
  
  // Headers
  SECURITY_HEADERS,
  
  // Logging
  logSecurityEvent
};

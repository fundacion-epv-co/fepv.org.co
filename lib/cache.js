/**
 * FASE 3: SISTEMA DE CACHING CON VERSIONADO
 * 
 * Cachea datos en localStorage con validación de versión
 * Invalida cache automáticamente si cambia la estructura
 * Soporta TTL (time to live) configurable
 */

const CACHE_PREFIX = "fepv_cache_";
const CACHE_VERSION = "1.0.0";
const DEFAULT_TTL = 3600000; // 1 hora en ms

/**
 * Genera una key única para el cache
 * @param {string} key - Identificador del dato
 * @returns {string} - Key con prefijo y versión
 */
export function getCacheKey(key) {
  return `${CACHE_PREFIX}${key}`;
}

/**
 * Obtiene un dato del cache si es válido
 * @param {string} key - Identificador del dato
 * @returns {any} - Datos cacheados o null si expiró/no existe
 */
export function getFromCache(key) {
  try {
    if (typeof window === "undefined") return null; // SSR safe
    
    const cacheKey = getCacheKey(key);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    
    // Validar versión
    if (parsed.version !== CACHE_VERSION) {
      console.warn(`⚠️ Cache version mismatch para ${key}, invalidando`);
      clearFromCache(key);
      return null;
    }
    
    // Validar TTL
    const now = Date.now();
    if (now > parsed.expiresAt) {
      console.log(`⏰ Cache expirado para ${key}`);
      clearFromCache(key);
      return null;
    }
    
    console.log(`✅ Cache hit para ${key}`);
    return parsed.data;
  } catch (error) {
    console.error(`❌ Error leyendo cache ${key}:`, error);
    return null;
  }
}

/**
 * Guarda un dato en el cache
 * @param {string} key - Identificador del dato
 * @param {any} data - Datos a cachear
 * @param {number} ttl - Tiempo de vida en ms (default 1 hora)
 */
export function setInCache(key, data, ttl = DEFAULT_TTL) {
  try {
    if (typeof window === "undefined") return; // SSR safe
    
    const cacheKey = getCacheKey(key);
    const now = Date.now();
    
    const cacheObject = {
      version: CACHE_VERSION,
      data,
      createdAt: now,
      expiresAt: now + ttl,
      ttl
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheObject));
    console.log(`💾 Cache guardado para ${key} (TTL: ${ttl}ms)`);
  } catch (error) {
    console.error(`❌ Error guardando cache ${key}:`, error);
  }
}

/**
 * Limpia un dato del cache
 * @param {string} key - Identificador del dato
 */
export function clearFromCache(key) {
  try {
    if (typeof window === "undefined") return;
    
    const cacheKey = getCacheKey(key);
    localStorage.removeItem(cacheKey);
    console.log(`🗑️ Cache limpiado para ${key}`);
  } catch (error) {
    console.error(`❌ Error limpiando cache ${key}:`, error);
  }
}

/**
 * Limpia TODO el cache de FEPV
 */
export function clearAllCache() {
  try {
    if (typeof window === "undefined") return;
    
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log(`🗑️ Cache completamente limpiado (${keys.length} items)`);
  } catch (error) {
    console.error("❌ Error limpiando cache:", error);
  }
}

/**
 * Obtiene o crea un cache
 * @param {string} key - Identificador del dato
 * @param {Function} fetcher - Función async que obtiene los datos
 * @param {number} ttl - Tiempo de vida en ms
 * @returns {Promise<any>} - Datos del cache o nuevos datos
 */
export async function getOrFetchCache(key, fetcher, ttl = DEFAULT_TTL) {
  // Intentar obtener del cache primero
  const cached = getFromCache(key);
  if (cached !== null) {
    return cached;
  }
  
  // Si no está en cache, fetchar datos nuevos
  console.log(`🔄 Fetching datos para ${key}...`);
  const data = await fetcher();
  
  // Guardar en cache
  setInCache(key, data, ttl);
  
  return data;
}

/**
 * Obtiene información del cache (para debugging)
 * @returns {Object} - Info sobre todos los caches
 */
export function getCacheInfo() {
  try {
    if (typeof window === "undefined") return {};
    
    const info = {};
    const now = Date.now();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const cached = JSON.parse(localStorage.getItem(key));
        const timeLeft = Math.max(0, cached.expiresAt - now);
        
        info[key] = {
          version: cached.version,
          expiresIn: `${Math.round(timeLeft / 1000)}s`,
          size: `${Math.round(JSON.stringify(cached.data).length / 1024)}KB`,
          createdAt: new Date(cached.createdAt).toISOString()
        };
      }
    }
    
    return info;
  } catch (error) {
    console.error("❌ Error obteniendo cache info:", error);
    return {};
  }
}

/**
 * Invalida cache por versión (llama cuando hay cambios estruturales)
 * Incrementar CACHE_VERSION en este archivo para invalidar todo
 */
export function invalidateCacheByVersion() {
  console.log("⚠️ Invalidando todo el cache por cambio de versión");
  clearAllCache();
}

/**
 * Hook para usar en componentes React
 * Retorna: { data, isLoading, error, refetch }
 */
export function useCachedData(key, fetcher, ttl = DEFAULT_TTL) {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getOrFetchCache(key, fetcher, ttl);
      setData(result);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  React.useEffect(() => {
    refetch();
  }, [key]);
  
  return { data, isLoading, error, refetch };
}

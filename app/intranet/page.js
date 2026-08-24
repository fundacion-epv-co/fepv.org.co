"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchGoogleSheetData, GOOGLE_SHEETS_INTRANET_CSV, GOOGLE_SHEETS_CONFIG_CSV, postToIntranetAPI, GOOGLE_APPS_SCRIPT_INTRANET_URL } from "../../lib/api";

// Helper para hashear la contraseña en el cliente y no enviarla en texto plano
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function Intranet() {
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null); // { email, rol }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Tabs State
  const [activeTab, setActiveTab] = useState("formatos"); // 'formatos', 'usuarios', 'subir', 'perfil'

  // Data State
  const [documentos, setDocumentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Forms State
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRol, setNewUserRol] = useState("empleado");
  const [newUserNombre, setNewUserNombre] = useState("");
  const [newUserCargo, setNewUserCargo] = useState("");
  const [newUserDireccion, setNewUserDireccion] = useState("");
  const [newUserTelefono, setNewUserTelefono] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState("Plantilla");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal de Solicitud de Cambio State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocForEdit, setSelectedDocForEdit] = useState(null);
  const [solicitudForm, setSolicitudForm] = useState({ nombre: "", modificacion: "", mensaje: "" });
  const [isSubmittingSolicitud, setIsSubmittingSolicitud] = useState(false);

  // Perfil State
  const [oldPassword, setOldPassword] = useState("");
  const [newPasswordProfile, setNewPasswordProfile] = useState("");

  // Edit User State (Admin)
  const [editingUserEmail, setEditingUserEmail] = useState("");
  const [editUserPassword, setEditUserPassword] = useState("");
  const [editUserRol, setEditUserRol] = useState("");

  // Consecutivos State
  const [consNombre, setConsNombre] = useState("");
  const [consTipo, setConsTipo] = useState("Carta");
  const [consResponsable, setConsResponsable] = useState("");
  const [consEmail, setConsEmail] = useState("");
  const [consConservacion, setConsConservacion] = useState("Digital");
  const [consObservaciones, setConsObservaciones] = useState("");
  const [generatedConsecutivo, setGeneratedConsecutivo] = useState("");

  // Reloj y Sesión State
  const [currentTime, setCurrentTime] = useState("");
  const SESSION_TIMEOUT = 30 * 60; // 30 minutos
  const [timeLeft, setTimeLeft] = useState(SESSION_TIMEOUT);

  // Estados para Modal de Confirmación de Salida
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState(null);

  // Estado para registrar el último correo de envío de consecutivo
  const [lastSentEmail, setLastSentEmail] = useState("");

  const isPending = GOOGLE_APPS_SCRIPT_INTRANET_URL === "PENDIENTE_DE_URL_SCRIPT_INTRANET";

  const getDisplayName = (email) => {
    if (!email) return "Usuario";
    const localPart = email.split("@")[0];
    return localPart
      .split(/[\._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatTimeLeft = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Efecto para mantener sesión
  useEffect(() => {
    const savedSession = sessionStorage.getItem("fepv_session");
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setSession(parsed);
      setConsEmail(parsed.email || "");
      loadDocumentos();
    }
  }, []);

  // Reloj en tiempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const fechaStr = now.toLocaleDateString('es-ES', opcionesFecha);
      const horaStr = now.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
      const fechaCapitalizada = fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1);
      setCurrentTime(`${fechaCapitalizada} — ${horaStr}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Temporizador de sesión activa e inactividad
  useEffect(() => {
    if (!session) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleLogout();
          alert("Tu sesión ha expirado por inactividad. Por favor, ingresa de nuevo.");
          return SESSION_TIMEOUT;
        }
        return prev - 1;
      });
    }, 1000);

    const resetTimer = () => setTimeLeft(SESSION_TIMEOUT);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    return () => {
      clearInterval(timer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [session]);

  // Alerta al intentar salir de la Intranet con sesión activa
  useEffect(() => {
    if (!session) return;

    const handleAnchorClick = (e) => {
      let target = e.target;
      while (target && target.tagName !== "A") {
        target = target.parentNode;
      }

      if (target && target.href) {
        try {
          const url = new URL(target.href);
          // Si intenta navegar fuera de la intranet en la misma web
          if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
            
            // Excepciones: si va al visualizador o se abre en nueva pestaña, dejarlo pasar
            if (target.target === "_blank" || url.pathname.includes('/visualizar')) {
              return;
            }

            e.preventDefault();
            e.stopPropagation();
            setPendingNavigationUrl(target.href);
            setShowLeaveModal(true);
          }
        } catch (err) {
          // Ignorar errores de URL
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, [session]);

  const loadDocumentos = async () => {
    try {
      const data = await fetchGoogleSheetData(GOOGLE_SHEETS_INTRANET_CSV);
      // Mapear los headers originales del CSV (Título, Tipo, Enlace Drive) a las claves que usa el código
      const mappedData = data.map(item => ({
        id: item["ID"] || "",
        titulo: item["Título"] || item["titulo"] || "",
        tipo: item["Tipo"] || item["tipo"] || "",
        enlace_drive: item["Enlace Drive"] || item["enlace_drive"] || "",
        clave_acceso: item["ID"] || "",
        codigo: item["Nombre de Archivo"] || item["Nombre de archivo"] || item["Código"] || item["codigo"] || "",
        version: item["Versión"] || item["version"] || "",
        dependencia: item["Dependencia responsable"] || item["Dependencia"] || item["dependencia"] || "",
        etiqueta: item["Etiqueta"] || item["etiqueta"] || ""
      }));
      
      const docsValidos = mappedData.filter(item => item.titulo && item.titulo.trim() !== "");
      setDocumentos(docsValidos);
    } catch (e) {
      console.error("Error cargando documentos", e);
    }
  };

  const loadUsuarios = async () => {
    if (!session || session.rol !== "admin" || isPending) return;
    setIsLoading(true);
    try {
      const res = await postToIntranetAPI("getUsers", { token: session.token });
      if (res.success) {
        setUsuarios(res.users);
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError("Error conectando con el servidor");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (session && activeTab === "usuarios" && session.rol === "admin") {
      loadUsuarios();
    }
  }, [activeTab, session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isPending) {
      // Modo desarrollo / sin conectar
      if (email === "admin@fepv.org" && password === "admin123") {
        const mockSession = { email, rol: "admin" };
        setSession(mockSession);
        setConsEmail(email);
        sessionStorage.setItem("fepv_session", JSON.stringify(mockSession));
        loadDocumentos();
      } else {
        setError("Modo prueba: Usa admin@fepv.org y admin123");
      }
      setIsLoading(false);
      return;
    }

    try {
      const hashedPassword = await hashPassword(password);
      
      // TRAMPA DE DEBUG: Vamos a imprimir en la consola (F12) exactamente qué está pasando
      console.log("=== INICIO DE LOGIN ===");
      console.log("1. Correo digitado:", email);
      console.log("2. Contraseña original (oculta):", password.replace(/./g, '*'));
      console.log("3. Hash generado por la web:", hashedPassword);
      
      const res = await postToIntranetAPI("login", { email, password: hashedPassword });
      
      console.log("4. Respuesta del servidor de Google:", res);
      console.log("=== FIN DE LOGIN ===");

      if (res.success) {
        const newSession = { email, rol: res.rol ? res.rol.trim().toLowerCase() : "empleado", token: res.token, nombre: res.nombre, cargo: res.cargo, direccion: res.direccion, telefono: res.telefono };
        setSession(newSession);
        setConsEmail(email);
        sessionStorage.setItem("fepv_session", JSON.stringify(newSession));
        loadDocumentos();
      } else {
        // Mostramos el mensaje en pantalla pero con una marca para saber que viene de GAS
        setError("Error desde el servidor: " + res.message);
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor de la Intranet (Error CORS o de red). Revisa Google Apps Script.");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setSession(null);
    sessionStorage.removeItem("fepv_session");
    setEmail("");
    setPassword("");
    setDocumentos([]);
    setUsuarios([]);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (isPending) return setError("Conecta Google Apps Script primero");
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await postToIntranetAPI("addUser", {
        token: session.token,
        newEmail: newUserEmail,
        newPassword: newUserPassword,
        newRol: newUserRol,
        newNombre: newUserNombre,
        newCargo: newUserCargo,
        newDireccion: newUserDireccion,
        newTelefono: newUserTelefono
      });
      if (res.success) {
        setSuccessMsg("Usuario agregado con éxito");
        setNewUserEmail("");
        setNewUserPassword("");
        loadUsuarios();
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError("Error de conexión");
    }
    setIsLoading(false);
  };

  const handleRemoveUser = async (userEmailToRemove) => {
    if (isPending) return;
    if (!confirm(`¿Seguro que deseas eliminar a ${userEmailToRemove}?`)) return;
    setIsLoading(true);
    setError("");
    
    try {
      const res = await postToIntranetAPI("removeUser", {
        token: session.token,
        userEmail: userEmailToRemove
      });
      if (res.success) {
        loadUsuarios();
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError("Error de conexión");
    }
    setIsLoading(false);
  };

  const handleUpdateOwnPassword = async (e) => {
    e.preventDefault();
    if (isPending) return setError("Conecta Google Apps Script primero");
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const hashedOld = await hashPassword(oldPassword);
      const hashedNew = await hashPassword(newPasswordProfile);
      
      const res = await postToIntranetAPI("updateOwnPassword", {
        token: session.token,
        oldPassword: hashedOld,
        newPassword: hashedNew
      });

      if (res.success) {
        setSuccessMsg("¡Tu contraseña ha sido actualizada con éxito!");
        setOldPassword("");
        setNewPasswordProfile("");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Error de conexión");
    }
    setIsLoading(false);
  };

  const handleSolicitarCambio = async (e) => {
    e.preventDefault();
    if (isSubmittingSolicitud) return;
    setIsSubmittingSolicitud(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await postToIntranetAPI("solicitudCambio", {
        documento: selectedDocForEdit?.titulo || selectedDocForEdit?.codigo || "Documento desconocido",
        ...solicitudForm
      });
      if (res.success) {
        setSuccessMsg("¡Tu solicitud de cambio ha sido enviada con éxito!");
        setIsModalOpen(false);
        setSolicitudForm({ nombre: "", modificacion: "", mensaje: "" });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Error de conexión al enviar la solicitud.");
    }
    setIsSubmittingSolicitud(false);
  };

  const startEditingUser = (u) => {
    setEditingUserEmail(u.email);
    setEditUserPassword("");
    setEditUserRol(u.rol);
  };

  const cancelEditingUser = () => {
    setEditingUserEmail("");
    setEditUserPassword("");
    setEditUserRol("");
  };

  const saveEditUser = async () => {
    if (isPending) return;
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const hashedNew = editUserPassword ? await hashPassword(editUserPassword) : "";
      
      const res = await postToIntranetAPI("adminUpdateUser", {
        token: session.token,
        targetEmail: editingUserEmail,
        newPassword: hashedNew,
        newRol: editUserRol
      });

      if (res.success) {
        setSuccessMsg(`Usuario ${editingUserEmail} actualizado con éxito.`);
        cancelEditingUser();
        loadUsuarios();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Error de conexión al actualizar usuario");
    }
    setIsLoading(false);
  };

  const handleGenerateConsecutivo = async (e) => {
    e.preventDefault();
    if (isPending) return setError("Conecta Google Apps Script primero");
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    setGeneratedConsecutivo("");

    try {
      const res = await postToIntranetAPI("generateConsecutivo", {
        email: consEmail,
        nd: consNombre,
        td: consTipo,
        rd: consResponsable,
        mc: consConservacion,
        o: consObservaciones
      });

      if (res.success) {
        setGeneratedConsecutivo(res.consecutivo);
        setLastSentEmail(consEmail);
        setSuccessMsg(`¡Consecutivo generado con éxito: ${res.consecutivo}! Se envió una confirmación al correo.`);
        setConsNombre("");
        setConsResponsable("");
        setConsObservaciones("");
        setConsEmail("");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Error de conexión al generar consecutivo");
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (isPending) return setError("Conecta Google Apps Script primero");
    if (!docFile) return setError("Selecciona un archivo");
    
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    const reader = new FileReader();
    reader.onload = async () => {
      // El resultado es un Data URL: "data:application/pdf;base64,JVBERi..."
      const dataUrl = reader.result;
      const base64Data = dataUrl.split(",")[1]; // Solo la parte base64
      
      try {
        const res = await postToIntranetAPI("uploadDocument", {
          token: session.token,
          fileBase64: base64Data,
          filename: docFile.name,
          mimeType: docFile.type,
          titulo: docTitle,
          tipo: docType
        });
        
        if (res.success) {
          setSuccessMsg("Archivo subido con éxito y publicado en la Intranet");
          setDocTitle("");
          setDocFile(null);
          // Recargar tabla en 3 segundos para dar tiempo a Sheets
          setTimeout(() => loadDocumentos(), 3000);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError("Error subiendo el archivo: El archivo puede ser demasiado grande.");
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setError("Error leyendo el archivo");
      setIsLoading(false);
    };
    reader.readAsDataURL(docFile);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER DE INTRANET */}
      <div className="bg-fepv-darkblue text-white py-6 shadow-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-3xl select-none">🛡️</span>
            <div>
              <h1 className="font-display font-bold text-xl leading-tight">Intranet FEPV</h1>
              {currentTime && <p className="text-xs text-white/60 font-medium font-sans mt-0.5">{currentTime}</p>}
            </div>
          </div>

          {session && (
            <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 w-full md:w-auto">
              <div className="text-left md:text-right">
                <p className="text-sm font-bold text-fepv-vividgreen">
                  ¡Hola, {getDisplayName(session.email)}! 👋
                </p>
                <p className="text-[11px] text-white/60 font-medium mt-0.5">
                  {session.email} ({session.rol.toUpperCase()})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold font-mono text-white/95 shadow-sm"
                  title="Tu sesión se cerrará automáticamente por inactividad"
                >
                  <span className="animate-pulse">⏱️</span> {formatTimeLeft(timeLeft)}
                </div>

                <button onClick={handleLogout} className="text-xs font-bold bg-white/15 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-sm cursor-pointer">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        
        {!session ? (
          /* LOGIN */
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-gray-100 mt-10">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl text-fepv-darkblue">Iniciar Sesión</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-fepv-darkblue mb-2 uppercase tracking-wider">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green bg-gray-50 focus:bg-white text-sm"
                  placeholder="usuario@fepv.org.co"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-fepv-darkblue mb-2 uppercase tracking-wider">Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green bg-gray-50 focus:bg-white text-sm"
                  placeholder="••••••••"
                />
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs text-center border border-red-100">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="fepv-btn fepv-btn-primary w-full py-3 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Iniciando..." : "Ingresar al Panel"}
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD */
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* TABS */}
            <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
              <button
                onClick={() => setActiveTab("formatos")}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === "formatos" ? "text-fepv-green border-b-2 border-fepv-green bg-white" : "text-fepv-gray hover:text-fepv-darkblue"}`}
              >
                Formatos Institucionales
              </button>
              <button
                onClick={() => setActiveTab("perfil")}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === "perfil" ? "text-fepv-green border-b-2 border-fepv-green bg-white" : "text-fepv-gray hover:text-fepv-darkblue"}`}
              >
                Mi Perfil
              </button>
              <button
                onClick={() => setActiveTab("consecutivos")}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === "consecutivos" ? "text-fepv-green border-b-2 border-fepv-green bg-white" : "text-fepv-gray hover:text-fepv-darkblue"}`}
              >
                Generar Consecutivo
              </button>
              {session.rol === "admin" && (
                <>
                  <button
                    onClick={() => setActiveTab("usuarios")}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === "usuarios" ? "text-fepv-green border-b-2 border-fepv-green bg-white" : "text-fepv-gray hover:text-fepv-darkblue"}`}
                  >
                    Gestión de Usuarios
                  </button>
                  <button
                    onClick={() => setActiveTab("subir")}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === "subir" ? "text-fepv-green border-b-2 border-fepv-green bg-white" : "text-fepv-gray hover:text-fepv-darkblue"}`}
                  >
                    Subir Formatos Nuevos
                  </button>
                </>
              )}
            </div>

            <div className="p-6 sm:p-10">
              {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center justify-between">{error} <button onClick={()=>setError("")} className="cursor-pointer">x</button></div>}
              {successMsg && <div className="mb-6 p-4 bg-green-50 text-fepv-green rounded-xl text-sm border border-green-100 flex items-center justify-between">{successMsg} <button onClick={()=>setSuccessMsg("")} className="cursor-pointer">x</button></div>}

              {/* VISTA: FORMATOS */}
              {activeTab === "formatos" && (() => {
                const filteredDocs = documentos.filter(doc => 
                  (doc.titulo && doc.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (doc.tipo && doc.tipo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (doc.codigo && doc.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
                );

                return (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <h2 className="font-display font-bold text-2xl text-fepv-darkblue">Documentos Disponibles</h2>
                      <div className="relative w-full sm:w-72">
                        <input
                          type="text"
                          placeholder="Buscar por nombre, código o tipo..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-fepv-green focus:border-transparent outline-none"
                        />
                        <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </div>
                    </div>
                    
                    {isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-gray-50 h-[120px] animate-pulse flex justify-between items-start">
                            <div className="space-y-3 w-3/4 mt-1">
                              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                              <div className="h-4 bg-gray-200 rounded w-full"></div>
                              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                              <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredDocs.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-4xl block mb-2">📂</span>
                        <p className="text-fepv-gray/70">No se encontraron documentos.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredDocs.map((doc, idx) => (
                          <div key={idx} className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-fepv-green/30 hover:shadow-sm transition-all flex items-start justify-between group">
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-fepv-green bg-fepv-light/30 px-2 py-0.5 rounded">
                                {doc.tipo || "Documento"}
                              </span>
                              <h3 className="font-bold text-sm text-fepv-darkblue leading-tight">{doc.titulo}</h3>
                              
                              {/* Metadatos extra si existen */}
                              {(doc.codigo || doc.version || doc.dependencia) && (
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-fepv-gray/70 mt-2">
                                  {doc.codigo && <span><b className="text-fepv-darkblue/70">Cód:</b> {doc.codigo}</span>}
                                  {doc.version && <span><b className="text-fepv-darkblue/70">Ver:</b> {doc.version}</span>}
                                  {doc.dependencia && <span><b className="text-fepv-darkblue/70">Dep:</b> {doc.dependencia}</span>}
                                  {doc.etiqueta && doc.etiqueta.toLowerCase().includes("protegido") && (
                                    <span className="text-red-500 font-bold flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                      Protegido
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-4 flex-shrink-0 mt-1 flex gap-2 sm:flex-col">
                              {doc.enlace_drive ? (
                                <Link
                                  href={doc.etiqueta && doc.etiqueta.toLowerCase().includes("protegido") ? `/visualizar?url=${encodeURIComponent(doc.enlace_drive)}&title=${encodeURIComponent(doc.titulo)}&protected=true` : `/visualizar?url=${encodeURIComponent(doc.enlace_drive)}&title=${encodeURIComponent(doc.titulo)}`}
                                  target="_blank"
                                  className="text-fepv-gray hover:text-fepv-darkblue bg-white border border-gray-200 hover:border-fepv-darkblue p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                                  title={doc.etiqueta && doc.etiqueta.toLowerCase().includes("protegido") ? "Ver Documento Protegido" : "Ver Documento"}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </Link>
                              ) : (
                                <span className="text-xs text-gray-400 border border-gray-200 p-2 rounded-lg flex items-center justify-center">N/A</span>
                              )}
                              
                              <button
                                onClick={() => {
                                  setSelectedDocForEdit(doc);
                                  setIsModalOpen(true);
                                }}
                                className="text-amber-500 hover:text-white bg-white hover:bg-amber-500 border border-amber-200 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                                title="Solicitar cambio o arreglo"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* VISTA: USUARIOS */}
              {activeTab === "usuarios" && session.rol === "admin" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="font-display font-bold text-2xl text-fepv-darkblue mb-6">Lista de Usuarios</h2>
                    {isLoading ? <p className="text-sm text-fepv-gray/70">Cargando usuarios...</p> : (
                      <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="bg-gray-100 text-fepv-darkblue">
                              <th className="p-4 font-bold border-b border-gray-200">Email</th>
                              <th className="p-4 font-bold border-b border-gray-200">Rol</th>
                              <th className="p-4 font-bold border-b border-gray-200 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usuarios.map((u, i) => (
                              <tr key={i} className={`border-b border-gray-100 last:border-0 ${editingUserEmail === u.email ? 'bg-fepv-green/5' : 'hover:bg-gray-50'}`}>
                                <td className="p-4">{u.email}</td>
                                <td className="p-4">
                                  {editingUserEmail === u.email ? (
                                    <select
                                      value={editUserRol}
                                      onChange={(e) => setEditUserRol(e.target.value)}
                                      className="p-1 border border-gray-300 rounded text-xs bg-white"
                                    >
                                      <option value="empleado">Empleado</option>
                                      <option value="admin">Administrador</option>
                                    </select>
                                  ) : (
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.rol === 'admin' ? 'bg-fepv-darkblue text-white' : 'bg-fepv-light/30 text-fepv-green'}`}>
                                      {u.rol}
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 text-right">
                                  {editingUserEmail === u.email ? (
                                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                                      <input 
                                        type="password" 
                                        placeholder="Nueva Clave (opcional)" 
                                        value={editUserPassword}
                                        onChange={(e) => setEditUserPassword(e.target.value)}
                                        className="p-1 border border-gray-300 rounded text-xs w-32 bg-white"
                                      />
                                      <div className="flex gap-2">
                                        <button onClick={saveEditUser} className="text-green-600 hover:text-green-800 text-xs font-bold cursor-pointer">Guardar</button>
                                        <button onClick={cancelEditingUser} className="text-gray-500 hover:text-gray-700 text-xs font-bold cursor-pointer">Cancelar</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-end gap-3">
                                      <button onClick={() => startEditingUser(u)} className="text-blue-500 hover:text-blue-700 text-xs font-bold underline cursor-pointer">
                                        Editar
                                      </button>
                                      {u.email !== session.email && (
                                        <button onClick={() => handleRemoveUser(u.email)} className="text-red-500 hover:text-red-700 text-xs font-bold underline cursor-pointer">
                                          Eliminar
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-lg text-fepv-darkblue mb-4">Añadir Nuevo Usuario</h3>
                    <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Email</label>
                        <input type="email" required value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Contraseña</label>
                        <input type="password" required value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Rol</label>
                        <select value={newUserRol} onChange={(e) => setNewUserRol(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                          <option value="empleado">Empleado</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </div>
                      <div className="sm:col-span-1">
                        <button type="submit" disabled={isLoading} className="fepv-btn fepv-btn-primary w-full py-2 text-sm cursor-pointer disabled:opacity-50">
                          Crear
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* VISTA: MI PERFIL */}
              {activeTab === "perfil" && (
                <div className="max-w-md">
                  <h2 className="font-display font-bold text-2xl text-fepv-darkblue mb-2">Mi Perfil</h2>
                  <p className="text-sm text-fepv-gray/70 mb-8">Actualiza tu contraseña de acceso a la Intranet.</p>

                  <form onSubmit={handleUpdateOwnPassword} className="space-y-6 bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
                    <div>
                      <label className="block text-xs font-bold text-fepv-darkblue mb-2">Contraseña Actual</label>
                      <input 
                        type="password" 
                        required 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                        className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white" 
                        placeholder="••••••••" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-fepv-darkblue mb-2">Nueva Contraseña</label>
                      <input 
                        type="password" 
                        required 
                        value={newPasswordProfile} 
                        onChange={(e) => setNewPasswordProfile(e.target.value)} 
                        className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white" 
                        placeholder="Mínimo 6 caracteres" 
                      />
                    </div>

                    <button type="submit" disabled={isLoading} className="fepv-btn fepv-btn-primary w-full py-3 cursor-pointer disabled:opacity-50">
                      {isLoading ? "Actualizando..." : "Cambiar Contraseña"}
                    </button>
                  </form>
                </div>
              )}

              {/* VISTA: GENERADOR DE CONSECUTIVOS */}
              {activeTab === "consecutivos" && (
                <div className="max-w-2xl">
                  <h2 className="font-display font-bold text-2xl text-fepv-darkblue mb-2">Generar Número de Consecutivo</h2>
                  <p className="text-sm text-fepv-gray/70 mb-8">
                    Crea un consecutivo oficial con nomenclatura para tus oficios. Al enviarlo se guardará en la base de datos y se notificará a tu correo electrónico.
                  </p>

                  {/* Alerta de Éxito de Consecutivo */}
                  {generatedConsecutivo && (
                    <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center space-y-4 animate-in zoom-in duration-300">
                      <span className="text-4xl block">🎉</span>
                      <h3 className="font-display font-bold text-lg text-fepv-darkblue">¡Consecutivo Generado Exitosamente!</h3>
                      <div className="bg-white px-6 py-4 rounded-xl border border-green-100 inline-block font-mono text-xl font-bold tracking-wider text-green-700 select-all shadow-sm">
                        {generatedConsecutivo}
                      </div>
                      <p className="text-xs text-fepv-gray/80 max-w-md mx-auto">
                        Copia este código y úsalo en tu documento. Se ha enviado una copia detallada del registro a tu correo: <strong>{lastSentEmail || session.email}</strong>.
                      </p>
                      <button 
                        onClick={() => setGeneratedConsecutivo("")} 
                        className="text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Generar Otro
                      </button>
                    </div>
                  )}

                  {!generatedConsecutivo && (
                    <form onSubmit={handleGenerateConsecutivo} className="space-y-6 bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-fepv-darkblue mb-2">Nombre del Documento / Asunto</label>
                          <input 
                            type="text" 
                            required 
                            value={consNombre} 
                            onChange={(e) => setConsNombre(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white" 
                            placeholder="Ej. Solicitud de Viáticos Agustín Codazzi" 
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-fepv-darkblue mb-2">Tipo de Documento</label>
                          <select 
                            value={consTipo} 
                            onChange={(e) => setConsTipo(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white cursor-pointer"
                          >
                            <option value="Carta">Carta</option>
                            <option value="Acta">Acta</option>
                            <option value="Convenio">Convenio</option>
                            <option value="Informe">Informe</option>
                            <option value="Circular">Circular</option>
                            <option value="Memorando">Memorando</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-fepv-darkblue mb-2">Responsable / Remitente</label>
                          <input 
                            type="text" 
                            required 
                            value={consResponsable} 
                            onChange={(e) => setConsResponsable(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white" 
                            placeholder="Tu nombre y cargo" 
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-fepv-darkblue mb-2">Correo del Solicitante (para envío)</label>
                          <input 
                            type="email" 
                            required 
                            value={consEmail} 
                            onChange={(e) => setConsEmail(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white" 
                            placeholder="correo@encuentrosparalavida.org" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-fepv-darkblue mb-2">Modo de Conservación</label>
                          <select 
                            value={consConservacion} 
                            onChange={(e) => setConsConservacion(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white cursor-pointer"
                          >
                            <option value="Digital">Digital</option>
                            <option value="Físico">Físico</option>
                            <option value="Ambos">Ambos (Digital y Físico)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-2">Observaciones (Opcional)</label>
                        <textarea 
                          value={consObservaciones} 
                          onChange={(e) => setConsObservaciones(e.target.value)} 
                          className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white h-24 focus:outline-none focus:border-fepv-green" 
                          placeholder="Agrega cualquier detalle o nota del radicado aquí..."
                        />
                      </div>

                      <button type="submit" disabled={isLoading} className="fepv-btn fepv-btn-primary w-full py-3 cursor-pointer disabled:opacity-50">
                        {isLoading ? "Generando consecutivo..." : "Generar Consecutivo Oficial"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* VISTA: SUBIR FORMATOS */}
              {activeTab === "subir" && session.rol === "admin" && (
                <div className="max-w-2xl">
                  <h2 className="font-display font-bold text-2xl text-fepv-darkblue mb-2">Cargar Documento</h2>
                  <p className="text-sm text-fepv-gray/70 mb-8">El documento se guardará automáticamente en Google Drive y aparecerá disponible en la lista de formatos para todos los empleados.</p>

                  <form onSubmit={handleFileUpload} className="space-y-6 bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
                    <div>
                      <label className="block text-xs font-bold text-fepv-darkblue mb-2">Título del Documento</label>
                      <input type="text" required value={docTitle} onChange={e=>setDocTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-sm" placeholder="Ej. Plantilla de Viáticos 2026" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-fepv-darkblue mb-2">Tipo / Categoría</label>
                      <select value={docType} onChange={e=>setDocType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white cursor-pointer">
                        <option value="Plantilla">Plantilla</option>
                        <option value="Acta">Acta</option>
                        <option value="Manual">Manual</option>
                        <option value="Instructivo">Instructivo</option>
                        <option value="Informe">Informe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-fepv-darkblue mb-2">Seleccionar Archivo (PDF, Word, Excel, ZIP)</label>
                      <input 
                        type="file" 
                        required 
                        onChange={(e) => setDocFile(e.target.files[0])}
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-fepv-light/30 file:text-fepv-darkblue hover:file:bg-fepv-light/50 cursor-pointer file:cursor-pointer" 
                      />
                      <p className="text-[10px] text-fepv-gray/50 mt-1">Límite recomendado: 10MB.</p>
                    </div>

                    <button type="submit" disabled={isLoading} className="fepv-btn fepv-btn-primary w-full py-3 cursor-pointer disabled:opacity-50">
                      {isLoading ? "Subiendo a Drive y registrando..." : "Subir Archivo"}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* MODAL PERSONALIZADO DE CONFIRMACIÓN DE SALIDA */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-fepv-darkblue/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 transform scale-100 transition-all duration-300 animate-in zoom-in-95">
            <div className="text-center">
              {/* Escudo de seguridad vectorial */}
              <div className="mx-auto w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-5 text-amber-600">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>

              <h3 className="font-display font-extrabold text-base sm:text-lg text-fepv-darkblue mb-1 tracking-tight">
                FUNDACIÓN ENCUENTROS PARA LA VIDA
              </h3>
              <p className="text-[10px] font-bold text-fepv-green uppercase tracking-widest mb-6">
                Control de Seguridad de Sesión
              </p>
              
              {/* Caja de alerta estilo corporativa */}
              <div className="bg-amber-50/60 border-l-4 border-amber-500 p-4 rounded-r-2xl mb-6 text-left shadow-sm">
                <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                  Detectamos una sesión activa en la Intranet. Por políticas de seguridad institucional, navegar fuera de este portal <strong className="text-amber-900 font-bold">cerrará tu sesión</strong> de forma automática.
                </p>
                <p className="text-xs text-amber-800 font-semibold mt-3">
                  Deseas cerrar la sesión y continuar con la navegación?
                </p>
              </div>

              {/* Botones de acción alineados y proporcionales */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => {
                    setPendingNavigationUrl(null);
                    setShowLeaveModal(false);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 cursor-pointer text-center"
                >
                  Permanecer en Intranet
                </button>
                <button
                  onClick={() => {
                    setShowLeaveModal(false);
                    handleLogout();
                    if (pendingNavigationUrl) {
                      window.location.href = pendingNavigationUrl;
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-center"
                >
                  Cerrar Sesión y Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Solicitud de Cambio */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-fepv-darkblue/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="bg-amber-500 p-4 flex justify-between items-center">
              <h3 className="font-display font-bold text-white text-lg">Solicitar Modificación</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-amber-100 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-fepv-gray/70 mb-4">
                Estás solicitando cambios para el documento: <strong className="text-fepv-darkblue block mt-1">{selectedDocForEdit?.titulo}</strong>
              </p>
              
              <form onSubmit={handleSolicitarCambio} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Tu Nombre o Usuario</label>
                  <input type="text" required value={solicitudForm.nombre} onChange={e=>setSolicitudForm({...solicitudForm, nombre: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Modificación Propuesta</label>
                  <input type="text" required value={solicitudForm.modificacion} onChange={e=>setSolicitudForm({...solicitudForm, modificacion: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Ej. Actualizar logo" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Mensaje / Detalle</label>
                  <textarea required value={solicitudForm.mensaje} onChange={e=>setSolicitudForm({...solicitudForm, mensaje: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm h-24" placeholder="Explica detalladamente qué cambiar..."></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-fepv-gray hover:text-fepv-darkblue">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSubmittingSolicitud} className="px-4 py-2 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-lg disabled:opacity-50">
                    {isSubmittingSolicitud ? "Enviando..." : "Enviar Solicitud"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

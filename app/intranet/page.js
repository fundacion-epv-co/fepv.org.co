"use client";

import { useState, useEffect } from "react";
import { fetchGoogleSheetData, GOOGLE_SHEETS_INTRANET_CSV, postToIntranetAPI, GOOGLE_APPS_SCRIPT_INTRANET_URL } from "../../lib/api";

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
  const [docFile, setDocFile] = useState(null);
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState("Plantilla");

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
            const confirmLeave = window.confirm(
              "Tienes una sesión activa en la Intranet. Navegar a otra página cerrará tu sesión por seguridad.\n\n¿Deseas cerrar sesión y continuar?"
            );
            if (!confirmLeave) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              handleLogout();
            }
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
      // La pestaña Formatos_Internos tiene: clave_acceso, titulo, tipo, enlace_drive
      const docsValidos = data.filter(item => item.titulo && item.titulo.trim() !== "");
      setDocumentos(docsValidos);
    } catch (e) {
      console.error("Error cargando documentos", e);
    }
  };

  const loadUsuarios = async () => {
    if (!session || session.rol !== "admin" || isPending) return;
    setIsLoading(true);
    try {
      const res = await postToIntranetAPI("getUsers", { adminEmail: session.email });
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
      const res = await postToIntranetAPI("login", { email, password: hashedPassword });
      if (res.success) {
        const newSession = { email, rol: res.rol };
        setSession(newSession);
        setConsEmail(email);
        sessionStorage.setItem("fepv_session", JSON.stringify(newSession));
        loadDocumentos();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
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
      const hashedPassword = await hashPassword(newUserPassword);
      const res = await postToIntranetAPI("addUser", {
        adminEmail: session.email,
        newEmail: newUserEmail,
        newPassword: hashedPassword,
        newRol: newUserRol
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
        adminEmail: session.email,
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
        email: session.email,
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
        adminEmail: session.email,
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
        setSuccessMsg(`¡Consecutivo generado con éxito: ${res.consecutivo}! Se envió una confirmación al correo.`);
        setConsNombre("");
        setConsResponsable("");
        setConsObservaciones("");
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
          adminEmail: session.email,
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
              {activeTab === "formatos" && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-2xl text-fepv-darkblue mb-6">Documentos Disponibles</h2>
                  
                  {documentos.length === 0 ? (
                    <div className="text-center py-10">
                      <span className="text-4xl block mb-2">📂</span>
                      <p className="text-fepv-gray/70">No hay documentos publicados actualmente.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documentos.map((doc, idx) => (
                        <div key={idx} className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-fepv-green/30 transition-all flex items-center justify-between group">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-fepv-green bg-fepv-light/30 px-2 py-0.5 rounded">
                              {doc.tipo || "Documento"}
                            </span>
                            <h3 className="font-bold text-sm text-fepv-darkblue mt-1.5">{doc.titulo}</h3>
                          </div>
                          {doc.enlace_drive ? (
                            <a
                              href={doc.enlace_drive}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-fepv-gray hover:text-fepv-darkblue bg-white border border-gray-200 hover:border-fepv-darkblue p-2 rounded-lg transition-colors cursor-pointer"
                              title="Descargar o Ver"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">Sin link</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
                        Copia este código y úsalo en tu documento. Se ha enviado una copia detallada del registro a tu correo: <strong>{session.email}</strong>.
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
    </div>
  );
}

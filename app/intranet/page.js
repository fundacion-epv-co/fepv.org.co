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
  const [activeTab, setActiveTab] = useState("formatos"); // 'formatos', 'usuarios', 'subir'

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

  const isPending = GOOGLE_APPS_SCRIPT_INTRANET_URL === "PENDIENTE_DE_URL_SCRIPT_INTRANET";

  // Efecto para mantener sesión
  useEffect(() => {
    const savedSession = sessionStorage.getItem("fepv_session");
    if (savedSession) {
      setSession(JSON.parse(savedSession));
      loadDocumentos();
    }
  }, []);

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
      <div className="bg-fepv-darkblue text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="font-display font-bold text-xl leading-tight">Intranet FEPV</h1>
              {session && <p className="text-xs text-white/60">Conectado como {session.email} ({session.rol.toUpperCase()})</p>}
            </div>
          </div>
          {session && (
            <button onClick={handleLogout} className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors cursor-pointer">
              Cerrar Sesión
            </button>
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
                              <tr key={i} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                <td className="p-4">{u.email}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.rol === 'admin' ? 'bg-fepv-darkblue text-white' : 'bg-fepv-light/30 text-fepv-green'}`}>
                                    {u.rol}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  {u.email !== session.email && (
                                    <button onClick={() => handleRemoveUser(u.email)} className="text-red-500 hover:text-red-700 text-xs font-bold underline cursor-pointer">
                                      Eliminar
                                    </button>
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
                    <h3 className="font-display font-bold text-lg text-fepv-darkblue mb-4">Agregar Nuevo Usuario</h3>
                    <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Email</label>
                        <input type="email" required value={newUserEmail} onChange={e=>setNewUserEmail(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="nuevo@fepv.org.co" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Contraseña</label>
                        <input type="text" required value={newUserPassword} onChange={e=>setNewUserPassword(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Escribe una contraseña" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Rol</label>
                        <select value={newUserRol} onChange={e=>setNewUserRol(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm cursor-pointer">
                          <option value="empleado">Empleado</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <button type="submit" disabled={isLoading} className="fepv-btn fepv-btn-secondary text-sm py-2 px-6 cursor-pointer disabled:opacity-50">
                          {isLoading ? "Guardando..." : "+ Crear Usuario"}
                        </button>
                      </div>
                    </form>
                  </div>
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

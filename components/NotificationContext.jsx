"use client";

import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info", duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, notifications }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg shadow-lg animate-in slide-in-from-right-5 pointer-events-auto ${
              notif.type === "error"
                ? "bg-red-500 text-white"
                : notif.type === "success"
                ? "bg-green-500 text-white"
                : notif.type === "warning"
                ? "bg-yellow-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium flex-1">{notif.message}</p>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-lg leading-none hover:opacity-75 transition"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification debe ser usado dentro de NotificationProvider");
  }
  return context;
};

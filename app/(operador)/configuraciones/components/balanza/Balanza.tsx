"use client";

import React from "react";
import { useBalanza } from "@/hooks/useBalanza";

export default function Balanza() {
  const { connected, connecting, weight, status, connectScale, disconnectScale } =
    useBalanza();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Configuración de Balanza CAS CI200A
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Conecta tu balanza para usarla en toda la aplicación
          </p>
        </div>

        {/* Status Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                Estado
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    connected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${
                    connected ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {connected ? "Conectado" : "Desconectado"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                Peso Actual
              </p>
              <p className="text-2xl font-bold text-gray-900">{weight} kg</p>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-4 p-3 bg-white rounded border border-gray-200">
            <p className="text-xs text-gray-700">{status}</p>
          </div>
        </div>

        {/* Connection Button */}
        <div className="flex gap-3">
          {!connected ? (
            <button
              onClick={connectScale}
              disabled={connecting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6-6 6 6" />
                <path d="M12 5v14" />
              </svg>
              {connecting ? "Conectando..." : "Conectar Balanza"}
            </button>
          ) : (
            <button
              onClick={disconnectScale}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 15l6 6 6-6" />
                <path d="M12 19V5" />
              </svg>
              Desconectar
            </button>
          )}
        </div>

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-900 mb-2">
            ℹ️ Información Importante
          </p>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Esta balanza se usará en toda la aplicación</li>
            <li>Asegúrate de que la balanza esté encendida antes de conectar</li>
            <li>La conexión utiliza la Web Serial API (compatible con Chrome, Edge, etc.)</li>
            <li>Se solicita permiso de acceso a puertos seriales al conectar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

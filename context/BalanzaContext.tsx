"use client";

import React, { createContext, useState, useRef, ReactNode } from "react";

export interface BalanzaContextType {
  connected: boolean;
  connecting: boolean;
  weight: string;
  status: string;
  connectScale: () => Promise<void>;
  disconnectScale: () => Promise<void>;
  getWeight: () => string;
}

export const BalanzaContext = createContext<BalanzaContextType | undefined>(
  undefined
);

interface BalanzaProviderProps {
  children: ReactNode;
}

export const BalanzaProvider: React.FC<BalanzaProviderProps> = ({
  children,
}) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [weight, setWeight] = useState("0.00");
  const [status, setStatus] = useState("Desconectado");

  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const connectScale = async () => {
    if (connecting || connected) return;

    try {
      setConnecting(true);
      setStatus("Conectando...");

      if ("serial" in navigator === false) {
        throw new Error(
          "Serial API no disponible. Usa Chrome, Edge o un navegador compatible."
        );
      }

      const port = await (navigator as any).serial.requestPort();

      await (port as SerialPort).open({
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none",
      } as SerialOpenOptions);

      portRef.current = port as SerialPort;

      setConnected(true);
      setStatus("Conectado - Solicitando peso...");

      readLoop();
      startWeightRequest();
    } catch (error) {
      console.error("Error conectando balanza:", error);
      setStatus(`Error: ${error instanceof Error ? error.message : "Desconocido"}`);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectScale = async () => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (readerRef.current) {
        readerRef.current.cancel();
        readerRef.current.releaseLock();
      }

      if (portRef.current) {
        await portRef.current.close();
      }

      portRef.current = null;
      setConnected(false);
      setStatus("Desconectado");
      setWeight("0.00");
    } catch (error) {
      console.error("Error desconectando balanza:", error);
    }
  };

  const startWeightRequest = () => {
    intervalRef.current = setInterval(async () => {
      if (!portRef.current?.writable) return;

      try {
        const writer = portRef.current.writable.getWriter();
        const encoder = new TextEncoder();
        await writer.write(encoder.encode("SI\r\n"));
        writer.releaseLock();
      } catch (error) {
        console.error("Error solicitando peso:", error);
      }
    }, 500);
  };

  const readLoop = async () => {
    while (portRef.current && (portRef.current as SerialPort).readable) {
      try {
        const readable = (portRef.current as SerialPort).readable;
        if (!readable) break;
        
        readerRef.current = readable.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await readerRef.current.read();
          if (done) break;

          const text = decoder.decode(value);

          // Extraer número del formato de respuesta de la balanza
          const match = text.match(/-?\d+(\.\d+)?/);
          if (match) {
            setWeight(match[0]);
            setStatus("Conectado - Peso actualizado");
          }
        }
      } catch (error) {
        console.error("Error leyendo balanza:", error);
        break;
      } finally {
        if (readerRef.current) {
          readerRef.current.releaseLock();
        }
      }
    }
  };

  const getWeight = (): string => {
    return weight;
  };

  const value: BalanzaContextType = {
    connected,
    connecting,
    weight,
    status,
    connectScale,
    disconnectScale,
    getWeight,
  };

  return (
    <BalanzaContext.Provider value={value}>{children}</BalanzaContext.Provider>
  );
};

// Type definitions for Web Serial API
interface SerialOpenOptions {
  baudRate: number;
  dataBits?: number;
  stopBits?: number;
  parity?: "none" | "even" | "odd";
  flowControl?: "none" | "hardware";
}

interface SerialPort {
  open(options: SerialOpenOptions): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
}

"use client";

import { useState, useEffect, useMemo } from "react";
import CardCode, { PesajeData } from "@/components/ui/CardCode";
import { InputField } from "@/components/ui/InputField";
import jsPDF from "jspdf";
import { useContainer } from "@/app/(operador)/configuraciones/hooks/contenedores/useContainer";
import { useAddRequestWeighing } from "../../hooks/repartir/useAddRequestWeighing";
import { useUpdateProductRequest } from "../../hooks/repartir/useUpdateProductRequest";
import { useUpdateRequestStage } from "../../hooks/repartir/useUpdateRequeststage";

interface Code {
  label: string;
  cajas: number;
  unidades: number;
  pesajes?: PesajeData[];
  precio?: string;
}

interface ClienteData {
  name: string;
  estado: string;
  Request_id: number;
  codes: Array<{
    label: string;
    solicitado: number;
    cajas: number;
    unidades: number;
    ProductRequest_id: number;
    Product_id: number;
    menudencia: string;
  }>;
  totalCajas: number;
  totalUnid: number;
}

interface DistributeGroupProps {
  name: string;
  clientesCount: number;
  clientes: ClienteData[];
  codes: Code[];
  totalCajas: number;
  totalUnid: number;
  costoPorKg?: string;
  onCajasChange?: (codeIndex: number, value: number) => void;
  onUnidadesChange?: (codeIndex: number, value: number) => void;
  onEmpezar?: () => void;
  isActive?: boolean;
  onStarted?: (isStarted: boolean) => void;
  encargado?: string;
}

export default function DistributeGroup({
  name,
  clientesCount,
  clientes,
  codes: initialCodes,
  totalCajas,
  totalUnid,
  costoPorKg = "0.00",
  onCajasChange,
  onUnidadesChange,
  isActive = false,
  onStarted,
  encargado = "",
}: DistributeGroupProps) {
  const { containers, containersData } = useContainer();
  const { addWeighing, loading: savingWeighing } = useAddRequestWeighing();
  const { updateProductRequest } = useUpdateProductRequest();
  const { updateRequestStage } = useUpdateRequestStage();
  const [savingClient, setSavingClient] = useState<number | null>(null);
  const [savedClients, setSavedClients] = useState<Set<number>>(new Set());
  const [saveErrors, setSaveErrors] = useState<Record<number, string>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStarted, setIsStarted] = useState(isActive);
  const [precioDiferido, setPrecioDiferido] = useState(false);
  const [precioVentaCliente, setPrecioVentaCliente] = useState<
    Record<number, string>
  >({});
  const [menudencia, setMenudencia] = useState<Record<number, boolean>>({});
  const [codes, setCodes] = useState<Code[]>(
    initialCodes.map((code) => ({
      ...code,
      pesajes: code.pesajes || [],
      precio: code.precio || "",
    })),
  );

  // Sincroniza isStarted cuando cambia isActive desde el padre
  useEffect(() => {
    setIsStarted(isActive);
  }, [isActive]);

  // Función para calcular el costo total de distribución por cliente
  // COSTO = Σ (peso_neto_producto × precio_venta)
  const calculateTotalDistribucion = useMemo(() => {
    return (clienteCodes: Code[], precioVenta: string): number => {
      let total = 0;

      if (!precioDiferido) {
        // Sin precio diferido: precioVenta × Σ net_weight de todos los pesajes
        const costo = Number(precioVenta) || 0;
        let totalNetWeight = 0;

        for (const code of clienteCodes) {
          if (code.pesajes) {
            for (const pesaje of code.pesajes) {
              const container = containersData?.find(
                (c) => c.id.toString() === pesaje.contenedor,
              );
              const destare = container?.destare || 0;
              const grossWeight = Number(pesaje.kg) || 0;
              const cantidadCajas = Number(pesaje.cajas) || 0;
              const netWeight = grossWeight - destare * cantidadCajas;
              totalNetWeight += netWeight;
            }
          }
        }

        total = costo * totalNetWeight;
      } else {
        // Con precio diferido: Σ (precio_codigo × net_weight_codigo)
        for (const code of clienteCodes) {
          if (code.pesajes) {
            const precioProducto = Number(code.precio) || 0;
            let netWeightProducto = 0;

            for (const pesaje of code.pesajes) {
              const container = containersData?.find(
                (c) => c.id.toString() === pesaje.contenedor,
              );
              const destare = container?.destare || 0;
              const grossWeight = Number(pesaje.kg) || 0;
              const cantidadCajas = Number(pesaje.cajas) || 0;
              const netWeight = grossWeight - destare * cantidadCajas;
              netWeightProducto += netWeight;
            }

            total += precioProducto * netWeightProducto;
          }
        }
      }

      return Math.round(total * 100) / 100;
    };
  }, [precioDiferido, containersData]);

  // Calcula peso bruto y neto real de un código según sus pesajes registrados
  const calcularPesos = (codeIdx: number): { bruto: string; neto: string } => {
    const pesajes = codes[codeIdx]?.pesajes ?? [];
    if (pesajes.length === 0) return { bruto: "0.00", neto: "0.00" };

    let totalBruto = 0;
    let totalNeto = 0;

    for (const pesaje of pesajes) {
      const grossWeight = Number(pesaje.kg) || 0;
      const cantidadCajas = Number(pesaje.cajas) || 0;
      const container = containersData?.find(
        (c) => c.id.toString() === pesaje.contenedor,
      );
      const destare = container?.destare || 0;
      const netWeight = grossWeight - destare * cantidadCajas;
      totalBruto += grossWeight;
      totalNeto += netWeight;
    }

    return {
      bruto: totalBruto.toFixed(2),
      neto: totalNeto.toFixed(2),
    };
  };
  // Función para guardar pesaje de un cliente
  // Se crea un AddRequestWeighing por cada pesaje individual de cada producto
  // !precioDiferido: UpdateProductRequest(payment=0) + UpdateRequestStage UNA VEZ al final con totales
  const handleGuardarPesaje = async (
    clienteIdx: number,
    clienteCodes: ClienteData["codes"],
    requestId: number,
  ) => {
    setSaveErrors((prev) => {
      const n = { ...prev };
      delete n[clienteIdx];
      return n;
    });
    setSavingClient(clienteIdx);

    let allOk = true;
    let totalContainers = 0; // acumulado de cajas de todos los productos
    let totalUnits = 0; // acumulado de unidades de todos los productos

    for (const code of clienteCodes) {
      if (!code.ProductRequest_id) continue;

      // Obtener los pesajes registrados para este producto
      const codeIdx = codes.findIndex((c) => c.label === code.label);
      const pesajes = codeIdx !== -1 ? (codes[codeIdx]?.pesajes ?? []) : [];

      // Calcular peso bruto y neto totales para UpdateProductRequest
      let totalBruto = 0;
      let totalNeto = 0;
      for (const pesaje of pesajes) {
        const grossWeight = Number(pesaje.kg) || 0;
        const cantidadCajas = Number(pesaje.cajas) || 0;
        const container = containersData?.find(
          (c) => c.id.toString() === pesaje.contenedor,
        );
        const destare = container?.destare || 0;
        totalBruto += grossWeight;
        totalNeto += grossWeight - destare * cantidadCajas;
      }

      // Acumular totales globales del cliente
      totalContainers += code.cajas;
      totalUnits += code.unidades;

      // --- AddRequestWeighing: un registro por pesaje ---
      if (pesajes.length === 0) {
        const result = await addWeighing(
          0,
          code.unidades,
          code.cajas,
          "1",
          code.ProductRequest_id,
        );
        if (!result) {
          allOk = false;
          break;
        }
      } else {
        for (const pesaje of pesajes) {
          const kg = Number(pesaje.kg) || 0;
          const cajas = Number(pesaje.cajas) || 0;
          const unidades = Number(pesaje.unidades) || 0;
          const container = Number(pesaje.contenedor) || 1;

          const result = await addWeighing(
            kg,
            unidades,
            cajas || container,
            "1",
            code.ProductRequest_id,
          );
          if (!result) {
            allOk = false;
            break;
          }
        }
        if (!allOk) break;
      }

      // --- UpdateProductRequest y UpdateRequestStage según modo de precio ---
      if (precioDiferido) {
        // MODO PRECIO DIFERIDO: payment = precio específico del código
        const precioDelCodigo = Number(codes[codeIdx]?.precio) || 0;
        const result = await updateProductRequest(
          code.ProductRequest_id,
          code.cajas,
          code.unidades,
          code.menudencia || "0",
          Math.round(totalNeto * 100) / 100,
          Math.round(totalBruto * 100) / 100,
          precioDelCodigo,
          "1",
          1,
          code.Product_id,
        );
        if (!result) {
          allOk = false;
          break;
        }
      } else {
        // MODO PRECIO NORMAL: payment=0 en ProductRequest (RequestStage se actualiza al final)
        // 1) UpdateProductRequest con payment=0
        const resultPR = await updateProductRequest(
          code.ProductRequest_id,
          code.cajas,
          code.unidades,
          code.menudencia || "0",
          Math.round(totalNeto * 100) / 100,
          Math.round(totalBruto * 100) / 100,
          0, // payment = 0
          "1",
          1,
          code.Product_id,
        );
        if (!resultPR) {
          allOk = false;
          break;
        }
      }
    }

    // --- UpdateRequestStage: UNA SOLA VEZ al final (solo en modo precio normal) ---
    if (allOk && !precioDiferido) {
      const precioVenta = Number(precioVentaCliente[clienteIdx]) || 0;
      const resultRS = await updateRequestStage(
        clienteCodes[0]?.ProductRequest_id ?? 0, // id del RequestStage
        1, // position
        0, // in_container
        0, // out_container
        totalUnits, // units = total de todos los productos
        totalContainers, // container = total de todos los productos
        precioVenta, // payment = PRECIO VENTA (Bs/Kg)
        "1",
        requestId,
      );
      if (!resultRS) allOk = false;
    }

    setSavingClient(null);
    if (allOk) {
      setSavedClients((prev) => new Set(prev).add(clienteIdx));
    } else {
      setSaveErrors((prev) => ({
        ...prev,
        [clienteIdx]: "Error al guardar el pesaje",
      }));
    }
  };

  useEffect(() => {
    setCodes(
      initialCodes.map((code) => ({
        ...code,
        pesajes: code.pesajes || [],
        precio: code.precio || "",
      })),
    );
  }, [initialCodes]);

  const handleAgregarPesaje = (codeIdx: number) => {
    const newPesaje: PesajeData = {
      id: `pesaje-${Date.now()}-${Math.random()}`,
      cajas: 0,
      unidades: 0,
      kg: 0,
      contenedor: "1",
    };

    const newCodes = [...codes];
    if (!newCodes[codeIdx].pesajes) {
      newCodes[codeIdx].pesajes = [];
    }
    newCodes[codeIdx].pesajes!.push(newPesaje);
    setCodes(newCodes);
  };

  const handleUpdatePesaje = (
    codeIdx: number,
    pesajeId: string,
    field: "cajas" | "unidades" | "kg" | "contenedor",
    value: number | string,
  ) => {
    const newCodes = [...codes];
    if (newCodes[codeIdx].pesajes) {
      const pesajeIdx = newCodes[codeIdx].pesajes!.findIndex(
        (p) => p.id === pesajeId,
      );
      if (pesajeIdx !== -1) {
        newCodes[codeIdx].pesajes![pesajeIdx] = {
          ...newCodes[codeIdx].pesajes![pesajeIdx],
          [field]: value,
        };
        setCodes(newCodes);
      }
    }
  };

  const handleRemovePesaje = (codeIdx: number, pesajeId: string) => {
    const newCodes = [...codes];
    if (newCodes[codeIdx].pesajes) {
      newCodes[codeIdx].pesajes = newCodes[codeIdx].pesajes!.filter(
        (p) => p.id !== pesajeId,
      );
      setCodes(newCodes);
    }
  };

  const handleUpdatePrecio = (codeIdx: number, precio: string) => {
    const newCodes = [...codes];
    newCodes[codeIdx] = {
      ...newCodes[codeIdx],
      precio,
    };
    setCodes(newCodes);
  };

  const generateClientPDF = async (clienteNombre: string) => {
    try {
      const pdfContent = document.createElement("div");
      pdfContent.style.width = "900px";
      pdfContent.style.padding = "40px";
      pdfContent.style.backgroundColor = "#ffffff";
      pdfContent.style.fontFamily = "Arial, sans-serif";

      const productosTableRows = codes
        .map(
          (code) =>
            `<tr style="border-bottom: 1px solid #d1d5db;">
              <td style="padding: 12px; text-align: center; font-size: 13px;">${code.label}</td>
              <td style="padding: 12px; text-align: center; font-size: 13px;">${code.cajas}</td>
              <td style="padding: 12px; text-align: center; font-size: 13px;">${code.unidades}</td>
              <td style="padding: 12px; text-align: center; font-size: 13px;">0.00</td>
              <td style="padding: 12px; text-align: center; font-size: 13px;">0.00</td>
              <td style="padding: 12px; text-align: right; font-size: 13px;">Bs 0.00</td>
            </tr>`,
        )
        .join("");

      pdfContent.innerHTML = `
        <div style="margin-bottom: 40px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #e11d48; margin: 0 0 25px 0;">
            Detalle de Venta
          </h1>
          
          <div style="margin-bottom: 25px; font-size: 14px;">
            <p style="margin: 5px 0;"><strong>Cliente:</strong> ${clienteNombre}</p>
            <p style="margin: 5px 0;"><strong>Grupo:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Encargado:</strong> ${encargado || "No asignado"}</p>
          </div>

          <h2 style="font-size: 18px; font-weight: bold; color: #1e293b; margin: 25px 0 15px 0;">
            Productos Entregados
          </h2>

          <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f3f4f6; border: 1px solid #d1d5db;">
                <th style="padding: 12px; text-align: center; font-weight: bold; border: 1px solid #d1d5db; font-size: 13px;">Código</th>
                <th style="padding: 12px; text-align: center; font-weight: bold; border: 1px solid #d1d5db; font-size: 13px;">Cajas</th>
                <th style="padding: 12px; text-align: center; font-weight: bold; border: 1px solid #d1d5db; font-size: 13px;">Unidades</th>
                <th style="padding: 12px; text-align: center; font-weight: bold; border: 1px solid #d1d5db; font-size: 13px;">Peso Bruto (kg)</th>
                <th style="padding: 12px; text-align: center; font-weight: bold; border: 1px solid #d1d5db; font-size: 13px;">Peso Neto (kg)</th>
                <th style="padding: 12px; text-align: right; font-weight: bold; border: 1px solid #d1d5db; font-size: 13px;">Total BS</th>
              </tr>
            </thead>
            <tbody>
              ${productosTableRows}
              <tr style="background-color: #f9fafb; border: 1px solid #d1d5db; font-weight: bold;">
                <td colspan="5" style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">TOTAL</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">Bs 0.00</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e11d48; text-align: center; color: #666; font-size: 11px;">
            <p style="margin: 0;">Documento generado el ${new Date().toLocaleDateString(
              "es-ES",
              { year: "numeric", month: "long", day: "numeric" },
            )}</p>
          </div>
        </div>
      `;

      document.body.appendChild(pdfContent);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.html(pdfContent, {
        callback: function (doc) {
          window.open(doc.output("bloburi"), "_blank");
          document.body.removeChild(pdfContent);
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 900,
      });
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al generar el PDF");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {!isStarted ? (
        <>
          {/* Vista Normal - Header */}
          <div className="flex flex-col xl:flex-row items-center p-3 gap-4">
            {/* Left group name */}
            <div className="w-30 shrink-0 text-center xl:text-left xl:pl-4">
              <span className="font-bold text-[#e11d48] text-[13px]">
                {name}
              </span>
            </div>

            {/* Center Code Cards */}
            <div className="flex flex-wrap gap-2 flex-1 items-stretch py-1">
              {codes.map((code, codeIdx) => (
                <div
                  key={codeIdx}
                  className="w-20 shrink-0 cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <CardCode
                    label={code.label}
                    cajas={code.cajas}
                    unidades={code.unidades}
                    readOnly={true}
                  />
                </div>
              ))}

              {/* TOTAL Card */}
              <div className="w-20 shrink-0">
                <div className="bg-[#e11d48] rounded-lg p-2 shadow-sm flex flex-col h-full border border-[#e11d48]">
                  <h3 className="font-bold text-white text-[10px] mb-2 text-center uppercase tracking-wide">
                    TOTAL
                  </h3>
                  <div className="space-y-1.5 flex-1 flex flex-col justify-end">
                    <div>
                      <label className="block text-[8px] font-bold text-white/90 uppercase leading-none mb-0.5">
                        CAJAS
                      </label>
                      <div className="w-full px-1.5 py-0.5 bg-white rounded text-[11px] font-bold text-gray-900 text-center h-6 flex items-center justify-center shadow-inner">
                        {totalCajas}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-white/90 uppercase leading-none mb-0.5">
                        UNID.
                      </label>
                      <div className="w-full px-1.5 py-0.5 bg-white rounded text-[11px] font-bold text-gray-900 text-center h-6 flex items-center justify-center shadow-inner">
                        {totalUnid}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Action Button & Chevron */}
            <div className="flex items-center gap-2 shrink-0 pr-4">
              <button
                onClick={() => {
                  setIsStarted(true);
                  onStarted?.(true);
                }}
                className="bg-[#e11d48] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-rose-700 transition-colors"
              >
                Empezar
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-[11px] font-medium whitespace-nowrap">
                  {clientesCount} {clientesCount === 1 ? "cliente" : "clientes"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Acordeón - Clientes Section */}
          {isExpanded && clientes && clientes.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 space-y-4">
              <h4 className="text-[11px] font-bold text-gray-500 mb-3 px-1">
                Pedidos de Clientes:
              </h4>
              {clientes.map((cliente, clienteIdx) => (
                <div key={clienteIdx}>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#e11d48]">
                        {cliente.name}
                      </h3>
                      <span className="text-[8px] font-bold bg-[#d1fae5] text-[#047857] px-1.5 py-0.5 rounded mt-1 inline-block">
                        {cliente.estado}
                      </span>
                      {/* Costo total calculado en tiempo real */}
                      <div className="mt-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          COSTO DE ESTA DISTRIBUCIÓN
                        </span>
                        <span className="text-lg font-bold text-[#e11d48]">
                          Bs{" "}
                          {calculateTotalDistribucion(
                            codes,
                            precioVentaCliente[clienteIdx] || "",
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleGuardarPesaje(
                            clienteIdx,
                            cliente.codes,
                            cliente.Request_id,
                          )
                        }
                        disabled={savingClient === clienteIdx || savingWeighing}
                        className={`text-xs font-bold text-white px-3 py-2 rounded-lg transition-colors ${
                          savedClients.has(clienteIdx)
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : "bg-[#e11d48] hover:bg-rose-700"
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {savingClient === clienteIdx
                          ? "Guardando..."
                          : savedClients.has(clienteIdx)
                            ? "✓ Guardado"
                            : "Guardar"}
                      </button>
                      <button
                        onClick={() => generateClientPDF(cliente.name)}
                        className="text-xs font-bold text-[#e11d48] hover:text-rose-700 transition-colors"
                      >
                        Imprimir
                      </button>
                    </div>
                  </div>

                  {saveErrors[clienteIdx] && (
                    <p className="text-xs text-red-500 mt-1">
                      {saveErrors[clienteIdx]}
                    </p>
                  )}

                  <div className="mb-4">
                    <span className="text-xs font-bold text-gray-500 block mb-2">
                      PRECIO VENTA (Bs/Kg):
                    </span>
                    <div className="flex items-center gap-3 flex-wrap">
                      {!precioDiferido && (
                        <InputField
                          placeholder="0.00"
                          className="w-32 text-xs"
                          value={precioVentaCliente[clienteIdx] || ""}
                          onChange={(e) =>
                            setPrecioVentaCliente((prev) => ({
                              ...prev,
                              [clienteIdx]: e.target.value,
                            }))
                          }
                        />
                      )}
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={precioDiferido}
                          onChange={(e) => setPrecioDiferido(e.target.checked)}
                        />
                        <span className="text-xs text-gray-600">
                          Precio diferido
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Códigos del cliente */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-600 uppercase mb-3">
                      Códigos en esta Distribución
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {cliente.codes.map((code, idx) => (
                        <div key={idx} className="relative h-full">
                          <CardCode
                            label={
                              <div className="flex items-center justify-center gap-2">
                                <input
                                  type="checkbox"
                                  className="w-3 h-3"
                                  defaultChecked
                                />
                                <span className="text-[10px] font-bold">
                                  {code.label}
                                </span>
                              </div>
                            }
                            cajas={code.cajas}
                            unidades={code.unidades}
                            readOnly={true}
                            showPrecio={precioDiferido}
                            precio={codes[idx]?.precio || ""}
                            onPrecioChange={(val) =>
                              handleUpdatePrecio(idx, val)
                            }
                            productName={code.label}
                            variant="active"
                            menudencia={menudencia[idx] || false}
                            onMenudenciaChange={(checked) =>
                              setMenudencia({
                                ...menudencia,
                                [idx]: checked,
                              })
                            }
                            weightInfo={{
                              bruto: calcularPesos(idx).bruto,
                              neto: calcularPesos(idx).neto,
                            }}
                            className="pointer-events-auto h-full"
                            pesajes={codes[idx]?.pesajes || []}
                            onAgregarPesaje={() => handleAgregarPesaje(idx)}
                            onUpdatePesaje={(pesajeId, field, value) =>
                              handleUpdatePesaje(idx, pesajeId, field, value)
                            }
                            onRemovePesaje={(pesajeId) =>
                              handleRemovePesaje(idx, pesajeId)
                            }
                            containers={containers}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {clienteIdx < clientes.length - 1 && (
                    <hr className="border-gray-200 my-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Vista Expandida - Solo Acordeón */}
          <div className="bg-gray-50 px-4 py-4 space-y-4">
            {clientes && clientes.length > 0 ? (
              clientes.map((cliente, clienteIdx) => (
                <div key={clienteIdx}>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#e11d48]">
                        {cliente.name}
                      </h3>
                      {/* Costo total calculado en tiempo real */}
                      <div className="mt-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          COSTO DE ESTA DISTRIBUCIÓN
                        </span>
                        <span className="text-lg font-bold text-[#e11d48]">
                          Bs{" "}
                          {calculateTotalDistribucion(
                            codes,
                            precioVentaCliente[clienteIdx] || "",
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleGuardarPesaje(
                            clienteIdx,
                            cliente.codes,
                            cliente.Request_id,
                          )
                        }
                        disabled={savingClient === clienteIdx || savingWeighing}
                        className={`text-xs font-bold text-white px-3 py-2 rounded-lg transition-colors ${
                          savedClients.has(clienteIdx)
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : "bg-[#e11d48] hover:bg-rose-700"
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {savingClient === clienteIdx
                          ? "Guardando..."
                          : savedClients.has(clienteIdx)
                            ? "✓ Guardado"
                            : "Guardar"}
                      </button>
                      <button
                        onClick={() => generateClientPDF(cliente.name)}
                        className="text-xs font-bold text-[#e11d48] hover:text-rose-700 transition-colors"
                      >
                        Imprimir
                      </button>
                    </div>
                  </div>

                  {saveErrors[clienteIdx] && (
                    <p className="text-xs text-red-500 mt-1">
                      {saveErrors[clienteIdx]}
                    </p>
                  )}

                  <div className="mb-4">
                    <span className="text-xs font-bold text-gray-500 block mb-2">
                      PRECIO VENTA (Bs/Kg):
                    </span>
                    <div className="flex items-center gap-3 flex-wrap">
                      {!precioDiferido && (
                        <InputField
                          placeholder="0.00"
                          className="w-32 text-xs"
                          value={precioVentaCliente[clienteIdx] || ""}
                          onChange={(e) =>
                            setPrecioVentaCliente((prev) => ({
                              ...prev,
                              [clienteIdx]: e.target.value,
                            }))
                          }
                        />
                      )}
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={precioDiferido}
                          onChange={(e) => setPrecioDiferido(e.target.checked)}
                        />
                        <span className="text-xs text-gray-600">
                          Precio diferido
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Códigos del cliente */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-600 uppercase mb-3">
                      Códigos en esta Distribución
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {cliente.codes.map((code, idx) => (
                        <div key={idx} className="relative h-full">
                          <CardCode
                            label={
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-[10px] font-bold">
                                  {code.label}
                                </span>
                              </div>
                            }
                            cajas={code.cajas}
                            unidades={code.unidades}
                            readOnly={true}
                            showPrecio={precioDiferido}
                            precio={codes[idx]?.precio || ""}
                            onPrecioChange={(val) =>
                              handleUpdatePrecio(idx, val)
                            }
                            productName={code.label}
                            variant="active"
                            menudencia={menudencia[idx] || true}
                            onMenudenciaChange={(checked) =>
                              setMenudencia({
                                ...menudencia,
                                [idx]: checked,
                              })
                            }
                            weightInfo={{
                              bruto: calcularPesos(idx).bruto,
                              neto: calcularPesos(idx).neto,
                            }}
                            className="pointer-events-auto h-full"
                            pesajes={codes[idx]?.pesajes || []}
                            onAgregarPesaje={() => handleAgregarPesaje(idx)}
                            onUpdatePesaje={(pesajeId, field, value) =>
                              handleUpdatePesaje(idx, pesajeId, field, value)
                            }
                            onRemovePesaje={(pesajeId) =>
                              handleRemovePesaje(idx, pesajeId)
                            }
                            containers={containers}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {clienteIdx < clientes.length - 1 && (
                    <hr className="border-gray-200 my-4" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Sin clientes para este grupo
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

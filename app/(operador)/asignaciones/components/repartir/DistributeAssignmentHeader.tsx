"use client";
import { useCar } from "@/app/(operador)/configuraciones/hooks/vehiculos/useCar";
import CardCode from "@/components/ui/CardCode";
import { Select, type SelectOption } from "@/components/ui/SelecMultipe";
import { useGetEmployeeDriver } from "../../hooks/chofer/useGetEmployeeDriver";
import jsPDF from "jspdf";

export interface RouteReportPesaje {
  id: string;
  contenedor: string;
  cajas: number;
  unidades: number;
  kg: number;
  destare: number;
  neto: number;
}

export interface RouteReportCode {
  label: string;
  solicitado: number;
  cajas: number;
  unidades: number;
  bruto: number;
  neto: number;
  precioUnitario: number;
  totalBs: number;
  pesajes: RouteReportPesaje[];
}

export interface RouteReportClient {
  nombre: string;
  requestId: number;
  montoACobrar: number;
  deudaCajas: number;
  deudaDinero: number;
  codes: RouteReportCode[];
  totalBruto: number;
  totalNeto: number;
  totalBs: number;
}

export interface RouteReportData {
  groupName: string;
  proveedor: string;
  costoPorKg: string;
  precioDiferido: boolean;
  vehiculo: string;
  chofer: string;
  totalCajas: number;
  totalUnid: number;
  clientes: RouteReportClient[];
}

interface DistributeAssignmentHeaderProps {
  proveedor?: string;
  costoPorKg?: string;
  precioDiferido?: boolean;
  detalles: Array<{
    label: string;
    cajas: string;
    unidades: string;
  }>;
  isRepartir?: string;
  isFinalizando?: boolean;
  onCancel?: () => void;
  onFinalizarRepartir?: () => void;
  isStarted?: boolean;
  groupName?: string;
  totalCajas?: number;
  totalUnid?: number;
  vehiculo?: string;
  chofer?: string;
  onVehiculoChange?: (value: string) => void;
  onChoferChange?: (value: string) => void;
  clientes?: Array<{
    nombre: string;
    montoACobrar: number;
    deudaCajas: number;
    deudaDinero: number;
  }>;
  routeReport?: RouteReportData | null;
}

export default function DistributeAssignmentHeader({
  proveedor = "SOFIA",
  costoPorKg = "10.00",
  precioDiferido = false,
  detalles,
  isRepartir,
  isFinalizando,
  onCancel,
  onFinalizarRepartir,
  isStarted = false,
  groupName = "",
  totalCajas = 0,
  totalUnid = 0,
  vehiculo = "",
  chofer = "",
  onVehiculoChange,
  onChoferChange,
  clientes = [],
  routeReport = null,
}: DistributeAssignmentHeaderProps) {
  const { cars } = useCar();
  const { drivers } = useGetEmployeeDriver();

  // Obtener nombre del chofer basado en su ID
  const choferNombre =
    chofer && drivers.find((d) => d.id.toString() === chofer)?.name
      ? drivers.find((d) => d.id.toString() === chofer)?.name
      : "No asignado";

  // Obtener nombre del vehículo basado en su ID
  const vehiculoEncontrado = vehiculo
    ? cars.find((c) => c.id.toString() === vehiculo)
    : null;
  const vehiculoNombre = vehiculoEncontrado
    ? `${vehiculoEncontrado.name} - ${vehiculoEncontrado.license}`
    : "No asignado";

  // Convert cars to SelectOption format
  const vehiculoOptions: SelectOption[] = cars.map((car) => ({
    value: car.id.toString(),
    label: `${car.name} (${car.license})`,
  }));

  // Convert drivers to SelectOption format
  const choferOptions: SelectOption[] = drivers.map((driver) => ({
    value: driver.id.toString(),
    label: driver.name,
  }));

  const parseComparativo = (valor: string) => {
    const [solicitadoRaw, asignadoRaw] = valor.split("/");
    return {
      solicitado: Number(solicitadoRaw ?? 0) || 0,
      asignado: Number(asignadoRaw ?? 0) || 0,
    };
  };

  const formatMoney = (value: number) =>
    value.toLocaleString("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const buildRoutePdfHtml = (report: RouteReportData) => {
    const clientsHtml = report.clientes
      .map((cliente) => {
        const codesHtml = cliente.codes
          .map((code) => {
            const pesajesHtml = code.pesajes
              .map(
                (pesaje) => `
                  <tr>
                    <td style="padding: 8px 10px; border: 1px solid #e5e7eb;">${pesaje.contenedor}</td>
                    <td style="padding: 8px 10px; border: 1px solid #e5e7eb; text-align: right;">${pesaje.cajas}</td>
                    <td style="padding: 8px 10px; border: 1px solid #e5e7eb; text-align: right;">${pesaje.unidades}</td>
                    <td style="padding: 8px 10px; border: 1px solid #e5e7eb; text-align: right;">${formatMoney(pesaje.kg)}</td>
                    <td style="padding: 8px 10px; border: 1px solid #e5e7eb; text-align: right;">${formatMoney(pesaje.destare)}</td>
                    <td style="padding: 8px 10px; border: 1px solid #e5e7eb; text-align: right; font-weight: 700;">${formatMoney(pesaje.neto)}</td>
                  </tr>
                `,
              )
              .join("");

            return `
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 700;">${code.label}</td>
                <td style="padding: 10px 12px; border: 1px solid #e5e7eb; text-align: right;">${code.solicitado}</td>
                <td style="padding: 10px 12px; border: 1px solid #e5e7eb; text-align: right;">${code.cajas}</td>
                <td style="padding: 10px 12px; border: 1px solid #e5e7eb; text-align: right;">${code.unidades}</td>
                <td style="padding: 10px 12px; border: 1px solid #e5e7eb; text-align: right;">${formatMoney(code.bruto)}</td>
                <td style="padding: 10px 12px; border: 1px solid #e5e7eb; text-align: right;">${formatMoney(code.neto)}</td>
                <td style="padding: 10px 12px; border: 1px solid #e5e7eb; text-align: right;">Bs ${formatMoney(code.precioUnitario)}</td>
                <td style="padding: 10px 12px; border: 1px solid #e5e7eb; text-align: right; font-weight: 700;">Bs ${formatMoney(code.totalBs)}</td>
              </tr>
              <tr>
                <td colspan="8" style="padding: 0; border: 1px solid #e5e7eb; background: #fff;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                    <thead>
                      <tr style="background: #fff7ed; color: #9a3412;">
                        <th style="padding: 8px 10px; text-align: left; border-bottom: 1px solid #fed7aa;">Pesaje</th>
                        <th style="padding: 8px 10px; text-align: right; border-bottom: 1px solid #fed7aa;">Cajas</th>
                        <th style="padding: 8px 10px; text-align: right; border-bottom: 1px solid #fed7aa;">Unid.</th>
                        <th style="padding: 8px 10px; text-align: right; border-bottom: 1px solid #fed7aa;">Bruto kg</th>
                        <th style="padding: 8px 10px; text-align: right; border-bottom: 1px solid #fed7aa;">Destare</th>
                        <th style="padding: 8px 10px; text-align: right; border-bottom: 1px solid #fed7aa;">Neto kg</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${pesajesHtml || `<tr><td colspan="6" style="padding: 8px 10px; text-align: center; color: #9ca3af;">Sin pesajes registrados</td></tr>`}
                    </tbody>
                  </table>
                </td>
              </tr>
            `;
          })
          .join("");

        return `
          <section style="margin-bottom: 24px; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-bottom: 10px;">
              <div>
                <h3 style="margin: 0; font-size: 18px; color: #111827;">${cliente.nombre}</h3>
                <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Solicitud #${cliente.requestId}</p>
              </div>
              <div style="text-align: right; font-size: 12px; color: #6b7280;">
                <div>Monto a cobrar: <strong style="color: #111827;">Bs ${formatMoney(cliente.montoACobrar)}</strong></div>
                <div>Peso bruto: <strong style="color: #111827;">${formatMoney(cliente.totalBruto)} kg</strong></div>
                <div>Peso neto: <strong style="color: #111827;">${formatMoney(cliente.totalNeto)} kg</strong></div>
              </div>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px;">
              <thead>
                <tr style="background: #e11d48; color: #fff;">
                  <th style="padding: 10px 12px; text-align: left;">Código</th>
                  <th style="padding: 10px 12px; text-align: right;">Solic.</th>
                  <th style="padding: 10px 12px; text-align: right;">Cajas</th>
                  <th style="padding: 10px 12px; text-align: right;">Unid.</th>
                  <th style="padding: 10px 12px; text-align: right;">Bruto kg</th>
                  <th style="padding: 10px 12px; text-align: right;">Neto kg</th>
                  <th style="padding: 10px 12px; text-align: right;">Precio kg</th>
                  <th style="padding: 10px 12px; text-align: right;">Total Bs</th>
                </tr>
              </thead>
              <tbody>
                ${codesHtml}
              </tbody>
            </table>
            <div style="display: flex; justify-content: flex-end; gap: 20px; font-size: 12px; color: #111827;">
              <div><strong>Costo de distribución:</strong> Bs ${formatMoney(cliente.totalBs)}</div>
            </div>
          </section>
        `;
      })
      .join("");

    return `
      <div style="margin-bottom: 40px; color: #111827; background-color: #ffffff;">
        <h1 style="font-size: 30px; font-weight: 800; color: #e11d48; margin: 0 0 10px 0; text-align: center; letter-spacing: 0.02em;">
          Ruta de Distribución
        </h1>
        <p style="margin: 0; text-align: center; color: #6b7280; font-size: 12px;">Detalle completo de entrega, pesajes y costo de distribución</p>

        <div style="margin-top: 18px; background-color: #ffffff; border: 1px solid #fecdd3; border-radius: 14px; padding: 18px 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Grupo</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">${report.groupName}</div>
          </div>
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Vehículo</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">${vehiculoNombre}</div>
          </div>
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Chofer</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">${choferNombre}</div>
          </div>
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Proveedor</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">${report.proveedor}</div>
          </div>
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Costo por kg</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">Bs ${report.costoPorKg}</div>
          </div>
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Precio diferido</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">${report.precioDiferido ? "Sí" : "No"}</div>
          </div>
        </div>

        <div style="margin-top: 16px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700;">Total cajas</div>
            <div style="font-size: 24px; font-weight: 800; color: #e11d48; margin-top: 4px;">${report.totalCajas}</div>
          </div>
          <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700;">Total unidades</div>
            <div style="font-size: 24px; font-weight: 800; color: #e11d48; margin-top: 4px;">${report.totalUnid}</div>
          </div>
        </div>

        <div style="margin-top: 26px; background-color: #ffffff;">
          <h2 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 14px 0;">Clientes y detalle de códigos</h2>
          ${clientsHtml || `<div style="padding: 18px; border: 1px dashed #d1d5db; border-radius: 12px; color: #6b7280; text-align: center;">Sin clientes registrados</div>`}
        </div>

        <div style="margin-top: 24px; padding-top: 14px; border-top: 2px solid #fecdd3; text-align: center; color: #6b7280; font-size: 11px;">
          Documento generado el ${new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    `;
  };

  const generatePDF = async () => {
    try {
      if (routeReport) {
        const pdfContent = document.createElement("div");
        pdfContent.style.width = "900px";
        pdfContent.style.padding = "32px";
        pdfContent.style.backgroundColor = "#ffffff";
        pdfContent.style.fontFamily = "Arial, sans-serif";
        pdfContent.innerHTML = buildRoutePdfHtml(routeReport);

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
        return;
      }

      // Crear un contenedor temporal con el contenido del PDF
      const pdfContent = document.createElement("div");
      pdfContent.style.width = "900px";
      pdfContent.style.padding = "40px";
      pdfContent.style.backgroundColor = "#ffffff";
      pdfContent.style.fontFamily = "Arial, sans-serif";

      pdfContent.innerHTML = `
        <div style="margin-bottom: 40px;">
          <h1 style="font-size: 36px; font-weight: bold; color: #1e5a96; margin: 0 0 30px 0; text-align: center;">
            Ruta de Distribución
          </h1>
          
          <div style="background-color: #f3f4f6; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; font-size: 16px;">
              <div>
                <p style="margin: 0; color: #666; font-weight: bold;">GRUPO:</p>
                <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #1e293b;">${groupName}</p>
              </div>
              <div>
                <p style="margin: 0; color: #666; font-weight: bold;">VEHÍCULO:</p>
                <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #1e293b;">${vehiculoNombre}</p>
              </div>
              <div>
                <p style="margin: 0; color: #666; font-weight: bold;">CHOFER:</p>
                <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #1e293b;">${choferNombre}</p>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 22px; font-weight: bold; color: #1e293b; margin-bottom: 20px;">Información de Clientes</h2>
            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
              <thead>
                <tr style="background-color: #e11d48; color: white;">
                  <th style="padding: 15px; text-align: left; font-size: 16px; font-weight: bold;">Cliente</th>
                  <th style="padding: 15px; text-align: center; font-size: 16px; font-weight: bold;">Monto a Cobrar (Bs)</th>
                  <th style="padding: 15px; text-align: center; font-size: 16px; font-weight: bold;">Deuda Cajas</th>
                  <th style="padding: 15px; text-align: center; font-size: 16px; font-weight: bold;">Deuda Dinero</th>
                </tr>
              </thead>
              <tbody>
                ${
                  clientes.length > 0
                    ? clientes
                        .map(
                          (c) =>
                            `<tr style="border-bottom: 1px solid #d1d5db;">
                              <td style="padding: 15px; text-align: left; font-size: 14px;">${c.nombre}</td>
                              <td style="padding: 15px; text-align: center; font-size: 14px;">${c.montoACobrar.toFixed(2)}</td>
                              <td style="padding: 15px; text-align: center; font-size: 14px;">${c.deudaCajas}</td>
                              <td style="padding: 15px; text-align: center; font-size: 14px;">${c.deudaDinero.toFixed(2)}</td>
                            </tr>`,
                        )
                        .join("")
                    : `<tr><td colspan="4" style="padding: 15px; text-align: center; font-size: 14px; color: #999;">Sin clientes asignados</td></tr>`
                }
              </tbody>
            </table>
          </div>

        

          <div style="margin-top: 40px; padding-top: 20px; border-top: 3px solid #e11d48; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 0;">Documento generado el ${new Date().toLocaleDateString(
              "es-ES",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}</p>
          </div>
        </div>
      `;

      document.body.appendChild(pdfContent);

      // Crear PDF con texto seleccionable usando jsPDF.html()
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
  if (isStarted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5 p-5">
        <h2 className="text-[17px] font-bold text-[#1e293b] mb-5">
          Pesaje - {groupName}
        </h2>

        <div className="flex flex-col lg:flex-row items-start gap-4">
          {/* Left Section */}
          <div className="flex flex-col gap-4 lg:w-70">
            <div className="flex flex-col space-y-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                PROVEEDOR:{" "}
                <span className="text-gray-900 ml-1">{proveedor}</span>
              </p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                GRUPO: <span className="text-gray-900 ml-1">{groupName}</span>
              </p>
            </div>

            {/* Selectores */}
            <div className="flex flex-col gap-3 mt-2">
              <Select
                label="VEHÍCULO"
                options={vehiculoOptions}
                selectedValues={vehiculo ? [vehiculo] : []}
                onSelect={(option) => onVehiculoChange?.(option.value)}
                placeholder="Seleccionar vehículo"
                closeOnSelect={true}
              />

              <Select
                label="CHOFER"
                options={choferOptions}
                selectedValues={chofer ? [chofer] : []}
                onSelect={(option) => onChoferChange?.(option.value)}
                placeholder="Seleccionar chofer"
                closeOnSelect={true}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-2.5 mt-4 flex-wrap">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-bold shadow-sm bg-white hover:bg-gray-50 text-gray-700 transition-colors flex-1 min-w-25"
              >
                Volver
              </button>
              <button
                className="px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm bg-blue-500 hover:bg-blue-600 text-white transition-colors flex-1 min-w-35"
                onClick={generatePDF}
              >
                Imprimir Ruta
              </button>
            </div>
          </div>

          {/* Right Section - Codes */}
          <div className="flex-1 pb-2 w-full">
            <div className="flex flex-wrap gap-3">
              {detalles.map((d, i) => {
                const cajas = parseComparativo(d.cajas);
                const unidades = parseComparativo(d.unidades);

                return (
                  <div key={i} className="w-30">
                    <CardCode
                      label={d.label}
                      cajas={cajas.asignado}
                      unidades={unidades.asignado}
                      readOnly={true}
                      compareReadOnly={{
                        leftLabel: "Asig.",
                        rightLabel: "Solicit.",
                        rightCajas: cajas.solicitado,
                        rightUnidades: unidades.solicitado,
                      }}
                    />
                  </div>
                );
              })}
              {/* TOTAL Card */}
              <div className="w-30">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5 p-5">
      <h2 className="text-[17px] font-bold text-[#1e293b] mb-5">
        Repartir Asignación
      </h2>

      <div className="flex flex-col xl:flex-row items-start gap-6">
        <div className="flex flex-col gap-4 xl:w-62.5 shrink-0 pb-4 xl:pb-0">
          <div className="flex flex-col space-y-2 mt-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              PROVEEDOR: <span className="text-gray-900 ml-1">{proveedor}</span>
            </p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              COSTO POR KG:{" "}
              <span className="text-gray-900 ml-1">Bs {costoPorKg}</span>
            </p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              PRECIO DIFERIDO:{" "}
              <span className="text-gray-900 ml-1">
                {precioDiferido ? "Sí" : "No"}
              </span>
            </p>
          </div>
          <div className="flex gap-2.5 mt-2 flex-wrap">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-200 rounded-lg text-[12px] font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0 flex-1"
            >
              Volver
            </button>
            <button
              onClick={onFinalizarRepartir}
              disabled={isFinalizando || isRepartir === "true"}
              className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm text-white transition-colors ${
                isRepartir === "true"
                  ? "bg-gray-400 cursor-not-allowed opacity-80"
                  : isFinalizando
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
              }`}
            >
              {isRepartir === "true"
                ? "Repartir Finalizado"
                : isFinalizando
                  ? "Finalizando..."
                  : "Finalizar Repartir"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto pb-2">
          <h3 className="text-[11px] font-bold text-gray-800 mb-3 xl:ml-2">
            Detalles de la Asignación
          </h3>
          <div className="flex flex-wrap gap-3 xl:ml-2">
            {detalles.map((d, i) => {
              const cajas = parseComparativo(d.cajas);
              const unidades = parseComparativo(d.unidades);

              return (
                <div key={i} className="w-30">
                  <CardCode
                    label={d.label}
                    cajas={cajas.solicitado}
                    unidades={unidades.solicitado}
                    readOnly={true}
                    compareReadOnly={{
                      leftLabel: "Asig.",
                      rightLabel: "Solicit.",
                      rightCajas: cajas.asignado,
                      rightUnidades: unidades.asignado,
                    }}
                    weightInfo={{
                      adicional: [
                        { label: "Costo:", value: `Bs ${costoPorKg}/kg` },
                      ],
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

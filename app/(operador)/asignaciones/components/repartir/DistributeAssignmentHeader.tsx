"use client";
import { useCar } from "@/app/(operador)/configuraciones/hooks/vehiculos/useCar";
import CardCode from "@/components/ui/CardCode";
import { Select, type SelectOption } from "@/components/ui/SelecMultipe";
import { useGetEmployeeDriver } from "../../hooks/chofer/useGetEmployeeDriver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface DistributeAssignmentHeaderProps {
  proveedor?: string;
  costoPorKg?: string;
  precioDiferido?: boolean;
  detalles: Array<{
    label: string;
    cajas: string;
    unidades: string;
  }>;
  onCancel?: () => void;
  onSave?: () => void;
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
}

export default function DistributeAssignmentHeader({
  proveedor = "SOFIA",
  costoPorKg = "10.00",
  precioDiferido = false,
  detalles,
  onCancel,
  onSave,
  isStarted = false,
  groupName = "",
  totalCajas = 0,
  totalUnid = 0,
  vehiculo = "",
  chofer = "",
  onVehiculoChange,
  onChoferChange,
  clientes = [],
}: DistributeAssignmentHeaderProps) {
  const { cars } = useCar();
  const { drivers } = useGetEmployeeDriver();

  // Obtener nombre del chofer basado en su ID
  const choferNombre =
    chofer && drivers.find((d) => d.id.toString() === chofer)?.name
      ? drivers.find((d) => d.id.toString() === chofer)?.name
      : "No asignado";

  // Convert cars to SelectOption format
  const vehiculoOptions: SelectOption[] = cars.map((car) => ({
    value: car.idCar,
    label: `${car.name} (${car.license})`,
  }));

  // Convert drivers to SelectOption format
  const choferOptions: SelectOption[] = drivers.map((driver) => ({
    value: driver.id.toString(),
    label: driver.name,
  }));

  const generatePDF = async () => {
    try {
      // Crear un contenedor temporal con el contenido del PDF
      const pdfContent = document.createElement("div");
      pdfContent.style.width = "900px";
      pdfContent.style.padding = "40px";
      pdfContent.style.backgroundColor = "#ffffff";
      pdfContent.style.fontFamily = "Arial, sans-serif";

      // Obtener los detalles de los códigos para la tabla
      const detallesTable = detalles
        .map(
          (d) =>
            `<tr style="border-bottom: 2px solid #e11d48;">
              <td style="padding: 15px; text-align: left; font-size: 14px;">${d.label}</td>
              <td style="padding: 15px; text-align: center; font-size: 14px;">${d.cajas}</td>
              <td style="padding: 15px; text-align: center; font-size: 14px;">${d.unidades}</td>
            </tr>`,
        )
        .join("");

      // Tabla de clientes - una sección por cada cliente
      const clientesSections = clientes
        .map(
          (c) =>
            `<div style="margin-bottom: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #e11d48;">
              <h3 style="font-size: 18px; font-weight: bold; color: #1e293b; margin: 0 0 15px 0;">${c.nombre}</h3>
              <table style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
                <thead>
                  <tr style="background-color: #e11d48; color: white;">
                    <th style="padding: 12px; text-align: left; font-size: 14px; font-weight: bold;">Concepto</th>
                    <th style="padding: 12px; text-align: center; font-size: 14px; font-weight: bold;">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #e11d48;">
                    <td style="padding: 12px; text-align: left; font-size: 13px;">Monto a Cobrar (Bs)</td>
                    <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: bold;">${c.montoACobrar.toFixed(2)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e11d48;">
                    <td style="padding: 12px; text-align: left; font-size: 13px;">Deuda Cajas</td>
                    <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: bold;">${c.deudaCajas}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; text-align: left; font-size: 13px;">Deuda Dinero</td>
                    <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: bold;">${c.deudaDinero.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>`,
        )
        .join("");

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
                <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #1e293b;">${vehiculo || "No asignado"}</p>
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
                              <td style="padding: 15px; text-align: center; font-size: 14px;">0.00</td>
                              <td style="padding: 15px; text-align: center; font-size: 14px;">0</td>
                              <td style="padding: 15px; text-align: center; font-size: 14px;">0.00</td>
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
                onClick={onSave}
                className="px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm bg-[#10b981] hover:bg-emerald-600 text-white transition-colors flex-1 min-w-35"
              >
                Guardar Pesaje
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
              {detalles.map((d, i) => (
                <div key={i} className="w-30">
                  <CardCode
                    label={d.label}
                    cajas={d.cajas}
                    unidades={d.unidades}
                    readOnly={true}
                  />
                </div>
              ))}
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
          <div className="flex gap-2.5 mt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-200 rounded-lg text-[12px] font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0 flex-1"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 rounded-lg text-[12px] font-bold shadow-sm bg-[#10b981] hover:bg-emerald-600 text-white transition-colors text-center flex-1"
            >
              Guardar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto pb-2">
          <h3 className="text-[11px] font-bold text-gray-800 mb-3 xl:ml-2">
            Detalles de la Asignación
          </h3>
          <div className="flex flex-wrap gap-3 xl:ml-2">
            {detalles.map((d, i) => (
              <div key={i} className="w-30">
                <CardCode
                  label={d.label}
                  cajas={d.cajas}
                  unidades={d.unidades}
                  readOnly={true}
                  weightInfo={{
                    adicional: [
                      { label: "Costo:", value: `Bs ${costoPorKg}/kg` },
                    ],
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

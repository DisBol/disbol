"use client";

import { AccionRapida } from "../interfaces";

interface AccionesRapidasProps {
  acciones: AccionRapida[];
}

export default function AccionesRapidas({ acciones }: AccionesRapidasProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {acciones.map((accion) => (
        <a
          key={accion.id}
          href={accion.ruta}
          className={`${accion.color} text-white font-semibold py-2 px-4 rounded hover:opacity-90 transition`}
        >
          {accion.titulo}
        </a>
      ))}
    </div>
  );
}

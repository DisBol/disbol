"use client";

import { ReactNode } from "react";

interface MetricasCardProps {
  titulo: string;
  contenido: ReactNode;
}

export default function MetricasCard({ titulo, contenido }: MetricasCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">{titulo}</h3>
      <div>{contenido}</div>
    </div>
  );
}

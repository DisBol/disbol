"use client";

import { useContext } from "react";
import { BalanzaContext, BalanzaContextType } from "@/context/BalanzaContext";

export const useBalanza = (): BalanzaContextType => {
  const context = useContext(BalanzaContext);

  if (context === undefined) {
    throw new Error(
      "useBalanza debe ser usado dentro de un BalanzaProvider"
    );
  }

  return context;
};

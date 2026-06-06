"use client";

import { useCallback, useEffect, useState } from "react";
import { Datum } from "../interfaces/getelements.interface";
import { GetElements } from "../service/getElements";

export function useGetElements() {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchElements = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await GetElements();
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar elementos",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  return {
    data,
    loading,
    error,
    refetch: fetchElements,
  };
}

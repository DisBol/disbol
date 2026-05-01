import { useState } from "react";
import { AddContainerMovements } from "../../service/repartir/addcontainermovements";
import { AddContainerMovementsResponse } from "../../interfaces/repartir/addcontainermovements";

interface UseAddContainerMovementsReturn {
  loading: boolean;
  error: string | null;
  addContainerMovements: (
    quantity: number,
    active: string,
    Container_id: number,
    Request_id: number | null,
    Client_id: number | null,
    Assignment_id: number | null,
    Provider_id: number | null,
  ) => Promise<AddContainerMovementsResponse | null>;
}

export const useAddContainerMovements = (): UseAddContainerMovementsReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addContainerMovements = async (
    quantity: number,
    active: string,
    Container_id: number,
    Request_id: number | null,
    Client_id: number | null,
    Assignment_id: number | null,
    Provider_id: number | null,
  ): Promise<AddContainerMovementsResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await AddContainerMovements(
        quantity,
        active,
        Container_id,
        Request_id,
        Client_id,
        Assignment_id,
        Provider_id,
      );
      return response;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al registrar movimiento de contenedor",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, addContainerMovements };
};

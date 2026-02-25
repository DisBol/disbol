import { useState, useCallback } from "react";
import { useAddAssignment } from "./useAddAssignment";
import { useAddAssignmentStage } from "./useAddAssignmentStage";
import { useAddTicket } from "./useAddTicket";
import { useAddProductAssignment } from "./useAddProductAssignment";

interface UseAddFullAssignmentParams {
  // Assignment params
  Provider_id: string;

  // AssignmentStage params
  position: string;
  in_container: number;
  out_container: number;
  units: number;
  container: number;
  stage_payment: string;

  // Ticket params
  code: string;
  deferred_payment: string;
  total_payment: string;
  product_payment: string;

  // ProductAssignment params
  product_container: number;
  product_units: number;
  menudencia: string;
  net_weight: string;
  gross_weight: string;
  product_assignment_payment: string;
  Product_id: string;
}

interface UseAddFullAssignmentReturn {
  loading: boolean;
  error: string | null;
  assignmentId: number | null;
  assignmentStageId: number | null;
  ticketId: number | null;
  productAssignmentId: number | null;
  addFullAssignment: (params: UseAddFullAssignmentParams) => Promise<boolean>;
  reset: () => void;
}

export const useAddFullAssignment = (): UseAddFullAssignmentReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [assignmentId, setAssignmentId] = useState<number | null>(null);
  const [assignmentStageId, setAssignmentStageId] = useState<number | null>(
    null,
  );
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [productAssignmentId, setProductAssignmentId] = useState<number | null>(
    null,
  );

  const { addAssignment } = useAddAssignment();
  const { addAssignmentStage } = useAddAssignmentStage();
  const { addTicket } = useAddTicket();
  const { addProductAssignment } = useAddProductAssignment();

  const addFullAssignment = useCallback(
    async (params: UseAddFullAssignmentParams) => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Create Assignment
        const createdAssignmentId = await addAssignment({
          Provider_id: params.Provider_id,
        });

        if (!createdAssignmentId) {
          throw new Error("Failed to create assignment");
        }

        setAssignmentId(createdAssignmentId);

        // Step 2: Create AssignmentStage
        const createdAssignmentStageId = await addAssignmentStage({
          position: params.position,
          in_container: params.in_container,
          out_container: params.out_container,
          units: params.units,
          container: params.container,
          payment: params.stage_payment,
          Assignment_id: createdAssignmentId.toString(),
        });

        if (!createdAssignmentStageId) {
          throw new Error("Failed to create assignment stage");
        }

        setAssignmentStageId(createdAssignmentStageId);

        // Step 3: Create Ticket
        const createdTicketId = await addTicket({
          code: params.code,
          deferred_payment: params.deferred_payment,
          total_payment: params.total_payment,
          product_payment: params.product_payment,
          AssignmentStage_id: createdAssignmentStageId.toString(),
        });

        if (!createdTicketId) {
          throw new Error("Failed to create ticket");
        }

        setTicketId(createdTicketId);

        // Step 4: Create ProductAssignment
        const createdProductAssignmentId = await addProductAssignment({
          container: params.product_container,
          units: params.product_units,
          menudencia: params.menudencia,
          net_weight: params.net_weight,
          gross_weight: params.gross_weight,
          payment: params.product_assignment_payment,
          Tickets_id: createdTicketId.toString(),
          Product_id: params.Product_id,
          active: "true",
        });

        if (!createdProductAssignmentId) {
          throw new Error("Failed to create product assignment");
        }

        setProductAssignmentId(createdProductAssignmentId);

        return true;
      } catch (err) {
        console.error("Error in full assignment creation flow:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [addAssignment, addAssignmentStage, addTicket, addProductAssignment],
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
    setAssignmentId(null);
    setAssignmentStageId(null);
    setTicketId(null);
    setProductAssignmentId(null);
  }, []);

  return {
    loading,
    error,
    assignmentId,
    assignmentStageId,
    ticketId,
    productAssignmentId,
    addFullAssignment,
    reset,
  };
};

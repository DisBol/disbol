import { useState } from "react";
import { GetTicketbyAssignmentHistory } from "../service/getticketsbyassignmenthistory";
import { GetTicketBayAssignmentHistoryResponse } from "../interfaces/getticketsbyassignmenthistory.interface";

export const useGetTicketsByAssignmentHistory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTicketsByAssignmentHistory = async (
        Assignment_id: number,
    ): Promise<GetTicketBayAssignmentHistoryResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetTicketbyAssignmentHistory(Assignment_id);
            return response;
        } catch (err: unknown) {
            console.error("Error fetching tickets by assignment history:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Error fetching tickets by assignment history",
            );
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { fetchTicketsByAssignmentHistory, loading, error };
};

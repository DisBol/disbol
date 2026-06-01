"use client";

import { useCallback, useEffect, useState } from "react";
import { Datum } from "../interfaces/getcentercost.interface";
import { GetCenterCost } from "../service/getCenterCost";

export function useGetCenterCost() {
	const [data, setData] = useState<Datum[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCenterCosts = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await GetCenterCost();
			setData(response.data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error al cargar centros de costo",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCenterCosts();
	}, [fetchCenterCosts]);

	return {
		data,
		loading,
		error,
		refetch: fetchCenterCosts,
	};
}

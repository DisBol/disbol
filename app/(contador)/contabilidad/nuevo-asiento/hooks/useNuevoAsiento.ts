"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import type { SelectOption } from "@/components/ui/SelecMultipe";
import { GetAccount } from "@/app/(operador)/asignaciones/service/getaccount";
import { useGetAccountingPeriod } from "@/app/(contador)/contabilidad/cierre-periodo/hooks/useGetAccountingPeriod";
import { AddAsiento } from "../services/addasiento";
import { GetAsiento } from "../services/getasiento";
import { GetAsientoByPeriod } from "@/app/(contador)/contabilidad/reportes/service/getAsientoByPeriod";
import type {
    DraftEntry,
    JournalLine,
} from "../interfaces/nuevo-asiento.interface";

const initialEntryDate = "2026-05-31";

export function useNuevoAsiento() {
    const { data: session } = useSession();
    const [journalLines, setJournalLines] = useState<JournalLine[]>([]);
    const [entryDate, setEntryDate] = useState(initialEntryDate);
    const [autoEditLineId, setAutoEditLineId] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState("nuevo");
    const [draftEntries, setDraftEntries] = useState<DraftEntry[]>([]);
    const [draftsLoading, setDraftsLoading] = useState(false);
    const [draftsError, setDraftsError] = useState<string | null>(null);
    const [savingDraft, setSavingDraft] = useState(false);
    const [defaultAccountId, setDefaultAccountId] = useState<number | null>(null);
    const [accountOptions, setAccountOptions] = useState<SelectOption[]>([]);
    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");

    const {
        data: accountingPeriods,
        loading: loadingPeriods,
        error: periodsError,
    } = useGetAccountingPeriod();

    useEffect(() => {
        if (!selectedPeriodId && accountingPeriods.length > 0) {
            setSelectedPeriodId(String(accountingPeriods[0].id));
        }
    }, [accountingPeriods, selectedPeriodId]);

    useEffect(() => {
        if (!selectedPeriodId || selectedTab !== "nuevo") return;

        let active = true;

        const loadLinesForPeriod = async () => {
            try {
                const response = await GetAsientoByPeriod(Number(selectedPeriodId));
                if (!active) return;

                const mappedLines = response.data.map((item) => {
                    let lineDate = entryDate;
                    if (item.created_at) {
                        const d = new Date(item.created_at);
                        if (!isNaN(d.getTime())) {
                            lineDate = d.toISOString().split('T')[0];
                        }
                    }
                    return {
                        id: String(item.id),
                        date: lineDate,
                        accountId: item.Account_id,
                        glosa: item.description,
                        debit: item.amount_debit,
                        credit: item.amount_credit,
                        isNew: false,
                    };
                });

                setJournalLines(mappedLines);
            } catch (error) {
                console.error("Error cargando asientos del período:", error);
            }
        };

        void loadLinesForPeriod();

        return () => {
            active = false;
        };
    }, [selectedPeriodId, entryDate, selectedTab]);

    const loadDrafts = useCallback(async () => {
        try {
            setDraftsLoading(true);
            setDraftsError(null);

            const response = await GetAsiento();

            setDraftEntries(
                response.data
                    .filter((item) => item.state === "borrador" || item.state === null)
                    .map((item) => ({
                        id: String(item.id),
                        description: item.description,
                        active: item.active,
                        amount_credit: item.amount_credit,
                        amount_debit: item.amount_debit,
                        created_at: item.created_at,
                        updated_at: item.updated_at,
                        Account_id: item.Account_id,
                        AccountingPeriod_id: item.AccountingPeriod_id,
                        state: item.state,
                        employee: item.employee,
                    })),
            );
        } catch (error) {
            setDraftsError(
                error instanceof Error ? error.message : "Error al cargar asientos",
            );
        } finally {
            setDraftsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadDrafts();
    }, [loadDrafts]);

    useEffect(() => {
        let active = true;

        const loadAccounts = async () => {
            try {
                const response = await GetAccount("true");

                if (!active) return;

                const options = response.data.map((account) => ({
                    value: String(account.id),
                    label: `${account.code} - ${account.name}`,
                }));

                setAccountOptions(options);

                const firstActiveAccount = response.data.find(
                    (account) => account.active === "true",
                );

                setDefaultAccountId(firstActiveAccount?.id ?? null);
            } catch {
                if (!active) return;

                setDefaultAccountId(null);
            }
        };

        void loadAccounts();

        return () => {
            active = false;
        };
    }, []);

    const addJournalLine = useCallback(() => {
        const nextId = `${Date.now()}-${journalLines.length + 1}`;

        setJournalLines((currentLines) => [
            ...currentLines,
            {
                id: nextId,
                date: entryDate,
                accountId: defaultAccountId,
                glosa: "",
                debit: 0,
                credit: 0,
                isNew: true,
            },
        ]);

        setAutoEditLineId(nextId);
    }, [defaultAccountId, entryDate, journalLines.length]);

    const updateJournalLine = useCallback(
        (id: string, field: keyof Omit<JournalLine, "id">, value: string | number) => {
            setJournalLines((currentLines) =>
                currentLines.map((line) =>
                    line.id === id
                        ? {
                            ...line,
                            [field]: value,
                        }
                        : line,
                ),
            );
        },
        [],
    );

    const removeJournalLine = useCallback((id: string) => {
        setJournalLines((currentLines) =>
            currentLines.filter((line) => line.id !== id),
        );
    }, []);

    const totals = useMemo(() => {
        const newLines = journalLines.filter((line) => line.isNew);
        const debit = newLines.reduce((sum, line) => sum + line.debit, 0);
        const credit = newLines.reduce((sum, line) => sum + line.credit, 0);

        return {
            debit,
            credit,
            balanced: debit === credit,
        };
    }, [journalLines]);

    const getPrimaryAccountId = useCallback(() => {
        return (
            journalLines.find((line) => line.accountId !== null)?.accountId ??
            defaultAccountId
        );
    }, [defaultAccountId, journalLines]);

    const saveDraft = useCallback(async (state: "borrador" | "aprobado" = "borrador") => {
        setSavingDraft(true);

        try {
            const newLines = journalLines.filter((line) => line.isNew);
            if (newLines.length === 0) {
                throw new Error("No hay nuevas líneas añadidas para guardar");
            }

            // Verify all new lines have a valid account selected
            for (const line of newLines) {
                if (line.accountId === null) {
                    throw new Error("Todas las nuevas líneas deben tener una cuenta seleccionada");
                }
            }

            // Execute a POST call for each new line
            for (const line of newLines) {
                await AddAsiento({
                    description: line.glosa.trim() || "Por compra a sofia",
                    amount_credit: line.credit,
                    amount_debit: line.debit,
                    Account_id: line.accountId as number,
                    AccountingPeriod_id: selectedPeriodId ? Number(selectedPeriodId) : 1,
                    state: state,
                    employee: session?.user.employeeId ?? 1,
                });
            }

            await loadDrafts();
            setSelectedTab("borrador");
        } finally {
            setSavingDraft(false);
        }
    }, [journalLines, loadDrafts, session?.user.employeeId, selectedPeriodId]);

    return {
        accountOptions,
        addJournalLine,
        autoEditLineId,
        balanced: totals.balanced,
        creditTotal: totals.credit,
        debitTotal: totals.debit,
        draftEntries,
        draftsError,
        draftsLoading,
        entryDate,
        journalLines,
        removeJournalLine,
        saveDraft,
        savingDraft,
        selectedTab,
        setEntryDate,
        setSelectedTab,
        updateJournalLine,
        selectedPeriodId,
        setSelectedPeriodId,
        accountingPeriods,
        loadingPeriods,
    };
}

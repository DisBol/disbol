"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SelectOption } from "@/components/ui/SelecMultipe";
import { GetAccount } from "@/app/(operador)/asignaciones/service/getaccount";
import { AddAsiento } from "../services/addasiento";
import { GetAsiento } from "../services/getasiento";
import type {
    DraftEntry,
    JournalLine,
} from "../interfaces/nuevo-asiento.interface";

const initialEntryDate = "2026-05-31";

export function useNuevoAsiento() {
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

    const loadDrafts = useCallback(async () => {
        try {
            setDraftsLoading(true);
            setDraftsError(null);

            const response = await GetAsiento();

            setDraftEntries(
                response.data.map((item) => ({
                    id: String(item.id),
                    description: item.description,
                    active: item.active,
                    amount_credit: item.amount_credit,
                    amount_debit: item.amount_debit,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                    Account_id: item.Account_id,
                    AccountingPeriod_id: item.AccountingPeriod_id,
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
        const debit = journalLines.reduce((sum, line) => sum + line.debit, 0);
        const credit = journalLines.reduce((sum, line) => sum + line.credit, 0);

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

    const saveDraft = useCallback(async () => {
        setSavingDraft(true);

        try {
            const accountId = getPrimaryAccountId();

            if (!accountId) {
                throw new Error("No hay una cuenta válida para guardar el asiento");
            }

            await AddAsiento({
                description:
                    journalLines.find((line) => line.glosa.trim())?.glosa ||
                    "Por compra a sofia",
                amount_credit: totals.credit,
                amount_debit: totals.debit,
                Account_id: accountId,
                AccountingPeriod_id: 1,
            });

            await loadDrafts();
            setSelectedTab("borrador");
        } finally {
            setSavingDraft(false);
        }
    }, [getPrimaryAccountId, journalLines, loadDrafts, totals.credit, totals.debit]);

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
    };
}

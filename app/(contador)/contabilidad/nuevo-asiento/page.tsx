"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { BorradoresTab, type DraftEntry } from "./components/BorradoresTab";
import {
  NuevoAsientoTab,
  type JournalLine,
} from "./components/NuevoAsientoTab";
import { AddAsiento } from "./services/addasiento";
import { GetAccount } from "@/app/(operador)/asignaciones/service/getaccount";
import { GetAsiento } from "./services/getasiento";

const initialLines: JournalLine[] = [];

export default function Page() {
  const [journalLines, setJournalLines] = useState<JournalLine[]>(initialLines);
  const [entryDate, setEntryDate] = useState("2026-05-31");
  const [autoEditLineId, setAutoEditLineId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("nuevo");
  const [draftEntries, setDraftEntries] = useState<DraftEntry[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(false);
  const [draftsError, setDraftsError] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [defaultAccountId, setDefaultAccountId] = useState<number | null>(null);

  const getPrimaryAccountId = () => {
    return defaultAccountId;
  };

  const addJournalLine = () => {
    const nextId = `${Date.now()}-${journalLines.length + 1}`;

    setJournalLines((currentLines) => [
      ...currentLines,
      {
        id: nextId,
        date: entryDate,
        account: "",
        glosa: "",
        debit: 0,
        credit: 0,
      },
    ]);

    setAutoEditLineId(nextId);
  };

  const updateJournalLine = (
    id: string,
    field: keyof Omit<JournalLine, "id">,
    value: string | number,
  ) => {
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
  };

  const removeJournalLine = (id: string) => {
    setJournalLines((currentLines) =>
      currentLines.filter((line) => line.id !== id),
    );
  };

  const saveDraft = async () => {
    try {
      setSavingDraft(true);

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
  };

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

  const totals = useMemo(() => {
    const debit = journalLines.reduce((sum, line) => sum + line.debit, 0);
    const credit = journalLines.reduce((sum, line) => sum + line.credit, 0);

    return {
      debit,
      credit,
      balanced: debit === credit,
    };
  }, [journalLines]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-350 px-4 py-5 lg:px-6 lg:py-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 3h7l5 5v13H7z" />
                <path d="M14 3v5h5" />
                <path d="M9 13h6" />
                <path d="M9 17h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-primary md:text-[1.7rem]">
                Registro de Asientos
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Captura, revisa y aprueba asientos contables en un solo flujo.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="rounded-xl bg-violet-500 text-white hover:bg-violet-600"
          >
            Reporte Diario
          </Button>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-0">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="px-4 pt-4 lg:px-6"
            >
              <TabsList variant="underlined" fullWidth className="gap-6">
                <TabsTrigger value="nuevo" variant="underlined" size="md">
                  <span className="flex items-center gap-2">
                    <span className="text-lg leading-none">+</span>
                    Nuevo Asiento
                  </span>
                </TabsTrigger>
                <TabsTrigger value="borrador" variant="underlined" size="md">
                  <span className="flex items-center gap-2">
                    <span className="text-lg leading-none">◔</span>
                    Asientos en Borrador ({draftEntries.length})
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nuevo" animation="none" className="mt-0">
                <NuevoAsientoTab
                  journalLines={journalLines}
                  entryDate={entryDate}
                  autoEditLineId={autoEditLineId}
                  debitTotal={totals.debit}
                  creditTotal={totals.credit}
                  balanced={totals.balanced}
                  onEntryDateChange={setEntryDate}
                  onAddLine={addJournalLine}
                  onUpdateLine={updateJournalLine}
                  onRemoveLine={removeJournalLine}
                  onSaveDraft={saveDraft}
                  savingDraft={savingDraft}
                />
              </TabsContent>

              <TabsContent value="borrador" animation="none" className="mt-0">
                <BorradoresTab
                  entries={draftEntries}
                  loading={draftsLoading}
                  error={draftsError}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

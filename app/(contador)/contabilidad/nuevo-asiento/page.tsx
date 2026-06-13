"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { BorradoresTab } from "./components/BorradoresTab";
import { NuevoAsientoTab } from "./components/NuevoAsientoTab";
import { useNuevoAsiento } from "./hooks/useNuevoAsiento";

export default function Page() {
  const {
    accountOptions,
    addJournalLine,
    autoEditLineId,
    balanced,
    creditTotal,
    debitTotal,
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
  } = useNuevoAsiento();

  const filteredDraftsCount = useMemo(() => {
    return draftEntries.filter(
      (entry) => String(entry.AccountingPeriod_id) === selectedPeriodId,
    ).length;
  }, [draftEntries, selectedPeriodId]);

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
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
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
                Asientos en Borrador ({filteredDraftsCount})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nuevo" animation="none" className="mt-0">
            <NuevoAsientoTab
              journalLines={journalLines}
              selectedPeriodId={selectedPeriodId}
              onPeriodChange={setSelectedPeriodId}
              accountingPeriods={accountingPeriods}
              loadingPeriods={loadingPeriods}
              autoEditLineId={autoEditLineId}
              accountOptions={accountOptions}
              debitTotal={debitTotal}
              creditTotal={creditTotal}
              balanced={balanced}
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
              selectedPeriodId={selectedPeriodId}
              onPeriodChange={setSelectedPeriodId}
              accountingPeriods={accountingPeriods}
              loadingPeriods={loadingPeriods}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

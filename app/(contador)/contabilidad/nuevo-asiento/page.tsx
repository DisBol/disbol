"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { BorradoresTab, type DraftEntry } from "./components/BorradoresTab";
import {
  NuevoAsientoTab,
  type JournalLine,
} from "./components/NuevoAsientoTab";

const initialLines: JournalLine[] = [
  {
    id: "1",
    date: "2026-05-22",
    account: "1.1",
    glosa: "Registro inicial de caja",
    debit: 1000,
    credit: 0,
  },
  {
    id: "2",
    date: "2026-05-22",
    account: "4.1",
    glosa: "Reconocimiento de venta",
    debit: 0,
    credit: 1000,
  },
];

const draftEntries: DraftEntry[] = [
  {
    id: "1",
    fecha: "22/05/2026",
    descripcion: "Pago de servicios",
    total: "Bs 480,00",
    estado: "Borrador",
  },
  {
    id: "2",
    fecha: "21/05/2026",
    descripcion: "Compra de insumos",
    total: "Bs 1.250,00",
    estado: "Borrador",
  },
  {
    id: "3",
    fecha: "20/05/2026",
    descripcion: "Asiento de ajuste",
    total: "Bs 320,00",
    estado: "Borrador",
  },
];

export default function Page() {
  const [journalLines] = useState<JournalLine[]>(initialLines);
  const [selectedTab, setSelectedTab] = useState("nuevo");

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
                    Asientos en Borrador (7)
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nuevo" animation="none" className="mt-0">
                <NuevoAsientoTab
                  journalLines={journalLines}
                  debitTotal={totals.debit}
                  creditTotal={totals.credit}
                  balanced={totals.balanced}
                />
              </TabsContent>

              <TabsContent value="borrador" animation="none" className="mt-0">
                <BorradoresTab entries={draftEntries} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

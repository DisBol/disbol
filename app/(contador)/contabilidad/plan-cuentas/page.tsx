"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select as MultiSelect } from "@/components/ui/SelecMultipe";
import { AccountForm, type AccountFormState } from "./components/AccountForm";
import {
  AccountTree,
  type AccountGroup,
  type AccountItem,
} from "./components/AccountTree";

const accountGroups: AccountGroup[] = [
  {
    title: "Activo",
    items: [
      {
        id: "1",
        code: "1.1",
        name: "Caja",
        type: "Activo",
        center: "General",
        currency: "BOB",
        level: "General",
        status: "Activo",
      },
      {
        id: "2",
        code: "1.2",
        name: "Bancos",
        type: "Activo",
        center: "Tesorería",
        currency: "BOB",
        level: "General",
        status: "Activo",
      },
    ],
  },
  {
    title: "Ingreso",
    items: [
      {
        id: "3",
        code: "4.1",
        name: "Ventas",
        type: "Ingreso",
        center: "General",
        currency: "BOB",
        level: "General",
        status: "Activo",
      },
      {
        id: "4",
        code: "4.2",
        name: "Servicios",
        type: "Ingreso",
        center: "Comercial",
        currency: "BOB",
        level: "General",
        status: "Activo",
      },
    ],
  },
  {
    title: "Gasto",
    items: [
      {
        id: "5",
        code: "5.1",
        name: "Costos de Ventas",
        type: "Gasto",
        center: "Producción",
        currency: "BOB",
        level: "General",
        status: "Activo",
      },
      {
        id: "6",
        code: "6.1",
        name: "Sueldos y Salarios",
        type: "Gasto",
        center: "General",
        currency: "BOB",
        level: "General",
        status: "Activo",
      },
    ],
  },
  {
    title: "Pasivo",
    items: [
      {
        id: "7",
        code: "2.1",
        name: "Proveedores",
        type: "Pasivo",
        center: "General",
        currency: "BOB",
        level: "General",
        status: "Activo",
      },
    ],
  },
  {
    title: "Patrimonio",
    items: [
      {
        id: "8",
        code: "3.1",
        name: "Capital Social",
        type: "Patrimonio",
        center: "General",
        currency: "BOB",
        level: "General",
        status: "Activo",
      },
    ],
  },
];

const typeOptions = [
  { value: "todos", label: "Todos los tipos" },
  { value: "Activo", label: "Activo" },
  { value: "Pasivo", label: "Pasivo" },
  { value: "Patrimonio", label: "Patrimonio" },
  { value: "Ingreso", label: "Ingreso" },
  { value: "Gasto", label: "Gasto" },
];

const centerOptions = [
  { value: "todos", label: "Todos los centros" },
  { value: "General", label: "General" },
  { value: "Tesorería", label: "Tesorería" },
  { value: "Comercial", label: "Comercial" },
  { value: "Producción", label: "Producción" },
];

const levelOptions = [
  { value: "General", label: "General" },
  { value: "Detalle", label: "Detalle" },
  { value: "Analítica", label: "Analítica" },
];

const currencyOptions = [
  { value: "BOB", label: "BOB" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const formDefaults: AccountFormState = {
  code: "",
  name: "",
  type: "Activo",
  level: "General",
  currency: "BOB",
};

const accountToForm = (account: AccountItem): AccountFormState => ({
  code: account.code,
  name: account.name,
  type: account.type,
  level: account.level,
  currency: account.currency,
});

export default function PlanCuentasPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [centerFilter, setCenterFilter] = useState("todos");
  const [selectedId, setSelectedId] = useState(accountGroups[0].items[0].id);
  const [form, setForm] = useState(accountToForm(accountGroups[0].items[0]));

  const filteredGroups = useMemo(
    () =>
      accountGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            const matchesSearch =
              `${item.code} ${item.name}`
                .toLowerCase()
                .includes(search.toLowerCase()) || search.trim() === "";
            const matchesType =
              typeFilter === "todos" || item.type === typeFilter;
            const matchesCenter =
              centerFilter === "todos" || item.center === centerFilter;

            return matchesSearch && matchesType && matchesCenter;
          }),
        }))
        .filter((group) => group.items.length > 0),
    [centerFilter, search, typeFilter],
  );

  const handleSelectAccount = (account: AccountItem) => {
    setSelectedId(account.id);
    setForm(accountToForm(account));
  };

  const handleClear = () => {
    setSelectedId("");
    setForm(formDefaults);
  };

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-2 lg:px-6 lg:py-4">
        <div className="mb-2">
          <h1 className="text-xl font-bold tracking-tight text-primary md:text-[1.7rem]">
            Plan de Cuentas
          </h1>
        </div>

        <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_140px_140px]">
          <div className="relative">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o código"
              className="h-10 rounded-lg bg-white pl-10 text-sm"
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </div>

          <MultiSelect
            options={typeOptions}
            selectedValues={[typeFilter]}
            onSelect={(option) => setTypeFilter(option.value)}
            placeholder="Todos los tipos"
            size="sm"
            radius="md"
            closeOnSelect
            className="rounded-lg"
          />

          <MultiSelect
            options={centerOptions}
            selectedValues={[centerFilter]}
            onSelect={(option) => setCenterFilter(option.value)}
            placeholder="Todos los centros"
            size="sm"
            radius="md"
            closeOnSelect
            className="rounded-lg"
          />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <AccountTree
            groups={filteredGroups}
            selectedId={selectedId}
            onSelectAccount={handleSelectAccount}
          />

          <AccountForm
            value={form}
            typeOptions={typeOptions.slice(1)}
            levelOptions={levelOptions}
            currencyOptions={currencyOptions}
            onChange={setForm}
            onSave={() => undefined}
            onClear={handleClear}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select as MultiSelect } from "@/components/ui/SelecMultipe";
import { AccountForm, type AccountFormState } from "./components/AccountForm";
import { useAddAccount } from "./hooks/useAddAccount";
import { useGetAccount } from "./hooks/useGetAccount";
import { useGetElements } from "./hooks/useGetElements";
import { useGetCenterCost } from "./hooks/useGetCenterCost";
import { useUpdateAccount } from "./hooks/useUpdateAccount";
import {
  AccountTree,
  type AccountGroup,
  type AccountItem,
} from "./components/AccountTree";

const currencyOptions = [
  { value: "BOB", label: "BOB" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const accountToForm = (account: AccountItem): AccountFormState => ({
  code: account.code,
  name: account.name,
  type: String(account.elementsId),
  level: String(account.centerCostId),
  currency: account.currency || "",
});

export default function PlanCuentasPage() {
  const { data: accounts, refetch: refetchAccounts } = useGetAccount();
  const { data: elements } = useGetElements();
  const { data: centerCosts } = useGetCenterCost();
  const { addAccount, loading: addingAccount } = useAddAccount();
  const { updateAccount, loading: updatingAccount } = useUpdateAccount();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [centerFilter, setCenterFilter] = useState("todos");
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState<AccountFormState>({
    code: "",
    name: "",
    type: "",
    level: "",
    currency: "",
  });

  const accountTypeOptions = useMemo(
    () =>
      elements.map((element) => ({
        value: String(element.id),
        label: element.name,
      })),
    [elements],
  );

  const levelOptions = useMemo(
    () =>
      centerCosts.map((centerCost) => ({
        value: String(centerCost.id),
        label: centerCost.name,
      })),
    [centerCosts],
  );

  const elementNameById = useMemo(
    () => new Map(elements.map((element) => [element.id, element.name])),
    [elements],
  );

  const centerNameById = useMemo(
    () =>
      new Map(
        centerCosts.map((centerCost) => [centerCost.id, centerCost.name]),
      ),
    [centerCosts],
  );

  const typeFilterOptions = useMemo(
    () => [
      { value: "todos", label: "Todos los elementos" },
      ...accountTypeOptions,
    ],
    [accountTypeOptions],
  );

  const centerOptions = useMemo(
    () => [{ value: "todos", label: "Todos los centros" }, ...levelOptions],
    [levelOptions],
  );

  const savingAccount = addingAccount || updatingAccount;

  const accountGroups = useMemo(() => {
    return accounts.reduce((groups, account) => {
      const title =
        elementNameById.get(account.Elements_id) ??
        `Elemento ${account.Elements_id}`;
      const centerName =
        centerNameById.get(account.CenterCost_id) ??
        `Centro ${account.CenterCost_id}`;
      const item: AccountItem = {
        id: String(account.id),
        code: account.code,
        name: account.name,
        center: centerName,
        currency: account.money_type || "",
        status: account.active,
        elementsId: account.Elements_id,
        centerCostId: account.CenterCost_id,
      };

      const existingGroup = groups.find((group) => group.title === title);
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        groups.push({ title, items: [item] });
      }

      return groups;
    }, [] as AccountGroup[]);
  }, [accounts, centerNameById, elementNameById]);

  const filteredGroups = useMemo(
    () =>
      accountGroups
        .filter((group) => {
          if (typeFilter === "todos") return true;

          const selectedTypeName = elementNameById.get(Number(typeFilter));
          return group.title === selectedTypeName;
        })
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            const matchesSearch =
              `${item.code} ${item.name}`
                .toLowerCase()
                .includes(search.toLowerCase()) || search.trim() === "";
            const matchesCenter =
              centerFilter === "todos" || item.center === centerFilter;

            return matchesSearch && matchesCenter;
          }),
        }))
        .filter((group) => group.items.length > 0),
    [accountGroups, centerFilter, elementNameById, search, typeFilter],
  );

  const handleSelectAccount = (account: AccountItem) => {
    setSelectedId(account.id);
    setForm(accountToForm(account));
  };

  const handleClear = () => {
    setSelectedId("");
    setForm({
      code: "",
      name: "",
      type: "",
      level: "",
      currency: "",
    });
  };

  const handleSaveAccount = async () => {
    const resolvedElement = accountTypeOptions.find(
      (option) => option.value === form.type || option.label === form.type,
    );

    const resolvedCenterCost = levelOptions.find(
      (option) => option.value === form.level || option.label === form.level,
    );

    const resolvedCurrency = currencyOptions.find(
      (option) =>
        option.value === form.currency || option.label === form.currency,
    );

    if (!resolvedElement || !resolvedCenterCost || !resolvedCurrency) {
      return;
    }

    const payload = {
      name: form.name,
      active: "true",
      code: form.code,
      CenterCost_id: Number(resolvedCenterCost.value),
      Elements_id: Number(resolvedElement.value),
      money_type: resolvedCurrency.value,
    };

    if (selectedId) {
      await updateAccount({
        id: Number(selectedId),
        ...payload,
      });
      alert("Cuenta editada correctamente");
    } else {
      await addAccount(payload);
      alert("Cuenta guardada correctamente");
    }

    await refetchAccounts();
    handleClear();
  };

  const handleDeactivateAccount = async (account: AccountItem) => {
    const resolvedElement = accountTypeOptions.find(
      (option) => option.value === String(account.elementsId),
    );

    const resolvedCenterCost = levelOptions.find(
      (option) => option.value === String(account.centerCostId),
    );

    if (!resolvedElement || !resolvedCenterCost) {
      return;
    }

    await updateAccount({
      id: Number(account.id),
      name: account.name,
      active: "false",
      code: account.code,
      CenterCost_id: Number(resolvedCenterCost.value),
      Elements_id: Number(resolvedElement.value),
      money_type: account.currency || "",
    });

    await refetchAccounts();
    alert("Cuenta desactivada correctamente");
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
            options={typeFilterOptions}
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
            onDeactivateAccount={handleDeactivateAccount}
          />

          <AccountForm
            value={form}
            typeOptions={accountTypeOptions}
            levelOptions={levelOptions}
            currencyOptions={currencyOptions}
            onChange={setForm}
            onSave={handleSaveAccount}
            onClear={handleClear}
            saving={savingAccount}
          />
        </div>
      </div>
    </div>
  );
}

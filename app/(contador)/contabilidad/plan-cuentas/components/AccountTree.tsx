"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EditIcon } from "@/components/icons/EditIcon2";

export type AccountItem = {
  id: string;
  code: string;
  name: string;
  type: string;
  center: string;
  currency: string;
  level: string;
  status: string;
};

export type AccountGroup = {
  title: string;
  items: AccountItem[];
};

interface AccountTreeProps {
  groups: AccountGroup[];
  selectedId: string;
  onSelectAccount: (account: AccountItem) => void;
}

export function AccountTree({
  groups,
  selectedId,
  onSelectAccount,
}: AccountTreeProps) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardContent className="p-0">
        <div className="border-b border-slate-200 px-5 py-3">
          <h2 className="text-base font-semibold text-slate-900">
            Árbol jerárquico de cuentas
          </h2>
        </div>

        <div className="max-h-120 overflow-y-auto px-5 py-3.5">
          {groups.map((group) => (
            <section key={group.title} className="mb-4 last:mb-0">
              <h3 className="mb-2 text-sm font-bold text-primary">
                {group.title}
              </h3>

              <div className="space-y-2.5 pl-4">
                {group.items.map((account) => {
                  const isSelected = account.id === selectedId;

                  return (
                    <article
                      key={account.id}
                      className={`grid items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition lg:grid-cols-[minmax(0,1fr)_auto] ${
                        isSelected
                          ? "border-primary/40 bg-primary/5"
                          : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectAccount(account)}
                        className="min-w-0 text-left"
                      >
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="text-base font-semibold text-slate-900">
                            {account.code}
                          </span>
                          <span className="text-base text-slate-900">
                            - {account.name}
                          </span>
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {account.currency} · {account.level} ·{" "}
                          {account.center}
                        </div>
                      </button>

                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          leftIcon={<EditIcon size={16} />}
                          onClick={() => onSelectAccount(account)}
                          className="rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          className="rounded-md"
                        >
                          Desactivar
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          {groups.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              No se encontraron cuentas con esos filtros.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

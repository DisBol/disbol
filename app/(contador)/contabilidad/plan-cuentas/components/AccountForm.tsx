"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select as MultiSelect } from "@/components/ui/SelecMultipe";
import { SaveIcon } from "@/components/icons/Save";
import { CloseRoundedIcon } from "@/components/icons/CloseRoundedIcon";

export type AccountFormState = {
  code: string;
  name: string;
  type: string;
  level: string;
  currency: string;
};

type SelectOption = {
  value: string;
  label: string;
};

interface AccountFormProps {
  value: AccountFormState;
  typeOptions: SelectOption[];
  levelOptions: SelectOption[];
  currencyOptions: SelectOption[];
  onChange: (nextValue: AccountFormState) => void;
  onSave: () => void;
  onClear: () => void;
}

export function AccountForm({
  value,
  typeOptions,
  levelOptions,
  currencyOptions,
  onChange,
  onSave,
  onClear,
}: AccountFormProps) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardContent className="p-0">
        <div className="border-b border-slate-200 px-4 py-3.5">
          <h2 className="text-sm font-semibold text-slate-900">
            Crear / Editar Cuenta
          </h2>
        </div>

        <form className="space-y-2 px-4 py-3.5">
          <Input
            value={value.code}
            onChange={(event) =>
              onChange({ ...value, code: event.target.value })
            }
            placeholder="Código (ej. 1.1.01)"
            className="h-9 rounded-md bg-white text-sm"
          />

          <Input
            value={value.name}
            onChange={(event) =>
              onChange({ ...value, name: event.target.value })
            }
            placeholder="Nombre de cuenta"
            className="h-9 rounded-md bg-white text-sm"
          />

          <MultiSelect
            options={typeOptions}
            selectedValues={[value.type]}
            onSelect={(option) => onChange({ ...value, type: option.value })}
            size="sm"
            radius="md"
            closeOnSelect
            className="rounded-md"
          />

          <MultiSelect
            options={levelOptions}
            selectedValues={[value.level]}
            onSelect={(option) => onChange({ ...value, level: option.value })}
            size="sm"
            radius="md"
            closeOnSelect
            className="rounded-md"
          />

          <MultiSelect
            options={currencyOptions}
            selectedValues={[value.currency]}
            onSelect={(option) =>
              onChange({ ...value, currency: option.value })
            }
            size="sm"
            radius="md"
            closeOnSelect
            className="rounded-md"
          />

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              leftIcon={<SaveIcon size={16} />}
              size="sm"
              onClick={onSave}
              className="rounded-md"
            >
              Guardar
            </Button>

            <Button
              type="button"
              variant="danger"
              leftIcon={<CloseRoundedIcon size={16} />}
              onClick={onClear}
              size="sm"
              className="rounded-md"
            >
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

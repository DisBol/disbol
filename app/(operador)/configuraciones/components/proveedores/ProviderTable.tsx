"use client";
import { DeleteIcon } from "../../../../../components/icons/DeleteIcon";
import { EditIcon } from "../../../../../components/icons/EditIcon2";
import { Chip } from "../../../../../components/ui/Chip";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../../../../components/ui/Table";
import {
  ProviderView,
  useCategoryProvider,
} from "../../hooks/proveedores/useCategoryprovider";
import { useUpdateProvider } from "../../hooks/proveedores/useUpdateProvider";

interface ProviderTableProps {
  onEdit?: (provider: ProviderView) => void;
}

export default function ProviderCard({ onEdit }: ProviderTableProps) {
  const { providers, loading, error } = useCategoryProvider();
  const { updateProvider } = useUpdateProvider();

  const handleDeactivate = async (id: number, name: string) => {
    if (confirm("¿Estás seguro de que deseas desactivar este proveedor?")) {
      await updateProvider(id, name, "false");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error...</div>;
  return (
    <div className="w-full">
      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block overflow-x-auto">
        <TableWrapper className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Nombre</TableHead>
                <TableHead className="text-xs sm:text-sm">Grupos</TableHead>
                <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((proveedor) => (
                <TableRow key={proveedor.id} className="group">
                  <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">
                    {proveedor.nombre}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2 flex-wrap">
                      {proveedor.grupos.map((grupo, idx) => (
                        <Chip
                          key={idx}
                          size="sm"
                          radius="sm"
                          color="danger"
                          variant="flat"
                          className="text-xs"
                        >
                          {grupo.name}
                        </Chip>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      size="sm"
                      color={
                        proveedor.estado === "Activo" ? "success" : "default"
                      }
                      className="text-xs"
                    >
                      {proveedor.estado}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit?.(proveedor)}
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                      >
                        <EditIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeactivate(proveedor.id, proveedor.nombre)
                        }
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <DeleteIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="md:hidden space-y-3">
        {providers.map((proveedor) => (
          <div
            key={proveedor.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium">Nombre</p>
                <p className="font-medium text-gray-900 text-sm">
                  {proveedor.nombre}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit?.(proveedor)}
                  className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    handleDeactivate(proveedor.id, proveedor.nombre)
                  }
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">Grupos</p>
              <div className="flex gap-1 flex-wrap">
                {proveedor.grupos.map((grupo, idx) => (
                  <Chip
                    key={idx}
                    size="sm"
                    radius="sm"
                    color="danger"
                    variant="flat"
                    className="text-xs"
                  >
                    {grupo.name}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">Estado</p>
              <Chip
                variant="flat"
                size="sm"
                color={proveedor.estado === "Activo" ? "success" : "default"}
                className="text-xs"
              >
                {proveedor.estado}
              </Chip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

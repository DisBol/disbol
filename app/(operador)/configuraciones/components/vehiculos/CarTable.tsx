"use client";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { Chip } from "@/components/ui/Chip";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { useCar } from "../../hooks/vehiculos/useCar";
import { useUpdateCar } from "../../hooks/vehiculos/useUpdateCar";

interface ProviderTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit?: (provider: any) => void;
  onRefresh?: () => void;
}

export default function ProviderCard({
  onEdit,
  onRefresh,
}: ProviderTableProps) {
  const { cars, isLoading } = useCar();
  const { updateCar } = useUpdateCar();

  const handleDeactivate = async (car: any) => {
    if (confirm(`¿Estás seguro de que deseas eliminar ${car.name}?`)) {
      await updateCar(car.id, car.name, car.idCar, car.license, "false");
      if (onRefresh) {
        onRefresh();
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Cargando vehículos...</div>;
  }

  return (
    <div className="w-full">
      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block overflow-x-auto">
        <TableWrapper className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">ID</TableHead>
                <TableHead className="text-xs sm:text-sm">Placa</TableHead>
                <TableHead className="text-xs sm:text-sm">Nombre</TableHead>
                <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow key={car.id} className="group">
                  <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">
                    {car.idCar}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">
                    {car.license}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-gray-700">
                    {car.name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      size="sm"
                      color={car.active === "true" ? "success" : "danger"}
                      className="text-xs"
                    >
                      {car.active === "true" ? "Activo" : "Inactivo"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit?.(car)}
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                      >
                        <EditIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDeactivate(car)}
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
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium">ID</p>
                <p className="font-medium text-gray-900 text-sm">{car.idCar}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit?.(car)}
                  className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeactivate(car)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Placa</p>
              <p className="text-sm text-gray-700">{car.license}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Nombre</p>
              <p className="text-sm text-gray-700">{car.name}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">Estado</p>
              <Chip
                variant="flat"
                size="sm"
                color={car.active === "true" ? "success" : "danger"}
                className="text-xs"
              >
                {car.active === "true" ? "Activo" : "Inactivo"}
              </Chip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

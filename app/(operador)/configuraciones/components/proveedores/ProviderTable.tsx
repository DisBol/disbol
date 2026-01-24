"use client";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { EditIcon } from "@/components/icons/Editicon";
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
import { useCategoryProvider } from "../../hooks/useCategoryprovider";

export default function ProviderCard() {
    const { providers, loading, error } = useCategoryProvider();
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error...</div>;
    return (
        <TableWrapper>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Grupos</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {providers.map((proveedor, index) => (
                        <TableRow key={index} className="group">
                            <TableCell className="font-medium text-gray-900">
                                {proveedor.nombre}
                            </TableCell>

                            <TableCell>
                                <div className="flex gap-2 flex-wrap">
                                    {proveedor.grupos.map((grupo, idx) => (
                                        <Chip
                                            key={idx}
                                            size="sm"
                                            radius="sm"
                                            color="danger"
                                            variant="flat"
                                        >
                                            {grupo}
                                        </Chip>
                                    ))}
                                </div>
                            </TableCell>

                            <TableCell>
                                <Chip
                                    variant="flat"
                                    size="sm"
                                    color={proveedor.estado === "Activo" ? "success" : "default"}
                                >
                                    {proveedor.estado}
                                </Chip>
                            </TableCell>

                            <TableCell>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors">
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                        <DeleteIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableWrapper>
    );
}
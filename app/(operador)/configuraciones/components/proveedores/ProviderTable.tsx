import { Box1Icon } from "@/components/icons/Box1Icon";
import { BoxOutline2Icon } from "@/components/icons/BoxOutline2";
import { BoxOutlineIcon } from "@/components/icons/BoxOutlineIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { EditIcon } from "@/components/icons/Editicon";
import { TruckIcon } from "@/components/icons/TruckIcon";
import { User16Icon } from "@/components/icons/User16Icon";

export default function ProviderCard() {
    const proveedores = [
        {
            nombre: "Avicola Sofía",
            grupos: ["POLLO SOFÍA"],
            estado: "Activo",
        },
        {
            nombre: "PIO / IMBA",
            grupos: ["OTROS SOFÍA", "PROCESADOS"],
            estado: "Activo",
        },
    ];

    const tabsConfig = [
        { id: "proveedores", label: "Proveedores", icon: BoxOutlineIcon },
        { id: "productos", label: "Productos", icon: Box1Icon },
        { id: "clientes", label: "Clientes", icon: User16Icon },
        { id: "vehiculos", label: "Vehículos", icon: TruckIcon },
        { id: "contenedores", label: "Contenedores", icon: BoxOutline2Icon },
        { id: "usuarios", label: "Usuarios", icon: User16Icon },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Grupos
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {proveedores.map((proveedor, index) => (
                        <tr
                            key={index}
                            className="hover:bg-gray-50/80 transition-colors group"
                        >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {proveedor.nombre}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2 flex-wrap">
                                    {proveedor.grupos.map((grupo, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-0.5 bg-pink-50 text-pink-700 rounded-md text-xs font-medium border border-pink-100"
                                        >
                                            {grupo}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
                                    {proveedor.estado}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors">
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                        <DeleteIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

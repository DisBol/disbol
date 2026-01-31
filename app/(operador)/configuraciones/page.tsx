import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Box1Icon } from "@/components/icons/Box1Icon";
import { BoxOutline2Icon } from "@/components/icons/BoxOutline2";
import { BoxOutlineIcon } from "@/components/icons/BoxOutlineIcon";
import { TruckIcon } from "@/components/icons/TruckIcon";
import { User16Icon } from "@/components/icons/User16Icon";
import Products from "./components/productos/Products";
import Providers from "./components/proveedores/Providers";
import Clients from "./components/clientes/Clients";
import Cars from "./components/vehiculos/Car";
import Containers from "./components/contenedores/Container";
import Users from "./components/usuarios/Users";
export default function Configuracion() {
  const tabsConfig = [
    { id: "proveedores", label: "Proveedores", icon: BoxOutlineIcon },
    { id: "productos", label: "Productos", icon: Box1Icon },
    { id: "clientes", label: "Clientes", icon: User16Icon },
    { id: "vehiculos", label: "Vehículos", icon: TruckIcon },
    { id: "contenedores", label: "Contenedores", icon: BoxOutline2Icon },
    { id: "usuarios", label: "Usuarios", icon: User16Icon },
  ];

  return (
    <div className="bg-gray-50 p-3 md:p-6">
      <Tabs defaultValue="proveedores">
        <TabsList
          variant="solid"
          className="w-full md:w-auto flex-wrap md:flex-nowrap justify-start md:justify-center"
        >
          {tabsConfig.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              variant="solid"
              size="md"
              className="gap-2 flex-1 md:flex-none min-w-max"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="proveedores" animation="slide">
          <Providers />
        </TabsContent>

        <TabsContent value="productos" animation="slide">
          <Products />
        </TabsContent>

        <TabsContent value="clientes" animation="slide">
          <Clients />
        </TabsContent>

        <TabsContent value="vehiculos" animation="slide">
          <Cars />
        </TabsContent>

        <TabsContent value="contenedores" animation="slide">
          <Containers />
        </TabsContent>

        <TabsContent value="usuarios" animation="slide">
          <Users />
        </TabsContent>
      </Tabs>
    </div>
  );
}

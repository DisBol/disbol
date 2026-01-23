import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Box1Icon } from "@/components/icons/Box1Icon";
import { BoxOutline2Icon } from "@/components/icons/BoxOutline2";
import { BoxOutlineIcon } from "@/components/icons/BoxOutlineIcon";
import { TruckIcon } from "@/components/icons/TruckIcon";
import { User16Icon } from "@/components/icons/User16Icon";
import Products from "./components/productos/Products";
import Providers from "./components/proveedores/Providers";
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
    <div className="bg-gray-50  p-6">
      <Tabs defaultValue="proveedores">
        <TabsList variant="solid">
          {tabsConfig.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              variant="solid"
              size="md"
              className="gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="proveedores" animation="slide">
          <Providers />
        </TabsContent>


        <TabsContent value="productos" animation="slide">
          <Products />
        </TabsContent>
      </Tabs>
    </div>
  );
}

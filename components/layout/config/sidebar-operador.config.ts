import { CarOutlineIcon } from "@/components/icons/CarOutlineIcon";
import { BoxIcon } from "@/components/icons/BoxIcon";
import { SettingIcon } from "@/components/icons/SettingIcon";
import { DashboardOutlineRoundedIcon } from "@/components/icons/DashboardOutlineRoundedIcon";
import { LogoutRoundedIcon } from "@/components/icons/LogoutRounded";
import { PinOutlineIcon } from "@/components/icons/PinOutlineIcon";
import { ShoppingCartIcon } from "@/components/icons/ShoppingCart";

interface SidebarMenuItem {
  label: string;
  href?: string;
  icon: React.ElementType;
}

interface SidebarMenu {
  main: SidebarMenuItem[];
  footer: SidebarMenuItem[];
}

export const sidebarOperadorMenu: SidebarMenu = {
  main: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: DashboardOutlineRoundedIcon,
    },
    {
      label: "Solicitudes",
      href: "/solicitudes",
      icon: ShoppingCartIcon,
    },
    {
      label: "Asignaciones",
      href: "/asignaciones",
      icon: CarOutlineIcon,
    },
    {
      label: "Seguimiento",
      href: "/seguimiento",
      icon: PinOutlineIcon,
    },
    {
      label: "Canastos",
      href: "/canastos",
      icon: BoxIcon,
    },
  ],
  footer: [
    {
      label: "Configuración",
      href: "/configuraciones",
      icon: SettingIcon,
    },
    {
      label: "Cerrar sesión",
      icon: LogoutRoundedIcon,
      // No href - se maneja con onClick en Sidebar.tsx
    },
  ],
};

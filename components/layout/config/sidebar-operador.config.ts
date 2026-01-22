import { CarOutlineIcon } from "@/components/icons/CarOutlineIcon";
import { BoxIcon } from "@/components/icons/BoxIcon";
import { SettingIcon } from "@/components/icons/SettingIcon";
import { DashboardOutlineRoundedIcon } from "@/components/icons/DashboardOutlineRoundedIcon";
import { LogoutRoundedIcon } from "@/components/icons/LogoutRounded";
import { PinOutlineIcon } from "@/components/icons/PinOutlineIcon";
import { ShoppingCartIcon } from "@/components/icons/ShoppingCart";

export const sidebarOperadorMenu = {
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
      href: "configuracion",
      icon: SettingIcon,
    },
    {
      label: "Cerrar sesión",
      href: "/logout",
      icon: LogoutRoundedIcon,
    },
  ],
};

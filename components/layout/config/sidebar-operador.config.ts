import { AsignacionesIcon } from "@/components/icons/AsignacionesIcon";
import { CanastoIcon } from "@/components/icons/CanastoIcon";
import { ConfigIcon } from "@/components/icons/ConfigIcon";
import { DashboardIcon } from "@/components/icons/DashboardIcon";
import { LogoutRoundedIcon } from "@/components/icons/LogoutRounded";
import { SeguimientoIcon } from "@/components/icons/SeguimientoIcon";
import { ShoppingCartIcon } from "@/components/icons/ShoppingCart";

export const sidebarOperadorMenu = {
  main: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: DashboardIcon,
    },
    {
      label: "Solicitudes",
      href: "/solicitudes",
      icon: ShoppingCartIcon,
    },
    {
      label: "Asignaciones",
      href: "/asignaciones",
      icon: AsignacionesIcon,
    },
    {
      label: "Seguimiento",
      href: "/seguimiento",
      icon: SeguimientoIcon,
    },
    {
      label: "Canastos",
      href: "/canastos",
      icon: CanastoIcon,
    },
  ],
  footer: [
    {
      label: "Configuración",
      href: "configuracion",
      icon: ConfigIcon,
    },
    {
      label: "Cerrar sesión",
      href: "/logout",
      icon: LogoutRoundedIcon,
    },
  ],
};

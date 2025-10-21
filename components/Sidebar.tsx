import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiChartPie, HiUsers, HiAcademicCap, HiClipboardList, HiUserGroup, HiOfficeBuilding, HiBookOpen, HiCollection, HiCreditCard, HiAnnotation } from "react-icons/hi";

export default function AppSidebar() {
  return (
    <Sidebar aria-label="Application sidebar">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="/" icon={HiChartPie}>
            Inicio
          </SidebarItem>
          <SidebarItem href="/estudiantes" icon={HiUsers}>
            Estudiantes
          </SidebarItem>
          <SidebarItem href="/profesores" icon={HiUserGroup}>
            Profesores
          </SidebarItem>
          <SidebarItem href="/facultades" icon={HiOfficeBuilding}>
            Facultades
          </SidebarItem>
          <SidebarItem href="/carreras" icon={HiBookOpen}>
            Carreras
          </SidebarItem>
          <SidebarItem href="/cursos" icon={HiAcademicCap}>
            Cursos
          </SidebarItem>
          <SidebarItem href="/secciones" icon={HiCollection}>
            Secciones
          </SidebarItem>
          <SidebarItem href="/matriculas" icon={HiClipboardList}>
            Matriculas
          </SidebarItem>
          <SidebarItem href="/pagos" icon={HiCreditCard}>
            Pagos
          </SidebarItem>
          <SidebarItem href="/calificaciones" icon={HiAnnotation}>
            Calificaciones
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
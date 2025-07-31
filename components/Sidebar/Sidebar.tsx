'use client'
import "./Sidebar.css"
import { ReactNode } from "react";
import { Menu, House, ShieldUser, ContactRound, UserPen, NotebookTabs, Home, UserCircle, BadgeCheck, SquarePen, FolderOpen } from "lucide-react";
import { VeloSvgLogo } from "../Icons/Icon";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export const sidebarIconSize = 18
export const sidebarStrokeWidth = 1.4
export const adminRoutes = [
   {
      icon: <ShieldUser size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Dashboard",
      href: '/admin'
   },
   {
      icon: <ContactRound size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Clients",
      href: '/admin/clients'
   },
   {
      icon: <UserPen size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Editors",
      href: '/admin/editors'
   },
   {
      icon: <NotebookTabs size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Editor Tasks",
      href: '/admin/editor-tasks'
   },
   {
      icon: <UserCircle size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Account Settings",
      href: '/account'
   }
]

export const editorRoutes = [
   {
      icon: <Home size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Dashboard",
      href: '/editor'
   },
   {
      icon: <NotebookTabs size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Editor Tasks",
      href: '/editor/editor-tasks'
   },
   {
      icon: <UserCircle size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Account Settings",
      href: '/account'
   }
]

export const clientRoutes = [
   {
      icon: <ShieldUser size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Dashboard",
      href: '/dashboard'
   },
   {
      icon: <SquarePen size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Posts",
      href: '/dashboard/posts'
   },
   {
      icon: <FolderOpen size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Content Assets",
      href: '/dashboard/content-assets'
   },
   {
      icon: <BadgeCheck size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Platforms",
      href: '/dashboard/platforms'
   },
   {
      icon: <UserCircle size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Account Settings",
      href: '/account'
   }
]

export default function Sidebar ({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (v: boolean) => void }) {
   const { user, isLoadingUser } = useUser();
   const router = useRouter();
   const pathname = usePathname();

   const sidebarIconSize = 18
   const sidebarStrokeWidth = 1.4

   const loadingRoutes = [
      {
         icon: <House size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
         label: "Dashboard",
         href: '/app'
      }
   ]

   return (
      <div className={`sidebar ${collapsed && 'collapsed'}`}>
         <div className="sidebar-toggle-icon-bar">
            <div className="text-s full dfb align-center">
               <button onClick={() => setCollapsed(!collapsed)} className="transparent fit">
                  <VeloSvgLogo size={30} />
               </button>
            </div>
            <button onClick={() => setCollapsed(!collapsed)} className="text-xxs transparent fit">
               <Menu strokeWidth={sidebarStrokeWidth} size={22} />
            </button>
         </div>

         <div className="sidebar-nav-container">
            <nav className="sidebar-nav">
               {isLoadingUser ? <>
                  {loadingRoutes.map((route, index) => (
                     <SidebarItem 
                        key={index} 
                        icon={route.icon} 
                        label={route.label} 
                        collapsed={collapsed} 
                        action={() => router.push(route.href)}
                        selected={pathname === route.href}
                     />
                  ))}
               </> : <>
                  {(user?.role == "admin") && (<>
                     {adminRoutes.map((route, index) => (
                        <SidebarItem 
                           key={index} 
                           icon={route.icon} 
                           label={route.label} 
                           collapsed={collapsed} 
                           action={() => router.push(route.href)}
                           selected={pathname === route.href}
                        />
                     ))}
                  </>)}
                  {(user?.role == "editor") && (<>
                     {editorRoutes.map((route, index) => (
                        <SidebarItem 
                           key={index} 
                           icon={route.icon} 
                           label={route.label} 
                           collapsed={collapsed} 
                           action={() => router.push(route.href)}
                           selected={pathname === route.href}
                        />
                     ))}
                  </>)}
                  {(user?.role == "client") && (<>
                     {clientRoutes.map((route, index) => (
                        <SidebarItem 
                           key={index} 
                           icon={route.icon} 
                           label={route.label} 
                           collapsed={collapsed} 
                           action={() => router.push(route.href)}
                           selected={pathname === route.href}
                        />
                     ))}
                  </>)}
               </>}
            </nav>
         </div>
      </div>
   );
}

type SidebarItemProps = {
   icon: ReactNode,
   label: string,
   collapsed: boolean,
   action: Function,
   selected: boolean,
   list?: boolean,
}

function SidebarItem({ icon, label, collapsed, action, selected, list }: SidebarItemProps) {
   return (
      <div className={"sidebar-item " + (list ? 'list-item ' : '')  + (selected ? 'selected' : '')} onClick={() => action()}>
         {icon && <span className="sidebar-item-icon">{icon}</span>}
         <span className="text-xxxs" style={{ opacity: collapsed ? 0 : 1, whiteSpace:"nowrap", cursor: collapsed ? 'default' : 'pointer' }}>{label}</span>
      </div>
   );
}

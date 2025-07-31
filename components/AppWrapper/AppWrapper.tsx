"use client"
import { ReactNode, useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useModal } from '../Modal/ModalContext'
import { Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CustomIcon } from '../Icons/Icon'
import { userDefaultImage } from '@/utils/constants'
import { wait } from '@/utils/wait'
import Sidebar, { adminRoutes, clientRoutes, editorRoutes } from '../Sidebar/Sidebar'
import Toolbar from '../Toolbar/Toolbar'
import Link from 'next/link'

export default function AppWrapper ({ children }: { children: ReactNode }) {
   const { user } = useUser();
   const { showModal, close } = useModal();
   const router = useRouter();
   const [collapsed, setCollapsed] = useState(
      localStorage ? (localStorage.getItem('velo-smms-sidebar-state') == '1') : false
   );

   useEffect(() => {
      if (localStorage) {
         localStorage.setItem('velo-smms-sidebar-state', collapsed ? '1' : '0');
      }
   }, [collapsed]);

   const openMenuModal = () => {
      showModal({
         title: "Navigation",
         content: <>
            {(user?.role == "admin") && (<>
               {adminRoutes.map((route, index) => (
                  <NavigationItem 
                     key={index} 
                     icon={route.icon} 
                     label={route.label}
                     href={route.href} 
                  />
               ))}
            </>)}
            {(user?.role == "editor") && (<>
               {editorRoutes.map((route, index) => (
                  <NavigationItem 
                     key={index} 
                     icon={route.icon} 
                     label={route.label}
                     href={route.href} 
                  />
               ))}
            </>)}
            {(user?.role == "client") && (<>
               {clientRoutes.map((route, index) => (
                  <NavigationItem 
                     key={index} 
                     icon={route.icon} 
                     label={route.label}
                     href={route.href} 
                  />
               ))}
            </>)}
            <br />
            <div className="text-xs bold-500 dfb align-center gap-7" onClick={() => {
               router.push('/account');
               close();
            }}>
               <CustomIcon url={user?.image! || userDefaultImage} size={30} round />
               <span>{user?.name}</span>
            </div>
         </>
      })
   }

   return (
      <div className="app">
         <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
         <Toolbar />
         <div className="main-section">
            <div className='main-title'>
               <div className="text-l bold-700 text-center dfb align-center gap-5" style={{userSelect: 'none', marginBottom: '10px', padding: '8px 0'}}>
                  <div className="menu-mobile text-s fit h-full dfb align-center justify-center pdx-15" onClick={openMenuModal}>
                     <Menu size={25} />
                  </div>
                  <span className='text-l dfb align-end gap-10 full pdx-1'>
                     Velo
                     <span className='text-xxs fit grey-5 bold-500 pd-05'>
                        {(user?.role == "admin") && 'Admin Account'}
                        {(user?.role == "client") && 'Customer Account'}
                        {(user?.role == "editor") && 'Editor Account'}
                     </span>
                  </span>
               </div>
            </div>
            <div className="main-box">
               {children}
            </div>
         </div>
      </div>
   )
}

function NavigationItem ({ href, icon, label }: { href: string, icon: ReactNode, label: string }) {
   const { close } = useModal();
   return (
      <Link href={href} className='text-s dfb align-center gap-10 pd-1' onClick={async () => {
         await wait(0.2);
         close();
      }}>
         {icon && <span className="text-s dfb align-center fit">{icon}</span>}
         <span className="text-xs" style={{ whiteSpace:"nowrap" }}>{label}</span>
      </Link>
   )
}
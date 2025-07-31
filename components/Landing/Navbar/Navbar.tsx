'use client'
import "./Navbar.css"
import { Menu } from "lucide-react"
import { CustomIcon, VeloSvgLogo } from "@/components/Icons/Icon"
import { useSession } from "next-auth/react"
import { userDefaultImage } from "@/utils/constants"
import { useRouter } from "next/navigation"
import { useModal } from "@/components/Modal/ModalContext"
import { useUser } from "@/hooks/useUser"
import Link from "next/link"

export default function Navbar () {
   const { data: session } = useSession();
   const { showModal, close } = useModal();
   const { user } = useUser();
   const router = useRouter();

   const openMenuModal = () => {
      showModal({
         title: "Navigation",
         content: <>
            <Link href='#features'>
               <div className="text-xs pd-1 mb-05 bold-500">Features</div>
            </Link>
            {session?.user ? <>
               <div className="text-xs bold-500 dfb align-center gap-7" onClick={() => {
                  router.push('/account');
                  close();
               }}>
                  <CustomIcon url={user?.image! || userDefaultImage} size={30} round />
                  <span>{session.user.name}</span>
               </div>
            </> : <>
               <button
                  className="xs" 
                  style={{
                     backgroundColor: '#6c2eff',
                     border: 'none',
                     padding: '0.5rem 1rem',
                     borderRadius: '100px',
                     color: 'white'
                  }}
                  onClick={() => {
                     router.push('/login');
                     close();
                  }}
               >Login</button>
            </>}
         </>
      })
   }

   return (
      <div className="navbar">
         <div className="navbar-container">

            <div className="branding" onClick={() => router.push('/')}>
               <div className="logo"><VeloSvgLogo size={40} /></div>
            </div>

            <div className="links">
               <Link href='#features'>
                  <div className="link text-xxs pd-1 bold-500">Features</div>
               </Link>
               <Link href='#team'>
                  <div className="link text-xxs pd-1 bold-500">Team</div>
               </Link>
            </div>

            <div className="action">
               {session?.user ? <>
                  <div className="user-account-button" onClick={() => router.push('/account')}>
                     <CustomIcon url={user?.image! || userDefaultImage} size={40} round />
                  </div>
               </> : <>
                  <button className="xs" onClick={() => router.push('/login')}>Login</button>
               </>}
            </div>

            <div className="menu">
               <div className="menu-btn" onClick={openMenuModal}>
                  <Menu size={30} />
               </div>
            </div>
         </div>
      </div>
   )
}

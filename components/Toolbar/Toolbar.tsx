'use client'
import "./Toolbar.css"
import { useUser } from "@/hooks/useUser"
import { CustomIcon } from "../Icons/Icon"
import { useState } from "react";
import { CircleUser, Lock, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { userDefaultImage } from "@/utils/constants";
import { useRouter } from "next/navigation";

export default function Toolbar() {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const { user } = useUser();
   const router = useRouter();

   return (
      <div className="toolbar">
         <div className="toolbar-items">
            <div className="user-image-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
               <CustomIcon url={user?.image! || userDefaultImage} size={30} round />
            </div>

            <div className={`user-info-dropdown ${isDropdownOpen ? 'open' : ''}`}>
               <div className="text-xxs dfb align-center gap-5 pdx-1 pd-1 grey-4">
                  <div className="icon"><CircleUser size={18} /></div>
                  <div className="text-xxs">{user?.email}</div>
               </div>
               <div className="dropdown-item" onClick={() => router.push("/account")}>
                  <div className="icon"><Settings size={18} /></div>
                  <div className="text-xxs">Account Settings</div>
               </div>
               <div className="dropdown-item" onClick={() => signOut()}>
                  <div className="icon"><LogOut size={18} /></div>
                  <div className="text-xxs">Log out</div>
               </div>
            </div>
         </div>
      </div>
   )
}

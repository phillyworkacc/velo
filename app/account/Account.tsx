'use client'
import "@/styles/app.css"
import { CustomIcon } from "@/components/Icons/Icon"
import { useUser } from "@/hooks/useUser"
import { userDefaultImage } from "@/utils/constants"
import { signOut } from "next-auth/react"
import { KeyRound, LogOut, Trash2 } from "lucide-react"
import { formatMilliseconds } from "@/utils/date"
import { useRouter } from "next/navigation"
import AwaitButton from "@/components/AwaitButton/AwaitButton"
import AppWrapper from "@/components/AppWrapper/AppWrapper"

export default function Account() {
   const { user, deleteAccount } = useUser();
   const router = useRouter();

   const deleteUserAccBtn = async () => { 
      if (confirm(`Are you sure you want to delete your account?`)) {
         deleteAccount();
      }
   }

   return (
      <AppWrapper>
         <div className="text-xl bold-700">Account Settings</div>
         <div className="text-s dfb column gap-10 pd-2">
            <div className="text-l bold-600 text-left full" style={{ maxWidth: '900px' }}>
               <CustomIcon url={user?.image! || userDefaultImage} size={60} round />
            </div>
            <div className="text-l bold-700 text-left dfb align-center gap-5 mb-05" style={{ maxWidth: '900px' }}>
               <div className="text-l full">{user?.name}</div>
            </div>
            <div className="text-xxs grey-4 dfb align-center gap-4 full" style={{ maxWidth: '900px' }}>{user?.email}</div>
            <div className="text-xxs grey-4 pd-05 full" style={{ maxWidth: '900px' }}>Joined Velo on {formatMilliseconds(user?.date!).split(',')[0]}</div>
            <AwaitButton blackSpinner className="grey xxxs whitespace-nowrap pd-1 pdx-2" onClick={() => signOut()}><LogOut size={15} /> Sign Out</AwaitButton>
         </div>

         {(user?.credentialMethod === "credentials") && (<div className="text-s dfb column gap-10 pd-2">
            <div className="text-l mt-1 dfb column gap-5 full" style={{ maxWidth: '900px' }}>
               <div className="text-l bold-700 full">Change Password</div>
               <div className="text-xxs grey-5 pd-05 mb-1">Change your password occasionally to prevent data breaches.</div>
               <AwaitButton className="xxxs whitespace-nowrap pd-1 pdx-15" onClick={() => router.push("/change-password")}>
                  <KeyRound size={15} /> Change Password
               </AwaitButton>
            </div>
         </div>)}

         <div className="text-s dfb column gap-10 pd-2">
            <div className="text-l mt-1 dfb column gap-5 full" style={{ maxWidth: '900px' }}>
               <div className="text-l bold-700 full">Delete Account</div>
               <div className="text-xxs grey-5 pd-05 mb-1">This action is <b>permanent</b> and cannot be undone. All your data, content, and settings will be lost forever.</div>
               <AwaitButton className="delete xxxs whitespace-nowrap pd-1 pdx-15" onClick={deleteUserAccBtn}><Trash2 size={15} /> Delete Account</AwaitButton>
            </div>
         </div>
      </AppWrapper>
   )
}

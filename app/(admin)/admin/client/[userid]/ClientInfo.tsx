'use client'
import { CustomIcon } from "@/components/Icons/Icon"
import { useVeloClient } from "@/hooks/useVeloClient"
import { copyToClipboard } from "@/lib/str";
import { appUrl, userDefaultImage } from "@/utils/constants";
import { formatMilliseconds } from "@/utils/date";
import { AlertTriangle, BadgeCheck, Copy, FolderOpen, Trash2 } from "lucide-react";
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { validateGoogleDriveFolderLink } from "@/utils/validation";
import Link from "next/link";

export default function ClientInfo () {
   const { client, actions } = useVeloClient();

   const deleteUserAccBtn = async (name: string) => { 
      if (confirm(`Are you sure you want to delete ${name}'s account?`)) {
         actions.deleteAccount();
      }
   }

   if (client == null) return <LoadingPage />;

   return (
      <>
         <div className="text-l bold-600 text-left">
            <CustomIcon url={client.user.image! || userDefaultImage} size={60} round />
         </div>
         <div className="text-l mt-1 bold-700 horizontal-convertible vertical-center gap-5">
            <div className="text-l full dfb align-center gap-4">
               {client.user.name}
               {(client.user.onboarded) && (<BadgeCheck fill="#2054FF" color="#ffffff" size={25} />)}
            </div>
            <button className="delete xxxs pd-1 whitespace-nowrap" onClick={() => deleteUserAccBtn(client.user.name)}><Trash2 size={15} /> Delete Client Account</button>
         </div>

         <div className="text-xxs grey-4 dfb align-center gap-4 pd-05">
            {client.user.email}
            <button className="transparent xxs" onClick={() => copyToClipboard(client.user.email!)}><Copy size={15} /></button>
         </div>
         <div className="text-xxs grey-4 mb-05">{client.user.description}</div>
         <div className="text-xxs grey-4">Joined Velo on {formatMilliseconds(client.user.date).split(',')[0]}</div>
         
         <div className="text-xs grey-4 pd-1 mb-05">
            <Link href={client.googleDriveFolderLink} target="_blank">
               {validateGoogleDriveFolderLink(client.googleDriveFolderLink) ? (<>
                  <button className="xxs pd-1 pdx-4 grey">
                     <CustomIcon url="/assets/google-drive.png" size={17} /> Google Drive Folder
                  </button>
               </>) : (<>
                  <button className="xxs pd-1 pdx-4">
                     <FolderOpen size={17} /> Cloud Folder
                  </button>
               </>)}
            </Link>
         </div>

         {(!client.user.onboarded) && (<>
            <div className="text-s mb-2" />
            <Card className="pd-15 pdx-15" maxWidth="900px" style={{ background: '#fff8e0' }}>
               <div className="text-s bold-600 full  dfb align-center gap-5">This client has not been onboarded <AlertTriangle size={18} /></div>
               <div className="text-xxs grey-5 full pd-05 mb-05">Send the link below to the client to onboard them</div>
               <button className="xxs outline-black" onClick={() => copyToClipboard(`${appUrl}/onboarding/${client?.userid!}`)}>
                  <Copy size={17} /> Copy Onboarding Link
               </button>
            </Card>
         </>)}
      </>
   )
}

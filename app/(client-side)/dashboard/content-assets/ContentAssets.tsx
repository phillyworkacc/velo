'use client'
import "@/styles/app.css"
import LoadingPage from "@/components/LoadingPage/LoadingPage"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Link from "next/link"
import { useVeloClient } from "@/hooks/useVeloClient"
import { FolderOpen } from "lucide-react"
import { validateGoogleDriveFolderLink } from "@/utils/validation"
import { CustomIcon } from "@/components/Icons/Icon"

export default function ContentAssets () {
   const { client } = useVeloClient();

   if (client == null) return <LoadingPage />;

   return (
      <AppWrapper>
         <div className="text-xxl bold-700 mb-1">Content Assets</div>
         <div className="text-xxs grey-4 pd-1">
            This is a shared folder you have with your Social Media Manager containing videos, images and other assets for future content on your social media accounts.
         </div>
         <div className="text-xxs grey-4 pd-1">
            You can view this folder by clicking below.
         </div>
         <div className="text-xs grey-4 pd-05 mb-05">
            <Link href={client.googleDriveFolderLink} target="_blank">
               {validateGoogleDriveFolderLink(client.googleDriveFolderLink) ? (<>
                  <button className="xxs pd-1 pdx-4 grey">
                     <CustomIcon url="/assets/google-drive.png" size={17} /> Open Google Drive Folder
                  </button>
               </>) : (<>
                  <button className="xxs pd-1 pdx-4">
                     <FolderOpen size={17} /> Open Cloud Folder
                  </button>
               </>)}
            </Link>
         </div>
         <div className="text-s mb-1" />
      </AppWrapper>
   )
}
'use client'
import "@/styles/app.css"
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import { useUser } from "@/hooks/useUser";
import { formatMilliseconds } from "@/utils/date";
import { redirect, useRouter } from "next/navigation";
import { createEditorAccount } from "@/app/actions/user";
import { editorDefaultImage } from "@/utils/constants";
import { useState } from "react";
import { toast } from "sonner";
import { validateEmail, validateGoogleDriveFolderLink } from "@/utils/validation";

export default function AddEditor () {
   const date = Date.now();
   const router = useRouter();
   
   const { user, isLoadingUser } = useUser();
   const [name, setName] = useState('')
   const [googleDriveFolderLink, setGoogleDriveFolderLink] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const createClientBtn = async () => {
      if (name == "") {
         toast.error("Please enter a name for the editor");
         return;
      }
      if (googleDriveFolderLink == "") {
         toast.error("Please enter a Google Drive Folder Link for the editor");
         return;
      }
      if (!validateGoogleDriveFolderLink(googleDriveFolderLink)) {
         toast.error("Please enter a valid Google Drive Folder Link for the editor");
         return;
      }
      if (email == "") {
         toast.error("Please enter an email for the editor");
         return;
      }
      if (!validateEmail(email)) {
         toast.error("Please enter a valid email for the editor");
         return;
      }
      if (password == "") {
         toast.error("Please enter a password for the editor");
         return;
      }
      try {
         await createEditorAccount({
            name, description: 'Velo Editor', password, email,
            image: editorDefaultImage,
            credentialMethod: 'credentials',
            onboarded: true, date
         }, googleDriveFolderLink);
         toast.success("Editor Created");
         router.push('/admin/editors');
      } catch (e) {
         toast.error("Failed to create editor");
      }
   }

   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (user.role == "client") redirect('/dashboard');
   if (user.role == "editor") redirect('/editor');
   
   return (
      <AppWrapper>
         <div className="text-l pd-1 bold-600">Create Editor</div>
         <div className="text-xxs mb-15 grey-5">Fill the form below to create an editor</div>
         <div className="text-s dfb column">
            <div className="text-s dfb column gap-20" style={{ maxWidth: '700px' }}>

               <div className="text-s dfb column">
                  <input type="text" className="xxs full pd-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
               </div>

               <div className="text-s dfb column">
                  <input type="email" className="xxs full pd-1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
               </div>

               <div className="text-s dfb column">
                  <input type="text" className="xxs full pd-1" placeholder="Google Drive Folder Link" value={googleDriveFolderLink} onChange={(e) => setGoogleDriveFolderLink(e.target.value)} />
               </div>

               <div className="text-s dfb column">
                  <input type="text" className="xxs full pd-1" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
               </div>

               <div className="text-s dfb column mt-1">
                  <div className="text-xxs grey-4">Creating editor at {formatMilliseconds(date)}</div>
               </div>

               <div className="text-s dfb column">
                  <AwaitButton className="xxs full pd-1" onClick={createClientBtn}>Create Editor</AwaitButton>
               </div>

            </div>
         </div>
      </AppWrapper>
   );

}
'use client'
import "@/styles/app.css"
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import { useUser } from "@/hooks/useUser";
import { formatMilliseconds } from "@/utils/date";
import { redirect, useRouter } from "next/navigation";
import { createEditorTask } from "@/app/actions/user";
import { useState } from "react";
import { toast } from "sonner";

export default function AddEditorTask () {
   const date = Date.now();
   const router = useRouter();
   
   const { user, isLoadingUser } = useUser();
   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')

   const createClientBtn = async () => {
      if (title == "") {
         toast.error("Please enter a title for the editor task");
         return;
      }
      if (description == "") {
         toast.error("Please enter a task description for the editor task");
         return;
      }
      try {
         await createEditorTask({
            title, task: description, date
         })
         toast.success("Editor Task Created");
         router.push('/admin/editor-tasks');
      } catch (e) {
         toast.error("Failed to create editor task");
      }
   }

   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (user.role == "client") redirect('/dashboard');
   if (user.role == "editor") redirect('/editor');
   
   return (
      <AppWrapper>
         <div className="text-l pd-1 bold-600">Create Editor Task</div>
         <div className="text-xxs mb-15 grey-5">Fill the form below to create a task for Velo Editors</div>
         <div className="text-s dfb column">
            <div className="text-s dfb column gap-20" style={{ maxWidth: '700px' }}>

               <div className="text-s dfb column">
                  <input type="text" className="xxs full pd-1" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} />
               </div>

               <div className="text-s dfb column">
                  <textarea className="xxs full pd-1 h-40" placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} />
               </div>

               <div className="text-s dfb column mt-1">
                  <div className="text-xxs grey-4">Creating editor task at {formatMilliseconds(date)}</div>
               </div>

               <div className="text-s dfb column">
                  <AwaitButton className="xxs full pd-1" onClick={createClientBtn}>Create Editor Task</AwaitButton>
               </div>

            </div>
         </div>
      </AppWrapper>
   );

}
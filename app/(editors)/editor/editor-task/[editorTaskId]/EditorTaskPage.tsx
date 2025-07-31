'use client'
import "@/styles/app.css"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import AwaitButton from "@/components/AwaitButton/AwaitButton"
import LoadingPage from "@/components/LoadingPage/LoadingPage"
import { CircleCheck, Notebook, Trash2 } from "lucide-react"
import { formatMilliseconds } from "@/utils/date"
import { CustomIcon } from "@/components/Icons/Icon"
import { useUser } from "@/hooks/useUser"
import { redirect, useRouter } from "next/navigation"
import { completeTask } from "@/app/actions/editor"
import { useState } from "react"
import { toast } from "sonner"

export default function EditorTaskPage ({ editorTask, hasEditorCompleted }: { editorTask: EditorTasks, hasEditorCompleted: boolean }) {
   const { user, isLoadingUser } = useUser();
   const router = useRouter();
   const [googleDriveLink, setGoogleDriveLink] = useState('')

   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (user.role == "admin") redirect("/admin");
   if (user.role == "client") redirect("/dashboard");

   const completeTaskBtn = async () => {
      if (!user) return;
      const completed = await completeTask(editorTask.taskId, user.userid, googleDriveLink);
      if (completed) {
         toast.success(`Completed Task - ${editorTask.title}`);
         router.refresh();
      } else {
         toast.error(`Failed to complete task`);
      }
   }

   return (
      <AppWrapper>
         <div className="text-l text-left dfb align-center pd-1">
            <div className="text-xxs full accent-color bold-600 dfb align-center gap-5">
               <Notebook size={16} /> Editor Task
            </div>
            <div className="text-xxs grey-4 fit" style={{whiteSpace:"nowrap"}}>
               Created task on {formatMilliseconds(editorTask.date).split(',')[0]}
            </div>
         </div>

         <div className="text-l mt-1 bold-700 text-left dfb align-center gap-5">
            <div className="text-l full">{editorTask.title}</div>
         </div>

         <div className="text-xxs grey-5 pd-1 mb-4" style={{width: '900px',whiteSpace:"pre-wrap"}}>
            {editorTask.task}
         </div>

         {(hasEditorCompleted) ? (<>
            <div className="text-m bold-700 dfb align-center gap-5" style={{color:"#1b8500ff"}}>
               <CircleCheck size={25} strokeWidth={2.5} color="#1b8500ff" />
               <span>Task Completed</span>
            </div>
         </>) : (<>
            <div className="text-l pd-1 bold-700 mt-4">Complete Task</div>
            <div className="text-xxs mb-15 grey-5 dfb gap-5 align-center">
               Paste in your <CustomIcon url="/assets/google-drive.png" size={17} /> <b>Google Drive Folder Link</b> with the task assets to show that you have completed this task.
            </div>
            <div className="text-s dfb column">
               <div className="text-s dfb column gap-20" style={{ width: '700px' }}>
                  <div className="text-s dfb column">
                     <input 
                        type="text" 
                        className="xxs full pd-1" 
                        placeholder="Google Drive Folder Link" 
                        value={googleDriveLink} 
                        onChange={(e) => setGoogleDriveLink(e.target.value)} 
                     />
                  </div>
                  <div className="text-s dfb column">
                     <AwaitButton className="xxs full pd-1" onClick={completeTaskBtn}>
                        <CircleCheck size={15} /> Complete Task
                     </AwaitButton>
                  </div>
               </div>
            </div>
         </>)}

         <br /><br /><br /><br />
      </AppWrapper>
   )
}
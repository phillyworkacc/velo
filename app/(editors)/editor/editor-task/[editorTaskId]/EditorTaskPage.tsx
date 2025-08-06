'use client'
import "@/styles/app.css"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import AwaitButton from "@/components/AwaitButton/AwaitButton"
import LoadingPage from "@/components/LoadingPage/LoadingPage"
import { CircleCheck, CircleX, Edit, Notebook } from "lucide-react"
import { formatMilliseconds } from "@/utils/date"
import { CustomIcon } from "@/components/Icons/Icon"
import { useUser } from "@/hooks/useUser"
import { redirect } from "next/navigation"
import { completeTask } from "@/app/actions/editor"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { checkIfEditorHasCompletedTask, getEditorSubmissionForTask, getEditorTask } from "@/app/actions/editorTaskActions"
import Link from "next/link"

export default function EditorTaskPage ({ editorTaskId }: { editorTaskId: string }) {
   const { user, isLoadingUser } = useUser();
   const [googleDriveLink, setGoogleDriveLink] = useState('');
   const [editorTask, setEditorTask] = useState<EditorTasks | null>(null);
   const [originalHasEditorCompleted, setOriginalHasEditorCompleted] = useState<boolean | null>(null);
   const [hasEditorCompleted, setHasEditorCompleted] = useState<boolean | null>(null);
   const [editorTaskSubmission, setEditorTaskSubmission] = useState<EditorTaskStatus | null>(null);

   useEffect(() => {
      if (user) {
         const load = async () => {
            const fetchEditorTask = await getEditorTask(editorTaskId);
            setEditorTask(fetchEditorTask);
   
            const fetchHasEditorCompleted = await checkIfEditorHasCompletedTask(user.userid, editorTaskId);
            setHasEditorCompleted(fetchHasEditorCompleted);
            setOriginalHasEditorCompleted(fetchHasEditorCompleted);

            const fetchEditorSubmission = await getEditorSubmissionForTask(user.userid, editorTaskId);
            setEditorTaskSubmission(fetchEditorSubmission);
         }
         load();
      }
   }, [isLoadingUser]);

   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (user.role == "admin") redirect("/admin");
   if (user.role == "client") redirect("/dashboard");
   if (editorTask == null) return <LoadingPage />;
   if (hasEditorCompleted == null) return <LoadingPage />;
   if (editorTaskSubmission == null) return <LoadingPage />;

   const completeTaskBtn = async () => {
      if (!user) return;
      const completed = await completeTask(editorTask.taskId, user.userid, googleDriveLink);
      if (completed) {
         toast.success(`Completed Task - ${editorTask.title}`);
         setHasEditorCompleted(true);
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
            <div className="text-xs bold-700 dfb align-center gap-5" style={{color:"#1b8500ff"}}>
               <CircleCheck size={20} strokeWidth={2.5} color="#1b8500ff" />
               <span>Task Completed</span>
            </div>
            <div className="text-xxs pd-1 grey-5">You can click below to either edit and change your submission for this task or view you cloud folder containing your submission</div>
            <div className="text-s dfb align-center gap-7">
               <Link href={editorTaskSubmission.googleDriveLink} target="_blank">
                  <button className="xxxs grey pd-1 pdx-2">
                     <CustomIcon url="/assets/google-drive.png" size={17} />
                     View your submission
                  </button>
               </Link>
               <button className="xxxs grey pd-1 pdx-2" onClick={() => setHasEditorCompleted(false)}>
                  <Edit size={15} /> Edit Submission
               </button>
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
                  <div className="text-s dfb column gap-5">
                     <AwaitButton className="xxs full pd-1" onClick={completeTaskBtn}>
                        <CircleCheck size={15} /> Complete Task
                     </AwaitButton>
                     {(originalHasEditorCompleted) && (<button className="xxs full pd-1 outline-black" onClick={() => setHasEditorCompleted(true)}>
                        <CircleX size={15} /> Cancel
                     </button>)}
                  </div>
               </div>
            </div>
         </>)}

         <br /><br /><br /><br />
      </AppWrapper>
   )
}
'use client'
import { CustomIcon } from "@/components/Icons/Icon"
import { copyToClipboard } from "@/lib/str";
import { userDefaultImage } from "@/utils/constants";
import { formatMilliseconds } from "@/utils/date";
import { CircleCheck, ClipboardCheck, Copy, FolderOpen, Timer, Trash2 } from "lucide-react";
import { CSSProperties, useEffect, useState } from "react";
import { moneyFormatting, numberFormatting } from "@/utils/utils";
import { useVeloEditor } from "@/hooks/useVeloEditor";
import { validateGoogleDriveFolderLink } from "@/utils/validation";
import { getEditorAnalytics, getEditorTasksCompletedDetail } from "@/app/actions/adminPageActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteEditorTaskCompletion } from "@/app/actions/editorTaskActions";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import Skeleton from "@/components/Skeleton/Skeleton";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Link from "next/link";

type EditorPageAnalytics = {
   totalAmountMade: number;
   noOfTasksApproved: number;
   noOfTaskCompleted: number;
   payments: EditorPayments[];
}

export default function EditorPage () {
   const router = useRouter();
   const { editor, isLoadingEditor, actions } = useVeloEditor();
   const cardStyle: CSSProperties = {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
   }
   const [analytics, setAnalytics] = useState<EditorPageAnalytics | null>(null);
   const [tasksCompleted, setTasksCompleted] = useState<TaskCompletedDetail[] | null>(null);

   useEffect(() => {
      if (editor !== null) {
         const load = async () => {
            const fetchAnalytics = await getEditorAnalytics(editor.user.userid);
            setAnalytics(fetchAnalytics);

            const fetchTasksCompleted = await getEditorTasksCompletedDetail(editor.user.userid);
            setTasksCompleted(fetchTasksCompleted);
         }
         load();
      }
   }, [isLoadingEditor])

   const deleteUserAccBtn = async (name: string) => { 
      if (confirm(`Are you sure you want to delete ${name}'s account?`)) {
         actions.deleteAccount();
      }
   }

   const deleteTaskCompletedByEditor = async (taskName: string, taskId: string) => {
      if (!editor) return;
      if (!tasksCompleted) return;
      if (confirm(`Are you sure you want to delete ${editor.user.name}'s ${taskName} Task Completion ?`)) {
         const deleted = await deleteEditorTaskCompletion(editor.userid, taskId);
         if (deleted) {
            toast.success(`Successfully deleted ${editor.user.name}'s ${taskName} Task Completion`);
            setTasksCompleted(prev => ([...tasksCompleted.filter(taskComp => taskComp.taskId !== taskId)]));
         } else {
            toast.error(`Failed to delete ${editor.user.name}'s ${taskName} Task Completion`);
         }
      }
   }

   if (isLoadingEditor) return <LoadingPage />;
   if (editor == null) return <LoadingPage />;

   return (
      <AppWrapper>
         <div className="text-l bold-600 text-left">
            <CustomIcon url={editor.user.image! || userDefaultImage} size={60} round />
         </div>
         <div className="text-l mt-1 bold-700 horizontal-convertible vertical-center gap-5">
            <div className="text-l full dfb align-center gap-4">
               {editor.user.name}
               {(editor.tasksCompleted.length > 0) && (<CircleCheck fill="#2054FF" color="#ffffff" size={20} />)}
            </div>
            <button className="delete xxxs pd-1 whitespace-nowrap" onClick={() => deleteUserAccBtn(editor.user.name)}>
               <Trash2 size={15} /> Delete Editor Account
            </button>
         </div>

         <div className="text-xxs grey-4 dfb align-center gap-4 pd-05">
            {editor.user.email}
            <button className="transparent xxs" onClick={() => copyToClipboard(editor.user.email!)}><Copy size={15} /></button>
         </div>
         <div className="text-xxs grey-4">Joined Velo on {formatMilliseconds(editor.user.date).split(',')[0]}</div>

         <div className="text-xs grey-4 pd-1 mb-05">
            <Link href={editor.googleDriveFolderLink} target="_blank">
               {validateGoogleDriveFolderLink(editor.googleDriveFolderLink) ? (<>
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

         <div className="text-l bold-700 mb-1 mt-4">Analytics</div>
         <div className='text-s dfb wrap gap-15 w-full'>
            {(analytics == null) ? (<>
               <Skeleton width="500px" height="120px" />
               <Skeleton width="500px" height="120px" />
               <Skeleton width="500px" height="120px" />
            </>) : (<>
               <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
                  <div className="text-xxxs grey-5">Money {editor.user.name} Made (Total)</div>
                  <div className="text-mb bold-800 mb-15">£{moneyFormatting(analytics.totalAmountMade)}</div>
               </Card>
               <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
                  <div className="text-xxxs grey-5">Tasks Approved</div>
                  <div className="text-mb bold-800 mb-15">{numberFormatting(analytics.noOfTasksApproved)}</div>
               </Card>
               <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
                  <div className="text-xxxs grey-5">Tasks Completed</div>
                  <div className="text-mb bold-800 mb-15">{numberFormatting(analytics.noOfTaskCompleted)}</div>
               </Card>
            </>)}
         </div>

         <div className="text-l bold-700 mb-1 mt-4">Tasks Completed</div>
         <div className='text-s dfb wrap gap-15 w-full'>
            {(tasksCompleted == null) ? (<>
               <Skeleton width="500px" height="120px" />
               <Skeleton width="500px" height="120px" />
               <Skeleton width="500px" height="120px" />
            </>) : (<>
               {tasksCompleted.map((task, index) => (
                  <Card key={index} className="pd-2 pdx-2" maxWidth="400px" analyticsCard>
                     <div className="text-sm bold-600 mb-05">{task.taskName}</div>
                     <div className="text-s dfb wrap gap-8 pd-1">
                        <button className="xxxs pdx-15 fit" onClick={() => router.push(`/admin/editor-task/${task.taskId}`)}>
                           <ClipboardCheck size={16} /> View Task
                        </button>
                        <Link href={task.googleDriveLink} target="_blank">
                           <button className="xxxs pdx-15 fit grey">
                              <FolderOpen size={16} /> Open Task Folder
                           </button>
                        </Link>
                        <AwaitButton className="xxxs pdx-15 fit delete" onClick={() => deleteTaskCompletedByEditor(task.taskName, task.taskId)}>
                           <Trash2 size={16} /> Delete Task Completion
                        </AwaitButton>
                     </div>
                     <div className="text-xxxs full mt-1 bold-600 dfb align-center gap-5" style={{color:"#05a300ff"}}>
                        <Timer size={14} /> Completed at {formatMilliseconds(task.date)}
                     </div>
                     {(editor.tasksApproved.find(taskApp => taskApp.taskId == task.taskId)) && (<div className="text-xxxs full mt-1 bold-600 dfb align-center gap-5 accent-color">
                        <CircleCheck size={14} /> Task Approved
                     </div>)}
                  </Card>
               ))}
            </>)}
         </div>
      </AppWrapper>
   )
}

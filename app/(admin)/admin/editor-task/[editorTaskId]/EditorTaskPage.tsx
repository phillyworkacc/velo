'use client'
import "@/styles/app.css"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Card from "@/components/Card/Card"
import ApproveTaskForm from "./ApproveTaskForm"
import LoadingPage from "@/components/LoadingPage/LoadingPage"
import AwaitButton from "@/components/AwaitButton/AwaitButton"
import { CircleCheck, Notebook, Rocket, Timer, Trash2 } from "lucide-react"
import { formatMilliseconds } from "@/utils/date"
import { deleteEditorTask, deleteEditorTaskApproval, getEditorWhoCompletedTask } from "@/app/actions/admin"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { deleteEditorTaskCompletion, getEditorsWhoAreApprovedForTask, getEditorTask, getEditorTaskAnalytics } from "@/app/actions/editorTaskActions"
import { CustomIcon } from "@/components/Icons/Icon"
import Link from "next/link"

export default function EditorTaskPage ({ editorTaskId }: { editorTaskId: string }) {
   const router = useRouter();
   const [editorTask, setEditorTask] = useState<EditorTasks | null>(null);
   const [approved, setApproved] = useState<number>(-1);
   const [completed, setCompleted] = useState<number>(-1);
   const [editorsWhoCompletedTask, setEditorsWhoCompletedTask] = useState<EditorDetails[] | null>(null);
   const [editorsWhoAreApproved, setEditorsWhoAreApproved] = useState<EditorDetails[] | null>(null);

   useEffect(() => {
      const load = async () => {
         const fetchEditorTask = await getEditorTask(editorTaskId);
         setEditorTask(fetchEditorTask);
      }
      load();
   }, []);

   useEffect(() => {
      if (editorTask !== null) {
         const load = async () => {
            const fetchEditorTaskAnalytics = await getEditorTaskAnalytics(editorTaskId);
            setCompleted(fetchEditorTaskAnalytics?.completed);
            setApproved(fetchEditorTaskAnalytics?.approved);
         }
         load();
      }
   }, [editorTask])

   useEffect(() => {
      if (approved > -1 && completed > -1) {
         const load = async () => {
            const fetchEditorsWhoCompletedTask = await getEditorWhoCompletedTask(editorTaskId);
            setEditorsWhoCompletedTask(fetchEditorsWhoCompletedTask || null);
            const fetchEditorsWhoAreApproved = await getEditorsWhoAreApprovedForTask(editorTaskId);
            setEditorsWhoAreApproved(fetchEditorsWhoAreApproved);
         }
         load();
      }
   }, [approved])

   if (editorTask == null) return <LoadingPage />;
   if (approved < 0) return <LoadingPage />;
   if (completed < 0) return <LoadingPage />;
   if (editorsWhoCompletedTask == null) return <LoadingPage />;
   if (editorsWhoAreApproved == null) return <LoadingPage />;

   const deleteTaskBtn = async () => {
      const deleted = await deleteEditorTask(editorTask.taskId);
      if (deleted) {
         toast.success("Successfully deleted task");
         router.push("/admin/editor-tasks")
      } else {
         toast.error("Failed to delete task")
      }
   }

   const deleteTaskApprovalBtn = async (editorUserId: string, editorName: string) => {
      const deleted = await deleteEditorTaskApproval(editorTask.taskId, editorUserId);
      if (deleted) {
         toast.success(`Successfully deleted ${editorName}'s task approval`);
         router.refresh();
      } else {
         toast.error("Failed to delete task approval")
      }
   }

   const deleteTaskCompletedByEditor = async (editorName: string, editorUserId: string) => {
      if (!editorsWhoCompletedTask) return;
      if (confirm(`Are you sure you want to delete ${editorName}'s ${editorTask.title} Task Completion ?`)) {
         const deleted = await deleteEditorTaskCompletion(editorUserId, editorTaskId);
         if (deleted) {
            toast.success(`Successfully deleted ${editorName}'s ${editorTask.title} Task Completion`);
            setEditorsWhoCompletedTask(prev => ([...editorsWhoCompletedTask.filter(editor => editor.userid !== editorUserId)]));
         } else {
            toast.error(`Failed to delete ${editorName}'s ${editorTask.title} Task Completion`);
         }
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
            <AwaitButton className="delete xxxs pd-1 whitespace-nowrap" onClick={deleteTaskBtn}>
               <Trash2 size={15} /> Delete Editor Task
            </AwaitButton>
         </div>

         <div className="text-xxs grey-5 pd-1 mb-4" style={{width: '900px',whiteSpace:"pre-wrap"}}>
            {editorTask.task}
         </div>

         <div className="text-s dfb align-center gap-10 wrap">
            <Card className="pd-2 pdx-2" maxWidth="500px" analyticsCard>
               <div className="text-xxs grey-5 dfb align-center gap-5">Completed <CircleCheck size={15} /></div>
               <div className="text-xxxs grey-4 pd-05">Number of Editors who have completed this task</div>
               <div className="text-mb bold-800 pd-05 mb-05">{completed}</div>
            </Card>
            <Card className="pd-2 pdx-2" maxWidth="500px" analyticsCard>
               <div className="text-xxs grey-5 dfb align-center gap-5">Approved <Rocket size={15} /></div>
               <div className="text-xxxs grey-4 pd-05">Number of Editors whose attempts where posted</div>
               <div className="text-mb bold-800 mb-05">{approved}</div>
            </Card>
         </div>

         {(completed > 0) && (<>
            <div className="text-l pd-1 bold-700 mt-4">Completed Options</div>
            <div className="text-s dfb align-center gap-10 wrap">
               {editorsWhoCompletedTask.map((editor, index) => (
                  <Card key={index} className="pd-2 pdx-2" maxWidth="400px" analyticsCard>
                     <div className="text-s bold-700 dfb align-center gap-7 mb-05 fit cursor-pointer" onClick={() => router.push(`/admin/editor/${editor.userid}`)}>
                        <CustomIcon url={editor.user.image} size={26} round />
                        {editor.user.name}
                        {(editor.tasksCompleted.length > 0) && (<CircleCheck fill="#2054FF" color="#ffffff" size={20} />)}
                     </div>
                     <div className="text-s dfb wrap gap-8 pd-1">
                        <Link href={editor.tasksCompleted.find(taskComp => taskComp.taskId == editorTaskId)?.googleDriveLink!} target="_blank">
                           <button className="xxxs pdx-15 fit grey">
                              <CustomIcon url="/assets/google-drive.png" size={20} /> Open Task Folder
                           </button>
                        </Link>
                        <AwaitButton className="xxxs pdx-15 fit delete" onClick={() => deleteTaskCompletedByEditor(editor.user.name, editor.userid)}>
                           <Trash2 size={16} /> Delete Task Completion
                        </AwaitButton>
                     </div>
                     <div className="text-xxxs full mt-1 bold-600 dfb align-center gap-5" style={{color:"#05a300ff"}}>
                        <Timer size={14} /> Completed at {formatMilliseconds(editor.tasksCompleted.find(taskComp => taskComp.taskId == editorTaskId)?.date!)}
                     </div>
                     {(editor.tasksApproved.find(taskApp => taskApp.taskId == editorTaskId)) && (<div className="text-xxxs full mt-1 bold-600 dfb align-center gap-5 accent-color">
                        <CircleCheck size={14} /> Task Approved
                     </div>)}
                  </Card>
               ))}
            </div>
         </>)}

         {(approved > 0) && (<>
            <div className="text-l pd-1 bold-700 mt-4">Approved Tasks</div>
            <div className="text-s dfb align-center gap-10 wrap">
               {editorsWhoAreApproved.map((editor, index) => (
                  <Card key={index} className="pd-2 pdx-2 " maxWidth="500px" analyticsCard>
                     <div className="text-s bold-700 dfb align-center gap-7 mb-05 fit cursor-pointer" onClick={() => router.push(`/admin/editor/${editor.userid}`)}>
                        <CustomIcon url={editor.user.image} size={26} round />
                        {editor.user.name}
                        {(editor.tasksCompleted.length > 0) && (<CircleCheck fill="#2054FF" color="#ffffff" size={20} />)}
                        <Rocket size={17} fill="#2054FF" color="#2054FF"  />
                     </div>
                     <div className="text-xxs mt-05 pd-1 mb-05 bold-600 accent-color">
                        Approved on {formatMilliseconds(editor.tasksApproved.filter(taskApp => taskApp.taskId == editorTask.taskId)[0].date).split(",")[0]}
                     </div>
                     <AwaitButton className="delete xxxs whitespace-nowrap" onClick={() => deleteTaskApprovalBtn(editor.user.userid, editor.user.name)}>
                        <Trash2 size={15} /> Delete Task Approval
                     </AwaitButton>
                  </Card>
               ))}
            </div>
         </>)}

         {(completed > 0) && (<>
            <ApproveTaskForm taskId={editorTask.taskId} />
         </>)}

         <br /><br /><br /><br />
         <br /><br /><br /><br />
      </AppWrapper>
   )
}
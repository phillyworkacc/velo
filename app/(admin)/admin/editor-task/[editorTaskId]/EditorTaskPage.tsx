'use client'
import "@/styles/app.css"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Card from "@/components/Card/Card"
import ApproveTaskForm from "./ApproveTaskForm"
import AwaitButton from "@/components/AwaitButton/AwaitButton"
import { CircleCheck, Notebook, Rocket, Trash2 } from "lucide-react"
import { formatMilliseconds } from "@/utils/date"
import { deleteEditorTask, deleteEditorTaskApproval } from "@/app/actions/admin"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type EditorTaskPageProps = {
   editorTask: EditorTasks;
   completed: number;
   approved: number;
   editorsWhoAreApproved: EditorDetails[];
}

export default function EditorTaskPage ({ editorTask, approved, completed, editorsWhoAreApproved }: EditorTaskPageProps) {
   const router = useRouter();

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

         {(approved > 0) && (<>
            <div className="text-l pd-1 bold-700 mt-4">Approved Tasks</div>
            <div className="text-s dfb align-center gap-10 wrap">
               {editorsWhoAreApproved.map((editor, index) => (
                  <Card key={index} className="pd-2 pdx-2 " maxWidth="500px" analyticsCard>
                     <div className="text-s bold-600 dfb align-center gap-5">
                        <Rocket size={20} />
                        {editor.user.name}'s Post was Approved
                     </div>
                     <div className="text-xxxs grey-4 mt-05 pd-05 mb-05">
                        Approved on {formatMilliseconds(editor.tasksApproved.filter(taskApp => taskApp.taskId == editorTask.taskId)[0].date).split(",")[0]}
                     </div>
                     <AwaitButton className="delete xxxs pd-1 whitespace-nowrap" onClick={() => deleteTaskApprovalBtn(editor.user.userid, editor.user.name)}>
                        <Trash2 size={15} /> Delete
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
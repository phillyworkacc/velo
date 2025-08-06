'use client'
import AwaitButton from '@/components/AwaitButton/AwaitButton';
import Card from '@/components/Card/Card';
import Skeleton from '@/components/Skeleton/Skeleton';
import Link from 'next/link'
import router from 'next/router';
import { useVeloEditor } from '@/hooks/useVeloEditor'
import { formatMilliseconds } from '@/utils/date';
import { ClipboardCheck, FolderOpen, Trash2, Timer, CircleCheck } from 'lucide-react';
import { deleteEditorTaskCompletion } from '@/app/actions/editorTaskActions';
import { toast } from 'sonner';
import { Dispatch, SetStateAction } from 'react';

type TasksCompletedProps = {
   tasksCompleted: TaskCompletedDetail[] | null;
   setTasksCompleted: Dispatch<SetStateAction<TaskCompletedDetail[] | null>>;
}

export default function TasksCompleted ({ tasksCompleted, setTasksCompleted }: TasksCompletedProps) {
   const { editor, isLoadingEditor } = useVeloEditor();

   if (editor == null || isLoadingEditor == null) return (<>
      <Skeleton width="500px" height="120px" />
      <Skeleton width="500px" height="120px" />
      <Skeleton width="500px" height="120px" />
   </>);

   const deleteTaskCompletedByEditor = async (taskName: string, taskId: string) => {
      if (!editor) return;
      if (confirm(`Are you sure you want to delete ${editor.user.name}'s ${taskName} Task Completion ?`)) {
         const deleted = await deleteEditorTaskCompletion(editor.userid, taskId);
         if (deleted) {
            toast.success(`Successfully deleted ${editor.user.name}'s ${taskName} Task Completion`);
            setTasksCompleted([...tasksCompleted?.filter(taskComp => taskComp.taskId !== taskId)!]);
         } else {
            toast.error(`Failed to delete ${editor.user.name}'s ${taskName} Task Completion`);
         }
      }
   }

   return (<>
      {(tasksCompleted == null) ? (<>
         <Skeleton width="500px" height="120px" />
         <Skeleton width="500px" height="120px" />
         <Skeleton width="500px" height="120px" />
      </>) : (<>
         {tasksCompleted.map((task, index) => (
            <Card key={index} className="pd-2 pdx-2" maxWidth="400px" analyticsCard>
               <div className="text-sm bold-600 mb-05">{task.taskName}</div>
               <div className="text-s dfb wrap gap-8 pd-1">
                  <button className="xxxs pdx-15 fit" onClick={() => router.push(`/editor/editor-task/${task.taskId}`)}>
                     <ClipboardCheck size={16} /> View Task
                  </button>
                  <Link href={task.googleDriveLink} target="_blank">
                     <button className="xxxs pdx-15 fit grey">
                        <FolderOpen size={16} /> Open Task Folder
                     </button>
                  </Link>
                  <AwaitButton className="xxxs pdx-15 fit delete" onClick={() => deleteTaskCompletedByEditor(task.taskName, task.taskId)}>
                     <Trash2 size={16} /> Delete Task
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
   </>)
}

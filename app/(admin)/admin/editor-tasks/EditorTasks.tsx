'use client'
import "@/styles/app.css"
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import { useUser } from "@/hooks/useUser";
import { redirect, useRouter } from "next/navigation";
import { Notebook } from "lucide-react";

export default function EditorTasks ({ editorTasks }: { editorTasks: EditorTasks[] }) {
   const { user, isLoadingUser } = useUser();
   const editorTasksObjectSortedByDate = editorTasks.reduce((acc: any, editorTask) => {
      // Convert createdAt (ms) to date string like "2025-07-21"
      const date = new Date(editorTask.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!acc[date]) {
         acc[date] = [ editorTask ];
      }
      if (acc[date].filter((task: any) => task.date == editorTask.date).length < 1) {
         acc[date].push(editorTask);
      }
      return acc;
   }, {})

   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (user.role == "client") redirect('/dashboard');
   if (user.role == "editor") redirect('/editor');
   
   return (
      <AppWrapper>
         <div className="text-xxl bold-700 mb-1">Editor Tasks</div>
         <div className="text-xxs grey-4 mb-2">These are all the tasks the editors on Velo can do, {editorTasks.length} task{editorTasks.length !== 1 && 's'}</div>
         <div className="text-s dfb wrap gap-15 w-full">
            {(editorTasks.length > 0) ? (<>
               <EditorTasksLister editorTasks={editorTasksObjectSortedByDate} />
            </>) : (<>
               <div className="text-xxs grey-4">No editors yet</div>
            </>)}
         </div>
      </AppWrapper>
   );
}

type EditorTasksDateObject = {
   [date: string]: EditorTasks[];
}

function EditorTasksLister ({ editorTasks }: { editorTasks: EditorTasksDateObject }) {
   const router = useRouter();
   const dateKeys = Object.keys(editorTasks).toReversed();

   return (<div className="text-s dfb column gap-10 w-full">
      {dateKeys.map((dateKey, index) => (<div key={index}>
         <div className="text-ml bold-700 mb-1">Tasks on {dateKey}</div>
         <div className="text-s w-full wrap dfb gap-10">
            {editorTasks[dateKey].map((editorTask, index) => (
               <Card key={index} className="pd-2 pdx-2" maxWidth="500px" cursor onClick={() => router.push(`/admin/editor-task/${editorTask.taskId}`)} hoverAnimate analyticsCard>
                  <div className="text-s bold-700">{editorTask.title}</div>
                  <div className="text-xxs grey-4 full mt-05" style={{wordBreak:"break-all"}}>{editorTask.task.substring(0,200)}...</div>
                  <div className="text-xxs full mt-1 accent-color bold-600 dfb align-center gap-5">
                     <Notebook size={16} /> Editor Task
                  </div>
               </Card>
            ))}
         </div>
         <div className="text-m mb-15" />
      </div>))}
   </div>);
}

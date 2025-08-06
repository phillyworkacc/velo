'use client'
import "@/styles/app.css"
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import { useUser } from "@/hooks/useUser";
import { redirect, useRouter } from "next/navigation";
import { Calendar, Notebook, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllEditorTasks } from "@/app/actions/adminPageActions";
import { formatMilliseconds } from "@/utils/date";

export default function EditorTasks () {
   const { user, isLoadingUser } = useUser();
   const [editorTasks, setEditorTasks] = useState<EditorTasks[] | null>(null);
   const [editorTasksObjectSortedByDate, setEditorTasksObjectSortedByDate] = useState<any | null>(null);

   useEffect(() => {
      if (user?.role == "admin") {
         const load = async () => {
            const fetchEditorTasks = await getAllEditorTasks();
            setEditorTasks(fetchEditorTasks);
            setEditorTasksObjectSortedByDate(
               fetchEditorTasks.reduce((acc: any, editorTask: any) => {
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
            )
         }
         load();
      }
   }, [isLoadingUser])

   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (user.role == "client") redirect('/dashboard');
   if (user.role == "editor") redirect('/editor');
   if (editorTasks == null) return <LoadingPage />;
   if (editorTasksObjectSortedByDate == null) return <LoadingPage />;
   
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
               <Card key={index} className="pd-2 pdx-2" maxWidth="400px" cursor onClick={() => router.push(`/admin/editor-task/${editorTask.taskId}`)} hoverAnimate analyticsCard>
                  <div className="text-xs bold-500">{editorTask.title}</div>
                  <div className="text-xxxs full mt-1 accent-color bold-600 dfb align-center gap-5">
                     <Timer size={16} /> Posted at {formatMilliseconds(editorTask.date).split(', ')[1]}
                  </div>
               </Card>
            ))}
         </div>
         <div className="text-m mb-4" />
      </div>))}
   </div>);
}

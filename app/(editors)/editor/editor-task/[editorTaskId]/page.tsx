import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import EditorTaskPage from "./EditorTaskPage";
import UsersDb from "@/db/user";
import EditorTasksDb from "@/db/editorTask";
import EditorsDb from "@/db/editor";

type ClientAdminPageProps = {
   params: Promise<{
      editorTaskId: string;
   }>
}

export async function generateMetadata ({ params }: ClientAdminPageProps) {
   const { editorTaskId } = await params;
   await connectToDatabase();
   const editorTask = await EditorTasksDb.findOne({ taskId: editorTaskId });
   return {
      title: `${editorTask.title} - Editor Task`,
   };
}

export default async function ClientAdminPage ({ params }: ClientAdminPageProps) {
   await connectToDatabase();
   const { editorTaskId } = await params;
   const session = await getServerSession(authOptions);

   if (session?.user) {
      const editorTask = await EditorTasksDb.findOne({ taskId: editorTaskId });
      const user = await UsersDb.findOne({ email: session?.user?.email!, role: 'editor' });
      const editor = await EditorsDb.findOne({ userid: user.userid });

      const isCompletedByEditor = (editor.tasksCompleted.filter((tasksComp: EditorTaskStatus) => (tasksComp.taskId == editorTaskId)).length > 0);

      return <EditorTaskPage 
         editorTask={JSON.parse(JSON.stringify(editorTask))}
         hasEditorCompleted={isCompletedByEditor}
      />
   } else {
      redirect('/login');
   }

}

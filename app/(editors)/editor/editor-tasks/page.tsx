import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import EditorTasks from "./EditorTasks";
import EditorTasksDb from "@/db/editorTask";
import UsersDb from "@/db/user";
import EditorsDb from "@/db/editor";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Editor Tasks - ${session?.user?.name!}`,
   };
}

export default async function EditorTasksPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      await connectToDatabase();
      const editorsTasks = await EditorTasksDb.find({});
      const user = await UsersDb.findOne({ email: session.user.email!, role: 'editor' });
      const editor = await EditorsDb.findOne({ userid: user.userid });

      const tasksCompletedByEditor = editor.tasksCompleted.reduce((acc: string[], task: EditorTaskStatus) => {
         acc.push(task.taskId);
         return acc;
      }, [])

      return <EditorTasks editorTasks={JSON.parse(JSON.stringify(editorsTasks))} tasksCompletedByEditor={tasksCompletedByEditor} />;
   } else {
      redirect('/login');
   }
}

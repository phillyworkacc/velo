import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import EditorTaskPage from "./EditorTaskPage";
import EditorTasksDb from "@/db/editorTask";

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
   const { editorTaskId } = await params;
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <EditorTaskPage editorTaskId={editorTaskId} />
   } else {
      redirect('/login');
   }

}

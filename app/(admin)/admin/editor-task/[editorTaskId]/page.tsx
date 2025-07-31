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
   const editorTask = await EditorTasksDb.findOne({ taskId: editorTaskId });
   const editors = await EditorsDb.find({});

   const editorsCompleted = editors.reduce((acc: number, editor: Editor) => {
      if (editor.tasksCompleted.filter(tasksComp => tasksComp.taskId === editorTaskId).length > 0) {
         acc += 1;
      }
      return acc;
   }, 0);

   const editorsApproved = editors.reduce((acc: number, editor: Editor) => {
      if (editor.tasksApproved.filter(tasksComp => tasksComp.taskId === editorTaskId).length > 0) {
         acc += 1;
      }
      return acc;
   }, 0);

   const editorsWhoAreApproved = editors.filter((editor: Editor) => (
      editor.tasksApproved.filter(taskApp => taskApp.taskId == editorTaskId).length > 0
   ))
   const ewa = await Promise.all(
      editorsWhoAreApproved.map(async(editor: Editor) => {
         const editorUser = await UsersDb.findOne({ userid: editor.userid });
         return {
            userid: editor.userid,
            tasksCompleted: editor.tasksCompleted,
            tasksApproved: editor.tasksApproved,
            payments: editor.payments,
            googleDriveFolderLink: editor.googleDriveFolderLink,
            user: {
               userid: editorUser.userid,
               name: editorUser.name,
               description: editorUser.description,
               email: editorUser.email,
               image: editorUser.image,
               role: editorUser.role,
               credentialMethod: editorUser.credentialMethod,
               onboarded: editorUser.onboarded,
               date: editorUser.date
            }
         } as EditorDetails
      })
   )

   if (session?.user) {
      return <EditorTaskPage 
         editorTask={JSON.parse(JSON.stringify(editorTask))}
         completed={editorsCompleted}
         approved={editorsApproved}
         editorsWhoAreApproved={JSON.parse(JSON.stringify(ewa))}
      />
   } else {
      redirect('/login');
   }

}

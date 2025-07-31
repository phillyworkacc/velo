import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import { VeloEditorProvider } from "@/hooks/useVeloEditor";
import EditorPage from "./EditorPage";
import UsersDb from "@/db/user";
import EditorsDb from "@/db/editor";

type ClientAdminPageProps = {
   params: Promise<{
      userid: string;
   }>
}

export async function generateMetadata ({ params }: ClientAdminPageProps) {
   const { userid } = await params;
   await connectToDatabase();
   const editor = await UsersDb.findOne({ userid, role: 'editor' });
   return {
      title: `${editor.name} - Editor`,
   };
}

export default async function EditorAdminPage ({ params }: ClientAdminPageProps) {
   const { userid } = await params;
   await connectToDatabase();
   const session = await getServerSession(authOptions);
   if (session?.user) {
      const editor = await EditorsDb.findOne({ userid });

      const editorTotalMoneyMade = editor.payments.reduce((acc: number, payment: EditorPayments) => {
         acc += payment.price;
         return acc;
      }, 0)

      const analytics = {
         totalAmountMade: editorTotalMoneyMade,
         noOfTasksApproved: editor.tasksApproved.length,
         noOfTaskCompleted: editor.tasksCompleted.length,
         payments: editor.payments
      }

      return <VeloEditorProvider userid={userid}>
         <EditorPage analytics={JSON.parse(JSON.stringify(analytics))} />
      </VeloEditorProvider>
   } else {
      redirect('/login');
   }

}

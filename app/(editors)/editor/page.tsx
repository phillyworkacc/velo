import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import EditorAppContent from "./EditorAppContent";
import UsersDb from "@/db/user";
import EditorsDb from "@/db/editor";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Dashboard - ${session?.user?.name!}`,
   };
}

export default async function AppPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      await connectToDatabase();
      const user = await UsersDb.findOne({ email: session.user.email!, role: 'editor' });
      const editor = await EditorsDb.findOne({ userid: user.userid });

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

      return <EditorAppContent analytics={JSON.parse(JSON.stringify(analytics))} />;
   } else {
      redirect('/login');
   }
}

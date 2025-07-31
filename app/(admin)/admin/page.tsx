import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import AdminAppContent from "./AdminAppContent";
import ClientsDb from "@/db/client";
import UsersDb from "@/db/user";
import EditorsDb from "@/db/editor";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Admin - ${session?.user?.name!}`,
   };
}

export default async function AppPage () {
   await connectToDatabase();
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      const clients = await ClientsDb.find({});
      const editors = await EditorsDb.find({});
      const admins = await UsersDb.find({ role: 'admin' });

      const analytics = {
         noOfAdmins: admins.length,
         noOfClients: clients.length,
         noOfEditors: editors.length
      }

      return <AdminAppContent analytics={analytics} />;
   } else {
      redirect('/login');
   }

}

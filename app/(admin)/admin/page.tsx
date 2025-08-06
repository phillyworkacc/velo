import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminAppContent from "./AdminAppContent";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Admin - ${session?.user?.name!}`,
   };
}

export default async function AppPage () {
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      return <AdminAppContent />;
   } else {
      redirect('/login');
   }

}

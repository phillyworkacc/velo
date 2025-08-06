import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Clients from "./Clients";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Clients - Admin - ${session?.user?.name!}`,
   };
}

export default async function ClientsPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <Clients />;
   } else {
      redirect('/login');
   }

}

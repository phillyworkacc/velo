import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AddClient from "./AddClient";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Add Client - Admin - ${session?.user?.name!}`,
   };
}

export default async function AddClientPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <AddClient />;
   } else {
      redirect('/login');
   }
}

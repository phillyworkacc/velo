import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Editors from "./Editors";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Editors - Admin - ${session?.user?.name!}`,
   };
}

export default async function EditorsPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <Editors />;
   } else {
      redirect('/login');
   }

}

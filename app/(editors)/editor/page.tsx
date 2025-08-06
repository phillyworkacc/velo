import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EditorAppContent from "./EditorAppContent";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Dashboard - ${session?.user?.name!}`,
   };
}

export default async function AppPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <EditorAppContent />;
   } else {
      redirect('/login');
   }
}

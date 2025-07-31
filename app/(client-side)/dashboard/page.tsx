import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import { VeloClientProvider } from "@/hooks/useVeloClient";
import AppContent from "./AppContent";
import UsersDb from "@/db/user";

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
      const clientUser = await UsersDb.findOne({ email: session.user.email!, role: 'client' });
      if (!clientUser) {
         const user = await UsersDb.findOne({ email: session.user.email! });
         if (user.role == "admin") redirect("/admin");
         if (user.role == "editor") redirect("/editor");
      }
      return <VeloClientProvider userid={clientUser.userid}>
         <AppContent />
      </VeloClientProvider>
   } else {
      redirect('/login');
   }

}

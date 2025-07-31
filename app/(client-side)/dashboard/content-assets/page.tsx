import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import { VeloClientProvider } from "@/hooks/useVeloClient";
import UsersDb from "@/db/user";
import ContentAssets from "./ContentAssets";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Content Assets - ${session?.user?.name!}`,
   };
}

export default async function AppPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      await connectToDatabase();
      const clientUser = await UsersDb.findOne({ email: session.user.email!, role: 'client' });
      if (!clientUser) redirect("/login");
      return <VeloClientProvider userid={clientUser.userid}>
         <ContentAssets />
      </VeloClientProvider>
   } else {
      redirect('/login');
   }

}

import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import PostsPage from "./PostsPage";
import UsersDb from "@/db/user";
import { VeloClientProvider } from "@/hooks/useVeloClient";

export async function generateMetadata () {
   const session = await getServerSession(authOptions);
   return {
      title: `Posts - ${session?.user?.name!}`,
   };
}

export default async function ClientPostsPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      await connectToDatabase();
      const clientUser = await UsersDb.findOne({ email: session.user.email!, role: 'client' });
      if (!clientUser) redirect("/login");
      return <VeloClientProvider userid={clientUser.userid}>
         <PostsPage />
      </VeloClientProvider>

   } else {
      redirect('/login');
   }
}

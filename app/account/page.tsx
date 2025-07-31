import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Account from "./Account";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Account - ${session?.user?.name!}`,
   };
}

export default async function AccountPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <Account />;
   } else {
      redirect('/login');
   }
}

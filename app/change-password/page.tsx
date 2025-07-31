import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ChangePwdForm from "./ChangePwdForm";

export default async function Login() {
   const session  = await getServerSession(authOptions);
   
   if (session?.user) {
      return <ChangePwdForm />;
   } else {
      redirect('/app');
   }

}

'use client'
import "@/styles/app.css"
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { useUser } from "@/hooks/useUser";
import { FilePlus, NotebookPen, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CSSProperties } from "react";
import { numberFormatting } from "@/utils/utils";

type AdminAppContentProps = {
   analytics: {
      noOfAdmins: number;
      noOfClients: number;
      noOfEditors: number;
   }
}

export default function AdminAppContent ({ analytics }: AdminAppContentProps) {
   const { user, isLoadingUser } = useUser();
   const router = useRouter();
   const cardStyle: CSSProperties = {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
   }
   
   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;

   return (
      <AppWrapper>
         <div className="text-xxl bold-700 mb-2">Welcome to your Dashboard, {user.name}</div>

         <div className="text-l bold-700 mb-1">Analytics</div>
         <div className='text-s dfb wrap gap-15 w-full'>
            {/* Row 1 */}
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-xxxs grey-5">Clients (Total)</div>
               <div className="text-mb bold-800 mb-15">{numberFormatting(analytics.noOfClients)}</div>
            </Card>
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-xxxs grey-5">Editors (Total)</div>
               <div className="text-mb bold-800 mb-15">{numberFormatting(analytics.noOfEditors)}</div>
            </Card>
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-xxxs grey-5">Admins (Total)</div>
               <div className="text-mb bold-800 mb-15">{numberFormatting(analytics.noOfAdmins)}</div>
            </Card>
         </div>

         <div className="text-l bold-700 mb-1 mt-4">Actions</div>
         <div className='text-s dfb wrap gap-15 w-full'>
            {/* Row 1 */}
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-s bold-600">Create a Client Account</div>
               <div className="text-xxs grey-5 pd-1">Make a client account for a client who has paid for the services.</div>
               <div className="text-s dfb">
                  <AwaitButton className="xxs" onClick={() => router.push("/admin/add-client")}>
                     <UserPlus size={15} /> Create Client
                  </AwaitButton>
               </div>
            </Card>
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-s bold-600">Create a Editor Account</div>
               <div className="text-xxs grey-5 pd-1">Make a client account for a client who has paid for the services.</div>
               <div className="text-s dfb">
                  <AwaitButton className="xxs" onClick={() => router.push("/admin/add-editor")}>
                     <FilePlus size={15} /> Create Editor
                  </AwaitButton>
               </div>
            </Card>
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-s bold-600">Create a Editor Task</div>
               <div className="text-xxs grey-5 pd-1">Make a task for the Velo editors to complete for a client on a subscription.</div>
               <div className="text-s dfb">
                  <AwaitButton className="xxs" onClick={() => router.push("/admin/add-editor-task")}>
                     <NotebookPen size={15} /> Create Editor Task
                  </AwaitButton>
               </div>
            </Card>
         </div>
      </AppWrapper>
   );
}

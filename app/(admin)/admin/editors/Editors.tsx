'use client'
import "@/styles/app.css"
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import { useUser } from "@/hooks/useUser";
import { formatMilliseconds } from "@/utils/date";
import { redirect, useRouter } from "next/navigation";
import { CustomIcon } from "@/components/Icons/Icon";
import { CircleCheck } from "lucide-react";

export default function Editors ({ editors }: { editors: EditorDetails[] }) {
   const { user, isLoadingUser } = useUser();

   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (user.role == "client") redirect('/dashboard');
   if (user.role == "editor") redirect('/editor');
   
   return (
      <AppWrapper>
         <div className="text-xxl bold-700 mb-1">All Editors</div>
         <div className="text-xxs grey-4 mb-2">These are all the editors on Velo, {editors.length} editor{editors.length !== 1 && 's'}</div>
         <div className="text-s dfb wrap gap-15 w-full">
            {(editors.length > 0) ? (<>
               {editors.map((editor, index) => (<Editor key={index} editorDetail={editor} />))}
            </>) : (<>
               <div className="text-xxs grey-4">No editors yet</div>
            </>)}
         </div>
      </AppWrapper>
   );
}

function Editor ({ editorDetail }: { editorDetail: EditorDetails }) {
   const router = useRouter();

   return <Card className="pd-2 pdx-2" maxWidth="500px" cursor onClick={() => router.push(`/admin/editor/${editorDetail.userid}`)} hoverAnimate analyticsCard>
      <div className="text-s bold-700 dfb align-center gap-7">
         <CustomIcon url={editorDetail.user.image} size={26} round />
         {editorDetail.user.name}
         {(editorDetail.tasksCompleted.length > 0) && (<CircleCheck fill="#2054FF" color="#ffffff" size={20} />)}
      </div>
      <div className="text-xxs grey-4 pd-1">{editorDetail.user.email}</div>
      <div className="text-xxs grey-4 dfb align-center gap-7">
         <span>{editorDetail.tasksCompleted.length} task{editorDetail.tasksCompleted.length !== 1 && 's'} completed</span>
         <span>{editorDetail.tasksApproved.length} task{editorDetail.tasksApproved.length !== 1 && 's'} approved</span>
      </div>
      <div className="text-xxxs grey-4 full mt-1">Joined Velo on {formatMilliseconds(editorDetail.user.date).split(',')[0]}</div>
   </Card>
}
'use client'
import { CustomIcon } from "@/components/Icons/Icon"
import { copyToClipboard } from "@/lib/str";
import { userDefaultImage } from "@/utils/constants";
import { formatMilliseconds } from "@/utils/date";
import { CircleCheck, Copy, FolderOpen, Trash2 } from "lucide-react";
import { CSSProperties } from "react";
import { moneyFormatting, numberFormatting } from "@/utils/utils";
import { useVeloEditor } from "@/hooks/useVeloEditor";
import { validateGoogleDriveFolderLink } from "@/utils/validation";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import Link from "next/link";

type EditorPageProps = {
   analytics: {
      totalAmountMade: number;
      noOfTasksApproved: number;
      noOfTaskCompleted: number;
      payments: EditorPayments[];
   }
}

export default function EditorPage ({ analytics }: EditorPageProps) {
   const { editor, isLoadingEditor, actions } = useVeloEditor();
   const cardStyle: CSSProperties = {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
   }

   const deleteUserAccBtn = async (name: string) => { 
      if (confirm(`Are you sure you want to delete ${name}'s account?`)) {
         actions.deleteAccount();
      }
   }

   if (isLoadingEditor) return <LoadingPage />;
   if (editor == null) return <LoadingPage />;

   return (
      <AppWrapper>
         <div className="text-l bold-600 text-left">
            <CustomIcon url={editor.user.image! || userDefaultImage} size={60} round />
         </div>
         <div className="text-l mt-1 bold-700 horizontal-convertible vertical-center gap-5">
            <div className="text-l full dfb align-center gap-4">
               {editor.user.name}
               {(editor.tasksCompleted.length > 0) && (<CircleCheck fill="#2054FF" color="#ffffff" size={20} />)}
            </div>
            <button className="delete xxxs pd-1 whitespace-nowrap" onClick={() => deleteUserAccBtn(editor.user.name)}>
               <Trash2 size={15} /> Delete Editor Account
            </button>
         </div>

         <div className="text-xxs grey-4 dfb align-center gap-4 pd-05">
            {editor.user.email}
            <button className="transparent xxs" onClick={() => copyToClipboard(editor.user.email!)}><Copy size={15} /></button>
         </div>
         <div className="text-xxs grey-4">Joined Velo on {formatMilliseconds(editor.user.date).split(',')[0]}</div>

         <div className="text-xs grey-4 pd-1 mb-05">
            <Link href={editor.googleDriveFolderLink} target="_blank">
               {validateGoogleDriveFolderLink(editor.googleDriveFolderLink) ? (<>
                  <button className="xxs pd-1 pdx-4 grey">
                     <CustomIcon url="/assets/google-drive.png" size={17} /> Google Drive Folder
                  </button>
               </>) : (<>
                  <button className="xxs pd-1 pdx-4">
                     <FolderOpen size={17} /> Cloud Folder
                  </button>
               </>)}
            </Link>
         </div>


         <div className="text-l bold-700 mb-1 mt-4">Analytics</div>
         <div className='text-s dfb wrap gap-15 w-full'>
            {/* Row 1 */}
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-xxxs grey-5">Money {editor.user.name} Made (Total)</div>
               <div className="text-mb bold-800 mb-15">£{moneyFormatting(analytics.totalAmountMade)}</div>
            </Card>
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-xxxs grey-5">Tasks Approved</div>
               <div className="text-mb bold-800 mb-15">{numberFormatting(analytics.noOfTasksApproved)}</div>
            </Card>
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-xxxs grey-5">Tasks Completed</div>
               <div className="text-mb bold-800 mb-15">{numberFormatting(analytics.noOfTaskCompleted)}</div>
            </Card>
         </div>
      </AppWrapper>
   )
}

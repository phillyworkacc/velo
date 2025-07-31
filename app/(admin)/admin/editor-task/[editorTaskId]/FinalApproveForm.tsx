'use client'
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Link from "next/link";
import Select from "@/components/Select/Select";
import { CustomIcon } from "@/components/Icons/Icon";
import { Rocket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { titleCase } from "@/lib/str";
import { approvePost } from "@/app/actions/admin";

type FinalApproveFormProps = {
   editor: EditorDetails;
   client: ClientDetails;
   taskId: string;
   onApprovePost: Function;
   onError: (error: string | undefined) => void;
}

export default function FinalApproveForm ({ editor, client, taskId, onApprovePost, onError }: FinalApproveFormProps) {
   const [socialMediaLink, setSocialMediaLink] = useState('');
   const [price, setPrice] = useState('');
   const [postPlatform, setPostPlatform] = useState<SocialMedia>(client.platforms[0].platform);

   const approvePostBtn = async () => {
      if (socialMediaLink == "") {
         toast.error("Please provide the link to the social media post");
         return;
      }
      if (!postPlatform) {
         toast.error("Please provide a post platform for the social media post");
         return;
      }
      if (isNaN(parseFloat(price)) || !parseFloat(price)) {
         toast.error("Please provide a valid price for the social media post");
         return;
      }
      const approvedResult = await approvePost({
         taskId, price: parseFloat(price),
         clientUserId: client.user.userid,
         editorUserId: editor.user.userid,
         postPlatform, postLink: socialMediaLink
      })
      if (approvedResult?.error) {
         onError(approvedResult.result);
      } else {
         onApprovePost();
      }
   }

   return (
      <div className="text-s dfb column gap-10 mt-2">
         <div className="text-m bold-700">
            {editor.user.name} & {client.user.name}
         </div>

         <div className="text-xxs grey-4">
            {editor.user.name}'s work has been posted for {client.user.name}. Are you sure you approve this ?
         </div>

         <Link 
            href={editor.tasksCompleted.filter(taskComp => taskComp.taskId == taskId)[0].googleDriveLink}
            target="_blank"
            className="text-xxs accent-color dfb align-center gap-5 visible-link"
         >
            <CustomIcon url="/assets/google-drive.png" size={20} />
            {editor.tasksCompleted.filter(taskComp => taskComp.taskId == taskId)[0].googleDriveLink}
         </Link>


         
         <div className="text-s dfb column gap-10 mt-15" style={{ maxWidth: "700px" }}>           
            <Select
               style={{ width: '100%' }}
               defaultOptionIndex={0}
               options={[
                  ...client.platforms.map(plt_fm => (
                     <span className="text-xxs dfb align-center gap-4">
                        <CustomIcon url={`/platforms/${plt_fm.platform}.png`} size={20} /> {titleCase(plt_fm.platform)}
                     </span>
                  ))
               ]}
               onSelect={(option, index) => setPostPlatform(client.platforms[index!].platform)}
            />
            <input 
               type="text" 
               className="xxs full pd-1" 
               placeholder="Post Social Media Link"
               value={socialMediaLink}
               onChange={(e) => setSocialMediaLink(e.target.value)}
            />
            <input 
               type="text" 
               className="xxs full pd-1" 
               placeholder="Price for post (£)" 
               value={price}
               onChange={(e) => setPrice(e.target.value)}
            />
         </div>

         <div className="text-s" />
         
         <AwaitButton className="xxs pd-11 pdx-4" onClick={approvePostBtn}>
            <Rocket size={17} /> Approve Post
         </AwaitButton>
      </div>
   )
}

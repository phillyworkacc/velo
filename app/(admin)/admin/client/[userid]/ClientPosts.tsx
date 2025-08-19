'use client'
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Card from "@/components/Card/Card"
import Select from "@/components/Select/Select";
import { CustomIcon } from "@/components/Icons/Icon";
import { useVeloClient } from "@/hooks/useVeloClient"
import { titleCase } from "@/lib/str";
import { CirclePlus, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatMilliseconds } from "@/utils/date";
import { toast } from "sonner";
import Link from "next/link";

export default function ClientPosts () {
   const { client, actions } = useVeloClient();
   const [showCreatePost, setShowCreatePost] = useState(false);
   const [clientPostForm, setClientPostForm] = useState<ClientPost>({
      link: '', platform: 'facebook', date: 0, editorUserId: '', taskId: ''
   })

   if (client == null) return <></>;

   const createPost = async () => {
      if (clientPostForm.link == '') {
         toast.error(`Please enter the link to the ${titleCase(clientPostForm.platform)} post`);
         return;
      }
      actions.posts.add({ ...clientPostForm, date: Date.now() });
      setShowCreatePost(false);
   }

   return (<>
      {(showCreatePost) ? (<Card maxWidth="900px" className="pd-15 pdx-15">
         <div className="text-s bold-600 text-left mb-1">Create Post</div>
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
            onSelect={(option, index) => setClientPostForm(prev => ({ ...prev, platform: client.platforms[index!].platform }))}
         />
         <div className="text-s pd-1">
            <input 
               type="text" 
               placeholder="Post Link" className="xxs pd-1 pdx-15 full" 
               value={clientPostForm.link} 
               onChange={(e) => setClientPostForm(prev => ({ ...prev, link: e.target.value }))} 
            />
         </div>
         <div className="dfb align-center text-s gap-15">
            <AwaitButton 
               className="xxs pd-1 full" 
               onClick={createPost}
            ><PlusCircle size={17} /> Create Post</AwaitButton>
            <button className="outline-black full pd-1 xxs" onClick={() => setShowCreatePost(false)}>Cancel</button>
         </div>
      </Card>) : (<>
         <div className="text-s full mb-3">
            <button className="xxs pd-1 pdx-15" onClick={() => setShowCreatePost(true)}><CirclePlus size={17} /> Add Post</button>
         </div>
      </>)}

      {(client.posts.length < 1) && (<div className="text-xxs grey-4">No posts</div>)}
      <div className="text-s dfb gap-10 wrap">
         {client.posts.map((post, index) => (
            <Card key={index} className="pd-2 pdx-2" maxWidth="600px" analyticsCard>
               <CustomIcon url={`/platforms/${post.platform.toLowerCase()}.png`} size={40} />
               <div className="text-s bold-600 pd-1">
                  @{client.platforms.find(pltFm => pltFm.platform == post.platform)?.username!}
               </div>
               <Link href={post.link} target="_blank" className="text-xxs mb-1 accent-color">Click to view {post.platform} post</Link>
               <div className="text-xxxs grey-4 full">Posted on {formatMilliseconds(Date.now()).split(',')[0]}</div>
            </Card>
         ))}
      </div>
   </>)
}

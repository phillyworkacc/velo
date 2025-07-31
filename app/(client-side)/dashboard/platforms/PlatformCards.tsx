'use client'
import Card from "@/components/Card/Card"
import Select from "@/components/Select/Select"
import AwaitButton from "@/components/AwaitButton/AwaitButton"
import Link from "next/link"
import { CustomIcon } from "@/components/Icons/Icon"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useVeloClient } from "@/hooks/useVeloClient"
import { titleCase } from "@/lib/str"
import { CirclePlus, Edit, SquareArrowOutUpRight, Trash2 } from "lucide-react"

export default function PlatformCards () {
   const router = useRouter();
   const { client, actions } = useVeloClient();
   
   const [showEditPlatform, setShowEditPlatform] = useState(false)

   const [addPlatformForm, setAddPlatformForm] = useState<SocialMediaPlatform>({
      platform: 'facebook', username: '', link: ''
   })

   const [editingPlatformForm, setEditingPlatformForm] = useState<SocialMediaPlatform>({
      platform: 'facebook', username: '', link: ''
   })

   const convertIndexToSocialMediaPlatform = (index: number): SocialMedia => {
      return (index == 0) ? 'facebook' : (index == 1) ? 'instagram' : (index == 2) ? 'tiktok' : (index == 3) ? 'youtube' : 'linkedin'
   }

   const addPlatformBtn = () => {
      if (addPlatformForm.link == '' || addPlatformForm.username == '') {
         toast.error(`Please enter a username or link for your ${titleCase(addPlatformForm.platform)} account`)
         return;
      }
      actions.platforms.add(addPlatformForm);
      setAddPlatformForm({ platform: 'facebook', username: '', link: '' });
   }

   const editPlatformBtn = () => {
      if (editingPlatformForm.link == '' || editingPlatformForm.username == '') {
         toast.error(`Please enter a username or link for your ${titleCase(editingPlatformForm.platform)} account`)
         return;
      }
      actions.platforms.edit(editingPlatformForm.platform, editingPlatformForm);
      setShowEditPlatform(false);
      setEditingPlatformForm({ platform: 'facebook', username: '', link: '' });
   }

   const deletePlatform = (platform: SocialMedia) => {
      if (confirm(`Are you sure you want to remove your ${titleCase(platform)} from Velo`)) {
         actions.platforms.delete(platform);
         router.refresh()
      }
   }

   return (
      <>
         <div className="text-s dfb wrap gap-15">
            {client?.platforms.map((socialMediaPlatform, index) => (
               <Card key={index} full className="pd-15 pdx-15" analyticsCard maxWidth="500px">
                  <div className="text-s full dfb align-center gap-8">
                     <div className="text-sm bold-700">{titleCase(socialMediaPlatform.platform)}</div>
                  </div>
                  <div className="horizontal-convertible gap-5 pd-05">
                     <div className="text-s fit dfb align-center gap-5">
                        <div className="text-s fit">
                           <CustomIcon url={`/platforms/${socialMediaPlatform.platform}.png`} size={25} />
                        </div>
                        <div className="text-xxs full">
                           <Link className="text-xxs dfb align-center gap-5 visible-link accent-color" href={socialMediaPlatform.link} target="_blank">
                              {socialMediaPlatform.username} <SquareArrowOutUpRight size={17} />
                           </Link>
                        </div>
                     </div>
                     <div className="text-s dfb fit align-center gap-5 pd-05">
                        <button className="grey" onClick={() => {
                           setShowEditPlatform(true); setEditingPlatformForm(socialMediaPlatform);
                        }}><Edit size={16} /></button>
                        <button className="delete" onClick={() => deletePlatform(socialMediaPlatform.platform)}><Trash2 size={16} /></button>
                     </div>
                  </div>
               </Card>
            ))}
         </div>
         
         {(showEditPlatform) && (<div className="pd-15 pdx-15 full" style={{maxWidth:"900px"}}>
            <div className="text-ml bold-700 text-left mt-4">Edit {titleCase(editingPlatformForm.platform!)} Account Info</div>
            <span className="text-xxs pd-1 dfb align-center gap-4 wrap" style={{wordBreak:"break-word"}}>
               <CustomIcon url={`/platforms/${editingPlatformForm.platform}.png`} size={20} />
               <b className="text-xxs fit">Current Username:</b>
               <span className="text-xxs fit">
                  {client?.platforms.filter(plt_fm => plt_fm.platform == editingPlatformForm.platform)[0].username}
               </span>
            </span>
            <div className="text-s pd-1">
               <input 
                  type="text" 
                  placeholder="New Username" 
                  className="xxs pd-1 pdx-15 full" 
                  value={editingPlatformForm.username} 
                  onChange={(e) => setEditingPlatformForm(prev => ({ ...prev, username: e.target.value }))} 
               />
            </div>
            <div className="text-s mb-1">
               <input 
                  type="text" 
                  placeholder="New Link" 
                  className="xxs pd-1 pdx-15 full" 
                  value={editingPlatformForm.link} 
                  onChange={(e) => setEditingPlatformForm(prev => ({ ...prev, link: e.target.value }))} 
               />
            </div>
            <div className="dfb align-center text-s gap-15">
               <AwaitButton 
                  className="xxs full pd-1" 
                  onClick={editPlatformBtn}
                  afterRunFunction={() => router.refresh()}
               >Edit Username</AwaitButton>
               <button className="outline-black full pd-1 xxs" onClick={() => setShowEditPlatform(false)}>Cancel</button>
            </div>
         </div>)}

         <div className="text-s dfb column mt-4 full" style={{maxWidth:"700px"}}>
            <div className="text-ml bold-700 text-left mb-1">Add Platform</div>
            <Select
               style={{ width: '100%' }}
               defaultOptionIndex={0}
               options={[
                  <span className="text-xxs dfb align-center gap-4 pd-05"><CustomIcon url="/platforms/facebook.png" size={20} /> Facebook</span>,
                  <span className="text-xxs dfb align-center gap-4 pd-05"><CustomIcon url="/platforms/instagram.png" size={20} /> Instagram</span>,
                  <span className="text-xxs dfb align-center gap-4 pd-05"><CustomIcon url="/platforms/tiktok.png" size={20} /> TikTok</span>,
                  <span className="text-xxs dfb align-center gap-4 pd-05"><CustomIcon url="/platforms/youtube.png" size={20} /> YouTube</span>,
                  <span className="text-xxs dfb align-center gap-4 pd-05"><CustomIcon url="/platforms/linkedin.png" size={20} /> LinkedIn</span>
               ]}
               onSelect={(option, index) => setAddPlatformForm(prev => ({ ...prev, platform: convertIndexToSocialMediaPlatform(index!) }) )}
            />
            <div className="text-s pd-1">
               <input 
                  type="text" 
                  placeholder="Username" 
                  className="xxs pd-1 pdx-15 full" 
                  value={addPlatformForm.username} 
                  onChange={(e) => setAddPlatformForm(prev => ({ ...prev, username: e.target.value }) )} 
               />
            </div>
            <div className="text-s mb-1">
               <input 
                  type="text" 
                  placeholder="Link" 
                  className="xxs pd-1 pdx-15 full" 
                  value={addPlatformForm.link} 
                  onChange={(e) => setAddPlatformForm(prev => ({ ...prev, link: e.target.value }) )} 
               />
            </div>
            <div className="dfb align-center text-s gap-15">
               <AwaitButton 
                  className="xxs fit pd-1 pdx-5" 
                  onClick={addPlatformBtn}
                  afterRunFunction={() => router.refresh()}
               ><CirclePlus size={17} /> Add Platform</AwaitButton>
            </div>
         </div>
      </>
   )
}

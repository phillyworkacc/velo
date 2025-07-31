'use client'
import '@/styles/auth.css'
import { VeloSvgLogo } from '@/components/Icons/Icon'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { wait } from '@/utils/wait'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { changeUserPassword } from '../actions/user'
import Spinner from '@/components/Spinner/Spinner'

export default function ChangePwdForm () {
   const { data: session } = useSession();
   const router = useRouter();

   const [password, setPassword] = useState('');
   const [password2, setPassword2] = useState('');
   const [buttonLoading, setButtonLoading] = useState(false);

   const continueBtn = async () => {
      setButtonLoading(true)
      await wait(1)
      if (password !== password2) {
         toast.error("Passwords do not match");
         setButtonLoading(false);
         return;
      }
      const changed = await changeUserPassword(session?.user?.email!, password);
      if (changed) {
         toast.success("Successfully Changed Password");
         router.push("/account");
      } else {
         toast.error("Failed to change password");
         setButtonLoading(false);
      }
      setButtonLoading(false);
   }

   return (
      <div className='auth'>
         <div className="auth-box">
            <VeloSvgLogo size={70} />
            <div className="text-ml bold-700 pd-05">Change Your Password</div>
            <div className="text-xs bold-500 grey-4 mb-2">{session?.user?.name}</div>
            <div className="form">
               <div className="form-content">
                  <input 
                     type="password" 
                     className="text-xxs pd-1" 
                     placeholder='Password' 
                     value={password} 
                     onChange={(e) => setPassword(e.target.value)} />
               </div>
               <div className="form-content">
                  <input 
                     type="password" 
                     className="text-xxs pd-1" 
                     placeholder='Password (again)' 
                     value={password2} 
                     onChange={(e) => setPassword2(e.target.value)} />
               </div>
               <div className="form-content">
                  <button className='xxs full pd-12' onClick={continueBtn} disabled={buttonLoading}>
                     {buttonLoading ? <Spinner /> : <>Change Password <ArrowRight size={17} /></>}
                  </button>
               </div>
               <div className="form-content">
                  <button className='xxs full pd-12 outline-black' onClick={() => router.push("/account")}>
                     <ArrowLeft size={17} /> Back to Account
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

'use client'
import '@/styles/auth.css'
import { GoogleIcon, VeloSvgLogo } from '@/components/Icons/Icon'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { wait } from '@/utils/wait'
import { toast } from 'sonner'
import { validateEmail } from '@/utils/validation'
import { doesEmailExist, getUserDetailsViaLogin } from '../actions/user'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/Spinner/Spinner'

export default function LoginForm() {
   const router = useRouter();

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [buttonLoading, setButtonLoading] = useState(false)

   const [formState, setFormState] = useState<'login'| 'none'>('none');

   const checkEmail = async () => {
      if (email == "") { toast.error("Please enter an email"); return; }
      if (!validateEmail(email)) { toast.error("Please enter a valid email"); return; }
      const emailIsAvailable = await doesEmailExist(email);
      if (!emailIsAvailable) { toast.error("Email does not have account"); return; }
      setFormState('login');
   }

   const continueBtn = async () => {
      setButtonLoading(true)
      await wait(1)
      if (formState == "none") {
         checkEmail();
         setButtonLoading(false);
         return;
      } else if (formState == "login") {
         const response = await signIn("credentials", { email, password, redirect: false })
         if (response?.error) {
            toast.error("Incorrect email or password")
         } else {
            const user = await getUserDetailsViaLogin(email, password);
            router.push(user?.role == "client" ? '/dashboard' : '/editor');
         }
      }
      setButtonLoading(false);
   }

   return (
      <div className='auth'>
         <div className="auth-box">
            <VeloSvgLogo size={70} />
            <div className="text-ml bold-700 pd-2">Login</div>
            <div className="form">
               {(formState == "none") ? (<>
                  <div className="form-content">
                     <input 
                        type="text" 
                        className="text-xxs pd-1" 
                        placeholder='Email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} />
                  </div>
               </>) : (<>
                  <div className="text-s full pd-1">
                     <div className="text-xxs fit dfb gap-3 align-center cursor-pointer" onClick={() => setFormState("none")}>
                        <ArrowLeft size={17} /> {email}
                     </div>
                  </div>
                  <div className="form-content">
                     <input 
                        type="password" 
                        className="text-xxs pd-1" 
                        placeholder='Password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />
                  </div>
               </>)}
               <div className="form-content">
                  <button className='xxs full  pd-12' onClick={continueBtn} disabled={buttonLoading}>
                     {buttonLoading ? <Spinner /> : <>Continue <ArrowRight size={17} /></>}
                  </button>
               </div>
               <div className="form-content">
                  <button className='xxs full pd-12 outline-black' onClick={() => signIn("google")}>
                     <GoogleIcon size={17} /> Continue with Google
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

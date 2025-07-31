'use client'
import '@/styles/auth.css'
import { VeloSvgLogo } from '@/components/Icons/Icon'
import { Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound () {
   const router = useRouter();

   return (
      <div className='auth'>
         <div className="auth-box">
            <VeloSvgLogo size={70} />
            <div className="text-xl bold-700 pd-2">Page - Not Found</div>
            <div className="form-content">
               <button className='xxs full pd-12 outline-black' onClick={() => router.push("/dashboard")}>
                  <Home size={17} /> Back to Home
               </button>
            </div>
         </div>
      </div>
   )
}

'use client'
import { VeloLogo } from "@/components/Icons/Icon";
import { useVeloClient } from "@/hooks/useVeloClient";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { toast } from "sonner";
import LoadingOnboardingPage from "./LoadingOnboarding";
import OnboardingCard from "@/components/OnboardingCard/Card";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import StarRating from "@/components/StarRating/StarRating";
import Selections from "@/components/Selections/Selections";

export default function OnboardingForm () {
   const router = useRouter();
   const { client, isLoadingClient, onboarding } = useVeloClient();

   const [formPage, setFormPage] = useState<'questions' | 'set-password' | 'enter-code' | 'finish'>('enter-code');
   const [securityCode, setSecurityCode] = useState('');
   const [password, setPassword] = useState('')
   const [password2, setPassword2] = useState('')
   const [onboardingAnswers, setOnboardingAnswers] = useState<Onboarding>({
      userid: '',
      meetingReview: '',
      meetingRating: 0,
      expectations: '',
      platforms: []
   });

   if (isLoadingClient) return <LoadingOnboardingPage />;
   if (client == null) return <LoadingOnboardingPage />;
   if (!client?.userid) return <LoadingOnboardingPage textDisplay="Invalid Onboarding Link" />;

   const nextButton = async () => {
      if (!client) return;
      setOnboardingAnswers(prev => ({ ...prev, userid: client.userid }));
      if (formPage == "enter-code") {
         if (securityCode == "") {
            toast.error("Please enter your security code");
            return;
         }
         const response = await onboarding.checkSecurityCode(securityCode)
         if (response) {
            setFormPage("set-password");
         } else {
            toast.error("Invalid security code");
         }
      } else if (formPage == "set-password") {
         if (password == "") {
            toast.error("Please enter a password");
            return;
         }
         if (password !== password2) {
            toast.error("Passwords do not match");
            return;
         }
         const response = await onboarding.setPassword(password)
         if (response) {
            setFormPage("questions");
         } else {
            toast.error("Failed to create password");
         }
      } else if (formPage == "questions") {
         const response = await onboarding.finishOnboarding(onboardingAnswers)
         if (response) {
            setFormPage("finish");
         } else {
            toast.error("Failed to create password");
         }
      } else if (formPage == "finish") {
         const result = await onboarding.completeOnboarding();
         if (result) {
            const response = await signIn("credentials", { email: client?.user.email!, password, redirect: false })
            if (response?.error) {
               toast.error("Incorrect email or password")
            } else {
               router.push("/login")
            }
         } else {
            toast.error("Failed to finish onboarding you. Please try again later.");
         }
      }
   }


   return (<>
      <OnboardingCard>
         <div className="text-s dfb gap-5 align-center pd-3 mb-1" style={{ height: '3vh' }}>
            <VeloLogo size={50} /> {client.user.name}
         </div>

         {(formPage == "enter-code") && (<>
            <div className="text-l bold-600 pd-1 full mb-05">Security Code</div>
            <div className="text-xxs full dfb align-center gap-6 mb-15">Please enter the code provided by the admin. This is for security purposes <Lock size={16} /></div>
            <input type="text" className="s pd-15 pdx-2 full" placeholder="Security Code" value={securityCode} onChange={e => setSecurityCode(e.target.value)} />
         </>)}

         {(formPage == "set-password") && (<>
            <div className="text-l bold-600 pd-1 full mb-05">Create your password</div>
            <div className="text-xxs full dfb align-center gap-6 mb-2">Please create a password to secure your account. This is to protect your account <Lock size={16} /></div>
            <input type="password" className="xxs pd-1 full" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <br /><br />
            <input type="password" className="xxs pd-1 full" placeholder="Password (again)" value={password2} onChange={e => setPassword2(e.target.value)} />
         </>)}

         {(formPage == "questions") && (<>
            <div className="text-l bold-600 pd-1 full mb-05">You're almost done !</div>
            <div className="text-xxs full dfb align-center gap-6 mb-2">Please answer the following questions to finish the onboarding questions</div>
            
            <div className="text-xxs bold-500 mb-05">What do you think about the call you just had ? (Brief Answer)</div>
            <textarea className="full xxs pd-1 h-10" value={onboardingAnswers.meetingReview} onChange={e => setOnboardingAnswers(prev => ({ ...prev, meetingReview: e.target.value }))} />

            <div className="text-xxs bold-500 mb-05 mt-2">How did the call go ? (Rating)</div>
            <StarRating onRate={(rating) => setOnboardingAnswers(prev => ({ ...prev, meetingRating: rating }))} />

            <div className="text-xxs bold-500 mb-05 mt-2">What are your expectations when working with us ? (Brief Answer)</div>
            <textarea className="full xxs pd-1 h-10" value={onboardingAnswers.expectations} onChange={e => setOnboardingAnswers(prev => ({ ...prev, expectations: e.target.value }))} />

            <div className="text-xxs bold-500 mb-05 mt-2">What platforms are you looking to work with ? (Select all that apply)</div>
            <Selections options={['Facebook','Instagram','TikTok','YouTube','LinkedIn']} onSelect={(options) => setOnboardingAnswers(prev => ({ ...prev, platforms: options }))} />
         </>)}
         
         {(formPage == "finish") && (<>
            <div className="text-l bold-600 pd-1 full mb-05">You have completed the onboarding form</div>
            <div className="text-xxs full dfb align-center gap-6 mb-2">To continue into your account, click the button below to access all the features Velo has to offer you </div>
            <AwaitButton className="xxs pd-1" onClick={nextButton}>Continue into account <ArrowRight size={15} /></AwaitButton>
         </>)}

         {(formPage !== "finish") && (<div className="text-s dfb align-center pd-15">
            <div className="text-xxs grey-5 pdx-05">
               Step {formPage == "enter-code" ? 1 : (formPage == "set-password" ? 2 : 3)} of 3
            </div>
            <AwaitButton onClick={nextButton} className="xs pd-1 pdx-2">{(formPage == "questions" ? 'Finish' : 'Next')} <ArrowRight size={17} /></AwaitButton>
         </div>)}
      </OnboardingCard>
   </>)
}

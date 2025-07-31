'use client'
import { wait } from "@/utils/wait";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";

type AwaitButtonProps = {
   className: string;
   onClick: Function;
   children: React.ReactNode;
   waitTime?: number;
   afterRunFunction?: Function;
   blackSpinner?: boolean;
}

export default function AwaitButton ({ children, onClick, className, waitTime = 1, afterRunFunction, blackSpinner }: AwaitButtonProps) {
   const [loadingState, setLoadingState] = useState(false)
   const clickBtn = async () => {
      setLoadingState(true);
      await wait(waitTime);
      onClick();
      setLoadingState(false);
      if (afterRunFunction) afterRunFunction();
      return;
   }
   return (
      <button className={className} onClick={clickBtn} disabled={loadingState}>
         {loadingState ? <div style={{paddingLeft:'5px'}}><Spinner black={blackSpinner} /></div> : children}
      </button>
   )
}

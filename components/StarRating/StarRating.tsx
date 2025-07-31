'use client'
import "./StarRating.css"
import { useState } from "react";
import { Star } from "lucide-react";

type StarRating = {
   onRate: (rating: number) => void;
}

export default function StarRating ({ onRate }: StarRating) {
   const [starHovers, setStarHovers] = useState([false,false,false,false,false])
   const [lockedNum, setLockedNum] = useState(-1)

   const setAllHovers = (endIndex: number, lock?: boolean) => {
      setStarHovers(prev => ([ ...prev.map((star, index) => (index <= endIndex)) ]))
      if (lock) {
         setLockedNum(endIndex);
         onRate(endIndex+1);
      }
   }

   return (
      <div className="star-rating" onMouseLeave={() => setAllHovers(lockedNum, false)}>
         {starHovers.map((star, index) => {
            return <div 
               key={index}
               className='star'
               onMouseOver={() => setAllHovers(index, false)}
               onClick={() => setAllHovers(index, true)}
            ><Star size={25} strokeWidth={1.5} fill={star ? "#ffae00" : "#ffffff"} stroke={star ? "#ffae00" : "#000000"} /></div>
         })}
      </div>
   )
}

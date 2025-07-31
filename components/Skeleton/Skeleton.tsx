"use client"
import "./Skeleton.css"

type SkeletonProps = {
   full?: boolean;
   width?: string;
   height?: string;
   round?: boolean;
}

export default function Skeleton({ full, round, width, height }: SkeletonProps) {
   return (
      <div 
         className='skeleton'
         style={{
            width: full ? '100%' : width ? width : '100px',
            height: height ? height : `20px`,
            borderRadius: round ? '100%' : '7px'
         }}
      ></div>
   )
}

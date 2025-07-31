'use client'
import { CSSProperties, ReactNode } from "react";
import "./Card.css"

type CardProps = {
   children: ReactNode;
   style?: CSSProperties;
   borderCard?: boolean;
   analyticsCard?: boolean;
   className?: string;
   cursor?: boolean;
   onClick?: Function;
   full?: boolean;
   maxWidth?: string;
   maxHeight?: string;
   maxHeightScroll?: string;
   hoverAnimate?: boolean;
}

export default function Card({ children, className, borderCard, cursor, onClick, maxWidth, maxHeight, maxHeightScroll, style: userCardStyles, analyticsCard, full, hoverAnimate }: CardProps) {
   const style: CSSProperties = maxHeightScroll ? {
      overflowX: 'hidden',
      overflowY: 'scroll',
      maxHeight: maxHeightScroll
   } : (maxHeight ? {
      maxHeight: maxHeight
   } : {})

   return (
      <div 
         className={'card ' + (hoverAnimate ? 'hover-animate ' : '') + (borderCard ? 'border-card ' : '') + (analyticsCard ? 'analytics-card ' : '') + className} 
         style={{
            ...userCardStyles,
            cursor: cursor ? 'pointer' : 'default',
            maxWidth: maxWidth ? maxWidth : full ? '100%' : '300px',
            ...style
         }}
         onClick={() => onClick ? onClick() : {}}
      >{children}</div>
   )
}

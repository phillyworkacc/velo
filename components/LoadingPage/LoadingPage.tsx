'use client'
import React from 'react'
import Skeleton from '../Skeleton/Skeleton'
import AppWrapper from '../AppWrapper/AppWrapper'

export default function LoadingPage() {
   return (
      <AppWrapper>
         <div className="text-s pd-3 pdx-3 dfb column gap-10">
            <Skeleton width='350px' height='30px' />
            <Skeleton width='350px' height='100px' />
            <Skeleton width='350px' height='30px' />
            <Skeleton width='350px' height='100px' />
            <Skeleton width='350px' height='30px' />
            <Skeleton width='350px' height='100px' />
         </div>
      </AppWrapper>
   )
}

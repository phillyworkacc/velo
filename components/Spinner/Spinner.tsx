'use client'
import './Spinner.css'

type SpinnerProps = {
   black?: boolean;
}

export default function Spinner ({ black }: SpinnerProps) {
   return <span className={`spinner ${black && 'black'}`} />;
}

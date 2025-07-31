'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Camera, CheckCircle, Cloud, Eye, Folder, LayoutDashboard, Lock, Palette, PartyPopper, ShieldCheck, Sparkles, SquareCheck, Zap } from 'lucide-react';

const tagSize = 15
const tagStrokeWidth = 3
const tags = [
  <><LayoutDashboard size={tagSize} color='#FF69B4' strokeWidth={tagStrokeWidth} /> One Dashboard. Total Control.</>,
  <><Folder size={tagSize} color='#5C6AC4' strokeWidth={tagStrokeWidth} /> Organized Workflow for Every Post</>,
  <><SquareCheck size={tagSize} color='#00BFA6' strokeWidth={tagStrokeWidth} /> Assign Tasks to Editors in Seconds</>,
  <><Eye size={tagSize} color='#FFB400' strokeWidth={tagStrokeWidth} /> See Every Post at a Glance</>,
  <><ShieldCheck size={tagSize} color='#FF6B6B' strokeWidth={tagStrokeWidth} /> Your Social Media, Fully Transparent</>,
  <><CalendarDays size={tagSize} color='#9C27B0' strokeWidth={tagStrokeWidth} /> Know Exactly What's Being Posted</>,
  <><Cloud size={tagSize} color='#4CAF50' strokeWidth={tagStrokeWidth} /> Access Content & Files via Google Drive</>
];

const tagsColors = [
   "#FF69B4",
   "#5C6AC4",
   "#00BFA6",
   "#FFB400",
   "#FF6B6B",
   "#9C27B0",
   "#4CAF50"
]

export default function HeroTag() {
   const [index, setIndex] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setIndex(prev => (prev + 1) % tags.length);
      }, 2000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="tag text-xxxs fit mb-2 pd-05 pdx-15" style={{ borderColor: tagsColors[index], background: "white" }}>
         <AnimatePresence mode="wait">
            <motion.div
               key={tags.indexOf(tags[index])}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -20, opacity: 0 }}
               transition={{ duration: 0.3 }}
            >
               <div className='text-xxxs bold-600 dfb align-center justify-center gap-4' style={{ whiteSpace: "nowrap" }}>{tags[index]}</div>
            </motion.div>
         </AnimatePresence>
      </div>
   );
}
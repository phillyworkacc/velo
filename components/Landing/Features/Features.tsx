'use client';
import "./Features.css"
import Spacing from "@/components/Spacing/Spacing";
import { Cloud, Eye, Folder, LayoutDashboard, ShieldCheck, SquareCheck } from 'lucide-react';

const features = [
   {
      icon: <LayoutDashboard size={24} />,
      title: 'One Dashboard. Total Control.',
      description: 'Easily view your content schedule, updates, and deliverables — all in one place, without needing to ask.',
   },
   {
      icon: <Folder size={24} />,
      title: 'Organized Workflow for Every Post',
      description: 'See how your posts move from idea to published. Every step is tracked and structured for full clarity.',
   },
   {
      icon: <SquareCheck size={24} />,
      title: 'Assign Tasks to Editors in Seconds',
      description: 'Know exactly who’s handling what. Our system keeps everyone accountable, so nothing falls through the cracks.',
   },
   {
      icon: <Eye size={24} />,
      title: 'See Every Post at a Glance',
      description: 'Get a real-time look at what’s been published and what’s coming up. No more guesswork or chasing updates.',
   },
   {
      icon: <ShieldCheck size={24} />,
      title: 'Your Social Media, Fully Transparent',
      description: 'You’re always in the know — with clear visibility into content plans, task progress, and results.',
   },
   {
      icon: <Cloud size={24} />,
      title: 'Access Content & Files via Google Drive',
      description: 'Review drafts, images, and brand assets easily through your own Drive — fast, organized, and always accessible.',
   },
];


export default function Features() {
   return (
      <section className="features-section" id="features">
         <h2>Features</h2>
         <div className="features-grid">
         {features.map((feature, index) => (
            <div key={index} className="feature-card">
               <div className="icon">
                  <div className="icon-wrapper">{feature.icon}</div>
               </div>
               <div>
                  <div className="text-xs bold-700 pd-05">{feature.title}</div>
                  <p>{feature.description}</p>
               </div>
            </div>
         ))}
         </div>
         <Spacing size={2} />
      </section>
   );
}

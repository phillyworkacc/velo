'use client'
import "@/styles/landing.css"
import Features from '@/components/Landing/Features/Features'
import Footer from '@/components/Landing/Footer/Footer'
import Hero from '@/components/Landing/Hero/Hero'
import Navbar from '@/components/Landing/Navbar/Navbar'
import Team from "@/components/Landing/Team/Team"
import Mps from "@/components/Landing/MPS/Mps"

export default function LandingPage () {
   return (
      <div className="landing-page">
         <Navbar />
         <Hero />
			<Mps />
         <Features />
			<Team />
         <Footer />
      </div>
   )
}
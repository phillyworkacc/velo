'use client'
import "./Team.css"

const companyLogos = [
  { src: "https://qualysservs.com/assets/img/logo.png", alt: "Qualys" },
  { src: "https://minweb.freevar.com/logo.png", alt: "Minweb" },
  { src: "https://visora.vercel.app/assets/logo/white-background-logo.png", alt: "Visora" },
  { src: "https://detix-website.vercel.app/logo.png", alt: "Detix" },
];

const team = [
   {
      name: "Philip Opadijo",
      role: "Founder",
   },
   {
      name: "Precious Egunlusi",
      role: "Editor",
   },
   {
      name: "Daniel",
      role: "Editor",
   },
   {
      name: "Dickson Opadijo",
      role: "Editor",
   },
   {
      name: "Cameron Adesanya",
      role: "Editor",
   },
   {
      name: "Sam Kayode",
      role: "Editor",
   },
   {
      name: "Helen Opadijo",
      role: "Editor",
   },
];
export default function Team () {
   return (
      <section className="testimonials-section" id="team">
         <h2>Meet the Team</h2>

         <div className="testimonial-list">
            {team.map((member, index) => (
               <blockquote key={index} className="testimonial-card">
                  <p>{member.name}</p>
                  <footer>{member.role}</footer>
               </blockquote>
            ))}
         </div>

         <div className="company-logos">
            {companyLogos.map(({ src, alt }, i) => (
               <img key={i} src={src} alt={alt} className="company-logo" />
            ))}
         </div>
      </section>
   );
}

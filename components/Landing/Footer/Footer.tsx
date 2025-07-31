"use client"
import "./Footer.css"

export default function Footer() {
   return (
      <footer className="footer">
         <p className="footer-copy text-xxxs">&copy; {new Date().getFullYear()} Velo. All rights reserved.</p>
      </footer>
   );
}

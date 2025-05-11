import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="border-b border-gray-200">
      <PageWrapper className="py-3">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-medium tracking-tight">
            <Link href="/">
              <a className="hover:opacity-80 transition-opacity">
                <span className="text-[#0071e3]">V</span>Lookup App
              </a>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 text-sm">
            <Link href="/">
              <a className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors">Home</a>
            </Link>
            <a href="#" className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors">How it works</a>
            <a href="#" className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors">Documentation</a>
            <a href="#" className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors">Support</a>
          </nav>
          
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-icons">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-60 py-4" : "max-h-0"
        )}>
          <nav className="flex flex-col space-y-3 text-sm">
            <Link href="/">
              <a className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors">Home</a>
            </Link>
            <a href="#" className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors">How it works</a>
            <a href="#" className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors">Documentation</a>
            <a href="#" className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors">Support</a>
          </nav>
        </div>
      </PageWrapper>
    </header>
  );
}

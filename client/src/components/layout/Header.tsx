import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="border-b border-gray-200 backdrop-blur-md bg-white/90 sticky top-0 z-50">
      <PageWrapper className="py-3">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-medium tracking-tight">
            <Link href="/">
              <span className="hover:opacity-80 transition-opacity cursor-pointer">
                <span className="text-[#0071e3]">P</span>rocV App
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 text-sm">
            <Link href="/">
              <span className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer">Início</span>
            </Link>
            <span onClick={() => document.getElementById('column-mapping-section')?.scrollIntoView({behavior: 'smooth'})} className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer">Como funciona</span>
            <span className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer">Documentação</span>
            <span className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer">Suporte</span>
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
        
        {/* Menu Mobile */}
        <div className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-60 py-4" : "max-h-0"
        )}>
          <nav className="flex flex-col space-y-3 text-sm">
            <Link href="/">
              <span className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer">Início</span>
            </Link>
            <span onClick={() => document.getElementById('column-mapping-section')?.scrollIntoView({behavior: 'smooth'})} className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer">Como funciona</span>
            <span className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer">Documentação</span>
            <span className="text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer">Suporte</span>
          </nav>
        </div>
      </PageWrapper>
    </header>
  );
}

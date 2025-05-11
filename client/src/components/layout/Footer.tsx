import { Link } from "wouter";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <PageWrapper>
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">VLookup App</h3>
            <p className="text-[#86868b] text-sm">
              A powerful tool for comparing and analyzing data from different files with ease and precision.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">File Upload</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Column Mapping</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Data Comparison</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Export Results</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Documentation</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">API Reference</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">GitHub Repository</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-[#86868b] text-sm">
          <p>&copy; {new Date().getFullYear()} VLookup App. All rights reserved.</p>
        </div>
      </PageWrapper>
    </footer>
  );
}

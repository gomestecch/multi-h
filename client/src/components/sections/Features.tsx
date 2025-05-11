import { PageWrapper } from "@/components/ui/page-wrapper";

export default function Features() {
  return (
    <section className="mb-16">
      <PageWrapper>
        <h2 className="text-3xl font-semibold mb-8 text-center">Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-[#f5f5f7] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-[#0071e3] text-2xl">file_upload</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple File Formats</h3>
            <p className="text-[#86868b]">Support for CSV, Excel (XLSX), and other common spreadsheet formats.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-[#f5f5f7] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-[#0071e3] text-2xl">compare_arrows</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Advanced Comparison</h3>
            <p className="text-[#86868b]">VLOOKUP functionality with complete control over which columns to compare.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-[#f5f5f7] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-[#0071e3] text-2xl">insights</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Detailed Results</h3>
            <p className="text-[#86868b]">Clear highlighting of matching and non-matching records with export options.</p>
          </div>
        </div>
      </PageWrapper>
    </section>
  );
}

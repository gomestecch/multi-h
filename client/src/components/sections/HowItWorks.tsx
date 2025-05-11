import { PageWrapper } from "@/components/ui/page-wrapper";

export default function HowItWorks() {
  return (
    <section className="mb-16 overflow-hidden">
      <PageWrapper>
        <h2 className="text-3xl font-semibold mb-12 text-center">How It Works</h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
          
          {/* Workflow Steps */}
          <div className="space-y-24 relative">
            {/* Step 1 */}
            <div className="md:flex items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 md:text-right">
                <span className="text-sm text-[#0071e3] font-medium">STEP 1</span>
                <h3 className="text-2xl font-semibold mb-2">Upload Your Files</h3>
                <p className="text-[#86868b]">Select or drag & drop your CSV or Excel files for comparison.</p>
              </div>
              <div className="md:w-1/2 relative">
                {/* Timeline dot */}
                <div className="absolute top-1/2 -left-4 h-8 w-8 bg-white border-4 border-[#0071e3] rounded-full transform -translate-y-1/2 hidden md:block"></div>
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Minimalist workspace with laptop" 
                  className="rounded-xl shadow-lg mx-auto md:ml-12" 
                />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="md:flex items-center flex-row-reverse">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-12">
                <span className="text-sm text-[#0071e3] font-medium">STEP 2</span>
                <h3 className="text-2xl font-semibold mb-2">Map Your Columns</h3>
                <p className="text-[#86868b]">Select which columns to use as keys for lookup and which data to include.</p>
              </div>
              <div className="md:w-1/2 relative">
                {/* Timeline dot */}
                <div className="absolute top-1/2 -right-4 h-8 w-8 bg-white border-4 border-[#0071e3] rounded-full transform -translate-y-1/2 hidden md:block"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Data analysis with columns and charts" 
                  className="rounded-xl shadow-lg mx-auto md:mr-12" 
                />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="md:flex items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 md:text-right">
                <span className="text-sm text-[#0071e3] font-medium">STEP 3</span>
                <h3 className="text-2xl font-semibold mb-2">Review Results</h3>
                <p className="text-[#86868b]">View the comparison results with highlighted matches and differences.</p>
              </div>
              <div className="md:w-1/2 relative">
                {/* Timeline dot */}
                <div className="absolute top-1/2 -left-4 h-8 w-8 bg-white border-4 border-[#0071e3] rounded-full transform -translate-y-1/2 hidden md:block"></div>
                <img 
                  src="https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Data analysis results and dashboard" 
                  className="rounded-xl shadow-lg mx-auto md:ml-12" 
                />
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="md:flex items-center flex-row-reverse">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-12">
                <span className="text-sm text-[#0071e3] font-medium">STEP 4</span>
                <h3 className="text-2xl font-semibold mb-2">Export Your Data</h3>
                <p className="text-[#86868b]">Download the results in your preferred format for further analysis.</p>
              </div>
              <div className="md:w-1/2 relative">
                {/* Timeline dot */}
                <div className="absolute top-1/2 -right-4 h-8 w-8 bg-white border-4 border-[#0071e3] rounded-full transform -translate-y-1/2 hidden md:block"></div>
                <img 
                  src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Minimalist workspace with data documents" 
                  className="rounded-xl shadow-lg mx-auto md:mr-12" 
                />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </section>
  );
}

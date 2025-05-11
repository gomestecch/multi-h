import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FileUploader from "@/components/FileUploader";
import ColumnMapper from "@/components/ColumnMapper";
import Results from "@/components/Results";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import CallToAction from "@/components/sections/CallToAction";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { type FileWithPreview } from "@/lib/file-utils";
import { Button } from "@/components/ui/button";
import { scrollToElement } from "@/lib/utils";

export default function Home() {
  const { toast } = useToast();
  const [sourceFile, setSourceFile] = useState<FileWithPreview | null>(null);
  const [lookupFile, setLookupFile] = useState<FileWithPreview | null>(null);
  const [sourceColumns, setSourceColumns] = useState<string[]>([]);
  const [lookupColumns, setLookupColumns] = useState<string[]>([]);
  const [resultData, setResultData] = useState<any | null>(null);
  const [activeSection, setActiveSection] = useState<'upload' | 'mapping' | 'results'>('upload');

  const handleSourceFileUpload = (file: FileWithPreview, columns: string[]) => {
    setSourceFile(file);
    setSourceColumns(columns);
    checkFilesUploaded();
  };

  const handleLookupFileUpload = (file: FileWithPreview, columns: string[]) => {
    setLookupFile(file);
    setLookupColumns(columns);
    checkFilesUploaded();
  };

  const handleSourceFileRemove = () => {
    setSourceFile(null);
    setSourceColumns([]);
  };

  const handleLookupFileRemove = () => {
    setLookupFile(null);
    setLookupColumns([]);
  };

  const checkFilesUploaded = () => {
    if (sourceFile && lookupFile) {
      setActiveSection('mapping');
      setTimeout(() => {
        scrollToElement('column-mapping-section');
      }, 100);
    }
  };

  const handleLookupComplete = (data: any) => {
    setResultData(data);
    setActiveSection('results');
    setTimeout(() => {
      scrollToElement('results-section');
    }, 100);
  };

  const handleStartComparing = () => {
    scrollToElement('file-upload-section');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#f5f5f7] py-16 md:py-24">
        <PageWrapper className="text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Compare data.<br />With precision.
          </h1>
          <p className="text-xl text-[#86868b] max-w-2xl mx-auto mb-8">
            A powerful VLOOKUP tool to compare and analyze data from different files with ease and accuracy.
          </p>
          <Button 
            onClick={handleStartComparing}
            className="px-8 py-6 text-lg font-medium bg-[#0071e3] hover:bg-[#0077ED] rounded-full"
          >
            Start comparing
          </Button>
        </PageWrapper>
      </section>
      
      <main className="flex-grow">
        {/* File Upload Section */}
        <section id="file-upload-section" className="py-12 md:py-20">
          <PageWrapper>
            <h2 className="text-3xl font-semibold mb-2">Upload your files</h2>
            <p className="text-[#86868b] mb-8">Drag and drop or select your CSV or Excel files for comparison</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <FileUploader
                title="File 1 (Source)"
                file={sourceFile}
                onUpload={handleSourceFileUpload}
                onRemove={handleSourceFileRemove}
              />
              <FileUploader
                title="File 2 (Lookup)"
                file={lookupFile}
                onUpload={handleLookupFileUpload}
                onRemove={handleLookupFileRemove}
              />
            </div>
          </PageWrapper>
        </section>
        
        {/* Column Mapping Section */}
        <section id="column-mapping-section" className={`py-12 md:py-20 ${activeSection === 'upload' ? 'opacity-50 pointer-events-none' : ''}`}>
          {sourceFile && lookupFile && (
            <ColumnMapper
              sourceFile={sourceFile}
              lookupFile={lookupFile}
              sourceColumns={sourceColumns}
              lookupColumns={lookupColumns}
              onLookupComplete={handleLookupComplete}
            />
          )}
        </section>
        
        {/* Results Section */}
        <section id="results-section" className={`py-12 md:py-20 ${activeSection !== 'results' ? 'opacity-50 pointer-events-none' : ''}`}>
          {resultData && (
            <Results resultData={resultData} />
          )}
        </section>
        
        {/* Features Section */}
        <Features />
        
        {/* How It Works Section */}
        <HowItWorks />
      </main>
      
      {/* Call to Action */}
      <CallToAction onStartNow={handleStartComparing} />
      
      <Footer />
    </div>
  );
}

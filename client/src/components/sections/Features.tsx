import { PageWrapper } from "@/components/ui/page-wrapper";

export default function Features() {
  return (
    <section className="mb-16">
      <PageWrapper>
        <h2 className="text-3xl font-semibold mb-8 text-center">Recursos</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-[#f5f5f7] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-[#0071e3] text-2xl">file_upload</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Múltiplos Formatos de Arquivo</h3>
            <p className="text-[#86868b]">Suporte para CSV, Excel (XLSX) e outros formatos comuns de planilhas.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-[#f5f5f7] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-[#0071e3] text-2xl">compare_arrows</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Comparação Avançada</h3>
            <p className="text-[#86868b]">Funcionalidade PROCV com controle completo sobre quais colunas comparar.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-[#f5f5f7] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-[#0071e3] text-2xl">insights</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Resultados Detalhados</h3>
            <p className="text-[#86868b]">Destaque claro de registros correspondentes e não correspondentes com opções de exportação.</p>
          </div>
        </div>
      </PageWrapper>
    </section>
  );
}

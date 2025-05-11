import { PageWrapper } from "@/components/ui/page-wrapper";

export default function HowItWorks() {
  return (
    <section className="mb-16 overflow-hidden">
      <PageWrapper>
        <h2 className="text-3xl font-semibold mb-12 text-center">Como Funciona</h2>
        
        <div className="relative">
          {/* Linha do Timeline */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
          
          {/* Etapas do Fluxo de Trabalho */}
          <div className="space-y-24 relative">
            {/* Etapa 1 */}
            <div className="md:flex items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 md:text-right">
                <span className="text-sm text-[#0071e3] font-medium">ETAPA 1</span>
                <h3 className="text-2xl font-semibold mb-2">Envie Seus Arquivos</h3>
                <p className="text-[#86868b]">Selecione ou arraste e solte seus arquivos CSV ou Excel para comparação.</p>
              </div>
              <div className="md:w-1/2 relative">
                {/* Ponto da Linha do Tempo */}
                <div className="absolute top-1/2 -left-4 h-8 w-8 bg-white border-4 border-[#0071e3] rounded-full transform -translate-y-1/2 hidden md:block"></div>
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Espaço de trabalho minimalista com laptop" 
                  className="rounded-xl shadow-lg mx-auto md:ml-12" 
                />
              </div>
            </div>
            
            {/* Etapa 2 */}
            <div className="md:flex items-center flex-row-reverse">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-12">
                <span className="text-sm text-[#0071e3] font-medium">ETAPA 2</span>
                <h3 className="text-2xl font-semibold mb-2">Mapeie Suas Colunas</h3>
                <p className="text-[#86868b]">Selecione quais colunas usar como chaves para procura e quais dados incluir.</p>
              </div>
              <div className="md:w-1/2 relative">
                {/* Ponto da Linha do Tempo */}
                <div className="absolute top-1/2 -right-4 h-8 w-8 bg-white border-4 border-[#0071e3] rounded-full transform -translate-y-1/2 hidden md:block"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Análise de dados com colunas e gráficos" 
                  className="rounded-xl shadow-lg mx-auto md:mr-12" 
                />
              </div>
            </div>
            
            {/* Etapa 3 */}
            <div className="md:flex items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 md:text-right">
                <span className="text-sm text-[#0071e3] font-medium">ETAPA 3</span>
                <h3 className="text-2xl font-semibold mb-2">Revise os Resultados</h3>
                <p className="text-[#86868b]">Visualize os resultados da comparação com correspondências e diferenças destacadas.</p>
              </div>
              <div className="md:w-1/2 relative">
                {/* Ponto da Linha do Tempo */}
                <div className="absolute top-1/2 -left-4 h-8 w-8 bg-white border-4 border-[#0071e3] rounded-full transform -translate-y-1/2 hidden md:block"></div>
                <img 
                  src="https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Resultados de análise de dados e painel" 
                  className="rounded-xl shadow-lg mx-auto md:ml-12" 
                />
              </div>
            </div>
            
            {/* Etapa 4 */}
            <div className="md:flex items-center flex-row-reverse">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-12">
                <span className="text-sm text-[#0071e3] font-medium">ETAPA 4</span>
                <h3 className="text-2xl font-semibold mb-2">Exporte Seus Dados</h3>
                <p className="text-[#86868b]">Baixe os resultados no formato de sua preferência para análise adicional.</p>
              </div>
              <div className="md:w-1/2 relative">
                {/* Ponto da Linha do Tempo */}
                <div className="absolute top-1/2 -right-4 h-8 w-8 bg-white border-4 border-[#0071e3] rounded-full transform -translate-y-1/2 hidden md:block"></div>
                <img 
                  src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Espaço de trabalho minimalista com documentos de dados" 
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

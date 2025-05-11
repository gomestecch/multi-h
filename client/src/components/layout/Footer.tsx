import { Link } from "wouter";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <PageWrapper>
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">ProcV App</h3>
            <p className="text-[#86868b] text-sm">
              Uma ferramenta poderosa para comparar e analisar dados de diferentes arquivos com facilidade e precisão.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Recursos</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Upload de Arquivos</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Mapeamento de Colunas</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Comparação de Dados</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Exportação de Resultados</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Recursos</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Documentação</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Referência da API</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Repositório GitHub</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Contato</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-[#86868b] hover:text-[#0071e3] transition-colors">Termos de Serviço</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-[#86868b] text-sm">
          <p>&copy; {new Date().getFullYear()} ProcV App. Todos os direitos reservados.</p>
        </div>
      </PageWrapper>
    </footer>
  );
}

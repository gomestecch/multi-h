import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";

interface CallToActionProps {
  onStartNow: () => void;
}

export default function CallToAction({ onStartNow }: CallToActionProps) {
  return (
    <section className="bg-[#f5f5f7] py-16">
      <PageWrapper className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Pronto para comparar seus dados?</h2>
        <p className="text-[#86868b] max-w-2xl mx-auto mb-8">
          Comece a usar nossa poderosa ferramenta de PROCV hoje para analisar e comparar seus dados de planilhas com precisão e facilidade.
        </p>
        <Button 
          onClick={onStartNow}
          className="px-8 py-6 text-lg font-medium bg-[#0071e3] hover:bg-[#0077ED] rounded-full"
        >
          Começar Agora
        </Button>
      </PageWrapper>
    </section>
  );
}

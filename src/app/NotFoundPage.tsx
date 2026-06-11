import { useNavigate } from "react-router-dom";
import { Button } from "../common/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-prompt">
      <h1 className="text-display font-montserrat font-black tracking-widest text-valorant-red mb-4">404</h1>
      <p className="text-body-lg text-valorant-light font-prompt mb-8">
        Página não encontrada
      </p>
      <Button
        variant="outline"
        size="lg"
        onClick={() => navigate("/")}
      >
        Voltar ao início
      </Button>
    </main>
  );
}

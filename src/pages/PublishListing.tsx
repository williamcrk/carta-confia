import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateListingForm } from "@/components/listing/CreateListingForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";

export default function PublishListing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate("/auth?mode=signup");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-secondary/20">
        <div className="container max-w-3xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <CreateListingForm onSuccess={() => navigate("/marketplace")} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

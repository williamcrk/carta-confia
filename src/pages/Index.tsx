import { Link } from "react-router-dom";
import { 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Home, 
  Car, 
  Users, 
  FileCheck, 
  MessageSquare, 
  Lock,
  TrendingUp,
  Clock,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 gradient-hero overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Plataforma 100% Segura e Verificada
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Compre e Venda Consórcios{" "}
                <span className="text-primary">Contemplados</span> com Segurança
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                O marketplace mais confiável para negociação de cartas de consórcio
                de imóveis e veículos. Todas as operações validadas por empresa parceira.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/marketplace">
                    Ver Cartas Disponíveis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth?mode=signup">Anunciar Minha Carta</Link>
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>KYC Verificado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-success" />
                  <span>Dados Criptografados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-success" />
                  <span>Parceira Validadora</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Encontre o Consórcio Ideal
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Navegue por categorias e encontre as melhores oportunidades de cartas contempladas
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Imóveis */}
              <Card className="card-hover cursor-pointer border-2 hover:border-property/50 group">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-property/10 text-property">
                      <Home className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-property transition-colors">
                        Consórcios de Imóveis
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Cartas contempladas para aquisição de casa, apartamento, terreno ou imóvel comercial.
                      </p>
                      <Link
                        to="/marketplace?type=property"
                        className="inline-flex items-center gap-1 text-property font-medium text-sm"
                      >
                        Ver cartas de imóveis
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Veículos */}
              <Card className="card-hover cursor-pointer border-2 hover:border-vehicle/50 group">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-vehicle/10 text-vehicle">
                      <Car className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-vehicle transition-colors">
                        Consórcios de Veículos
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Cartas contempladas para carros, motos, caminhões e outros veículos.
                      </p>
                      <Link
                        to="/marketplace?type=vehicle"
                        className="inline-flex items-center gap-1 text-vehicle font-medium text-sm"
                      >
                        Ver cartas de veículos
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Como Funciona
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Um processo simples, seguro e transparente do início ao fim
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Users,
                  title: "Cadastre-se",
                  description: "Crie sua conta e escolha se deseja comprar ou vender cartas",
                },
                {
                  icon: FileCheck,
                  title: "Verificação KYC",
                  description: "Envie seus documentos para validação pela empresa parceira",
                },
                {
                  icon: MessageSquare,
                  title: "Negocie",
                  description: "Converse diretamente com a outra parte com acompanhamento",
                },
                {
                  icon: Shield,
                  title: "Finalize",
                  description: "Conclua a negociação com segurança através da parceira",
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Por Que Escolher Nossa Plataforma?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Diferenciais que garantem a melhor experiência para compradores e vendedores
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Segurança Total",
                  description: "Verificação de identidade, documentos validados e empresa parceira especializada acompanhando cada negociação.",
                },
                {
                  icon: TrendingUp,
                  title: "Melhores Ofertas",
                  description: "Encontre cartas contempladas com condições vantajosas. Compare preços e escolha a melhor oportunidade.",
                },
                {
                  icon: Clock,
                  title: "Agilidade",
                  description: "Processo otimizado para você encontrar ou vender sua carta de forma rápida e descomplicada.",
                },
                {
                  icon: Award,
                  title: "Selo de Verificação",
                  description: "Usuários e anúncios verificados com badges de confiança visíveis em toda plataforma.",
                },
                {
                  icon: MessageSquare,
                  title: "Chat Integrado",
                  description: "Comunicação direta entre comprador, vendedor e parceira validadora em um só lugar.",
                },
                {
                  icon: Lock,
                  title: "Dados Protegidos",
                  description: "Criptografia de ponta e conformidade com LGPD para proteção das suas informações.",
                },
              ].map((benefit, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center bg-primary rounded-3xl p-8 md:p-12 text-primary-foreground">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Pronto para Começar?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Cadastre-se gratuitamente e comece a explorar as melhores oportunidades
                em cartas de consórcio contempladas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="gap-2" asChild>
                  <Link to="/auth?mode=signup">
                    Criar Conta Grátis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10" asChild>
                  <Link to="/marketplace">Ver Marketplace</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Phone, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface ExpertContact {
  id: string;
  listing_id: string;
  user_id: string;
  message?: string;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
  listing?: {
    administrator: string;
    credit_value: number;
  };
}

export default function ExpertDashboard() {
  const [contacts, setContacts] = useState<ExpertContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("expert_contacts")
        .select(`
          id,
          listing_id,
          user_id,
          message,
          created_at,
          user:user_id(full_name, email),
          listing:listing_id(administrator, credit_value)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = (userPhone: string) => {
    const message = encodeURIComponent(
      "Olá! Sou um especialista da plataforma e gostaria de ajudá-lo com sua negociação de carta de consórcio."
    );
    window.open(`https://wa.me/${userPhone}?text=${message}`, "_blank");
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-secondary/20">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Painel do Especialista</h1>
            <p className="text-muted-foreground">
              Acompanhe e responda aos contatos dos usuários interessados em negociar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{contacts.length}</div>
                <p className="text-sm text-muted-foreground">Total de Contatos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {contacts.filter(c => new Date(c.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000).length}
                </div>
                <p className="text-sm text-muted-foreground">Últimas 24h</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {new Set(contacts.map(c => c.listing_id)).size}
                </div>
                <p className="text-sm text-muted-foreground">Cartas Únidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  R$ {(contacts.reduce((sum, c) => sum + (c.listing?.credit_value || 0), 0) / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pendentes
              </TabsTrigger>
              <TabsTrigger value="contacted" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Contatados
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Todos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              {contacts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Nenhum contato pendente</h3>
                    <p className="text-sm text-muted-foreground">
                      Não há contatos aguardando resposta no momento.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {contacts.map((contact) => (
                    <Card key={contact.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold">{contact.user?.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{contact.user?.email}</p>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(contact.created_at)}
                          </Badge>
                        </div>

                        <div className="bg-secondary/50 p-4 rounded-lg mb-4">
                          <p className="text-sm font-medium mb-2">Carta de Interesse:</p>
                          <p className="font-semibold">{contact.listing?.administrator}</p>
                          <p className="text-sm text-muted-foreground">
                            R$ {contact.listing?.credit_value.toLocaleString("pt-BR")}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => handleWhatsAppContact("5511999999999")}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Responder via WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleWhatsAppContact("5511999999999")}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="contacted" className="mt-6">
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Em breve</h3>
                  <p className="text-sm text-muted-foreground">
                    Histórico de contatos será exibido aqui.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              {contacts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Nenhum contato</h3>
                    <p className="text-sm text-muted-foreground">
                      Ainda não há contatos na plataforma.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {contacts.map((contact) => (
                    <Card key={contact.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{contact.user?.full_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {contact.listing?.administrator} - R$ {contact.listing?.credit_value.toLocaleString("pt-BR")}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(contact.created_at)}
                            </p>
                          </div>
                          <Button size="sm" onClick={() => handleWhatsAppContact("5511999999999")}>
                            Contatar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

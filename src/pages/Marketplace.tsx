import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Home,
  Car,
  ArrowUpDown,
  CheckCircle,
  Shield,
  Eye,
  TrendingUp,
  Heart,
  MessageCircle,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ListingData {
  id: string;
  type?: string;
  consortium_type?: string;
  creditValue?: number;
  credit_value?: number;
  administrator: string;
  paidPercentage?: number;
  paid_percentage?: number;
  entryValue?: number;
  entry_value?: number;
  description?: string;
  isVerified?: boolean;
  is_partner_approved?: boolean;
  viewsCount?: number;
  views_count?: number;
  createdAt?: string;
  created_at?: string;
  seller_id?: string;
  seller?: {
    full_name: string;
    avatar_url: string;
  };
  status?: string;
}

// Mock data for listings (fallback)
const mockListings = [
  {
    id: "1",
    type: "property",
    creditValue: 250000,
    administrator: "Porto Seguro",
    paidPercentage: 35,
    entryValue: 45000,
    description: "Carta de imóvel contemplada, excelente oportunidade para aquisição de casa própria.",
    isVerified: true,
    viewsCount: 127,
    createdAt: "2025-01-20",
  },
  {
    id: "2",
    type: "vehicle",
    creditValue: 85000,
    administrator: "Bradesco Consórcios",
    paidPercentage: 28,
    entryValue: 22000,
    description: "Carta de veículo contemplada para compra de carro novo ou seminovo.",
    isVerified: true,
    viewsCount: 89,
    createdAt: "2025-01-22",
  },
  {
    id: "3",
    type: "property",
    creditValue: 180000,
    administrator: "Itaú Consórcios",
    paidPercentage: 45,
    entryValue: 38000,
    description: "Consórcio de imóvel com boas condições de pagamento.",
    isVerified: true,
    viewsCount: 156,
    createdAt: "2025-01-18",
  },
  {
    id: "4",
    type: "vehicle",
    creditValue: 120000,
    administrator: "Santander",
    paidPercentage: 20,
    entryValue: 28000,
    description: "Carta de veículo recém contemplada, ideal para caminhonete ou SUV.",
    isVerified: false,
    viewsCount: 64,
    createdAt: "2025-01-25",
  },
  {
    id: "5",
    type: "property",
    creditValue: 450000,
    administrator: "Caixa Consórcios",
    paidPercentage: 52,
    entryValue: 95000,
    description: "Carta de alto valor para imóvel de luxo ou comercial.",
    isVerified: true,
    viewsCount: 203,
    createdAt: "2025-01-15",
  },
  {
    id: "6",
    type: "vehicle",
    creditValue: 55000,
    administrator: "BB Consórcios",
    paidPercentage: 15,
    entryValue: 12000,
    description: "Carta de veículo com entrada acessível, contemplada há 2 meses.",
    isVerified: true,
    viewsCount: 78,
    createdAt: "2025-01-24",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get("type") || "all");
  const [sortBy, setSortBy] = useState("recent");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState<ListingData[]>(mockListings);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          seller:seller_id(full_name, avatar_url)
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setListings(data);
      }
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error);
      setListings(mockListings);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = (listingAdmin: string, creditValue: number) => {
    const phone = "5511999999999";
    const message = encodeURIComponent(
      `Olá! Tenho interesse na carta de consórcio: ${listingAdmin} - Valor: R$ ${creditValue.toLocaleString("pt-BR")}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleExpertContact = async (listingId: string, listingAdmin: string) => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para contatar um especialista.",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.from("expert_contacts").insert({
        user_id: user.id,
        listing_id: listingId,
        contact_type: "whatsapp",
      });

      const expertPhone = "5511988888888";
      const message = encodeURIComponent(
        `Quero falar com um especialista sobre a carta: ${listingAdmin}`
      );
      window.open(`https://wa.me/${expertPhone}?text=${message}`, "_blank");
    } catch (error) {
      console.error("Erro ao contatar especialista:", error);
    }
  };

  // Filter listings
  const filteredListings = listings.filter((listing) => {
    const consortiumType = listing.consortium_type || listing.type;
    const creditValue = listing.credit_value || listing.creditValue || 0;
    const matchesType = typeFilter === "all" || consortiumType === typeFilter;
    const matchesSearch =
      listing.administrator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (listing.description && listing.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPrice = creditValue >= priceRange[0] && creditValue <= priceRange[1];
    return matchesType && matchesSearch && matchesPrice;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    const creditValueA = a.credit_value || a.creditValue || 0;
    const creditValueB = b.credit_value || b.creditValue || 0;
    const viewsA = a.views_count || a.viewsCount || 0;
    const viewsB = b.views_count || b.viewsCount || 0;
    const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
    const dateB = new Date(b.created_at || b.createdAt || 0).getTime();

    switch (sortBy) {
      case "price-asc":
        return creditValueA - creditValueB;
      case "price-desc":
        return creditValueB - creditValueA;
      case "views":
        return viewsB - viewsA;
      default:
        return dateB - dateA;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-secondary/20">
        {/* Hero */}
        <section className="bg-background border-b py-8">
          <div className="container">
            <h1 className="text-3xl font-bold mb-2">Marketplace de Consórcios</h1>
            <p className="text-muted-foreground">
              Encontre as melhores cartas contempladas de imóveis e veículos
            </p>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </h3>

                  {/* Type Filter */}
                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-medium">Tipo de Consórcio</label>
                    <div className="space-y-2">
                      {[
                        { value: "all", label: "Todos", icon: null },
                        { value: "property", label: "Imóveis", icon: Home },
                        { value: "vehicle", label: "Veículos", icon: Car },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setTypeFilter(option.value);
                            if (option.value !== "all") {
                              setSearchParams({ type: option.value });
                            } else {
                              setSearchParams({});
                            }
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            typeFilter === option.value
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary"
                          }`}
                        >
                          {option.icon && <option.icon className="h-4 w-4" />}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-medium">Valor do Crédito</label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500000}
                      step={10000}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatCurrency(priceRange[0])}</span>
                      <span>{formatCurrency(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setTypeFilter("all");
                      setPriceRange([0, 500000]);
                      setSearchTerm("");
                      setSearchParams({});
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por administradora ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="lg:hidden gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Ordenar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mais Recentes</SelectItem>
                      <SelectItem value="price-asc">Menor Preço</SelectItem>
                      <SelectItem value="price-desc">Maior Preço</SelectItem>
                      <SelectItem value="views">Mais Vistos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <Card className="lg:hidden mb-6">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[
                          { value: "all", label: "Todos" },
                          { value: "property", label: "Imóveis" },
                          { value: "vehicle", label: "Veículos" },
                        ].map((option) => (
                          <Button
                            key={option.value}
                            variant={typeFilter === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setTypeFilter(option.value);
                              if (option.value !== "all") {
                                setSearchParams({ type: option.value });
                              } else {
                                setSearchParams({});
                              }
                            }}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Valor do Crédito</label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={500000}
                          step={10000}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatCurrency(priceRange[0])}</span>
                          <span>{formatCurrency(priceRange[1])}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results Count */}
              <p className="text-sm text-muted-foreground mb-4">
                {sortedListings.length} carta{sortedListings.length !== 1 && "s"} encontrada
                {sortedListings.length !== 1 && "s"}
              </p>

              {/* Listings Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Carregando cartas...</p>
                </div>
              ) : sortedListings.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedListings.map((listing) => {
                    const consortiumType = listing.consortium_type || listing.type;
                    const creditValue = listing.credit_value || listing.creditValue || 0;
                    const paidPercentage = listing.paid_percentage || listing.paidPercentage || 0;
                    const entryValue = listing.entry_value || listing.entryValue || 0;
                    const isVerified = listing.is_partner_approved || listing.isVerified;
                    const views = listing.views_count || listing.viewsCount || 0;

                    return (
                    <Card key={listing.id} className="card-hover overflow-hidden">
                      <CardContent className="p-6">
                        {/* Seller Info with Photo */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={listing.seller?.avatar_url} />
                              <AvatarFallback>
                                {listing.seller?.full_name?.charAt(0) || "V"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {listing.seller?.full_name || "Vendedor"}
                              </p>
                              {isVerified && (
                                <p className="text-xs text-success">✓ Verificado</p>
                              )}
                            </div>
                          </div>
                          <Heart className="h-5 w-5 text-muted-foreground hover:text-red-500 cursor-pointer" />
                        </div>

                        {/* Type Badge */}
                        <div className="flex gap-2 mb-4">
                          <Badge
                            className={
                              consortiumType === "property"
                                ? "type-property"
                                : "type-vehicle"
                            }
                          >
                            {consortiumType === "property" ? (
                              <>
                                <Home className="h-3 w-3 mr-1" />
                                Imóvel
                              </>
                            ) : (
                              <>
                                <Car className="h-3 w-3 mr-1" />
                                Veículo
                              </>
                            )}
                          </Badge>
                          <Badge variant="outline">{paidPercentage}% pago</Badge>
                        </div>

                        {/* Credit Value */}
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Valor do Crédito</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(creditValue)}
                          </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Administradora</span>
                            <span className="font-medium">{listing.administrator}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">% Pago</span>
                            <span className="font-medium">{paidPercentage}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Entrada</span>
                            <span className="font-medium text-success">
                              {formatCurrency(entryValue)}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {listing.description || "Sem descrição"}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {views} visualizações
                          </span>
                          {isVerified && (
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3 text-success" />
                              Verificado
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            size="sm"
                            onClick={() => handleWhatsAppContact(listing.administrator, creditValue)}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleExpertContact(listing.id, listing.administrator)}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Especialista
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Nenhuma carta encontrada</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Tente ajustar os filtros ou buscar por outros termos
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTypeFilter("all");
                        setPriceRange([0, 500000]);
                        setSearchTerm("");
                        setSearchParams({});
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

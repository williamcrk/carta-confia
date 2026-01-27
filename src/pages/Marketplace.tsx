import { useState } from "react";
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
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Mock data for listings
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

  // Filter listings
  const filteredListings = mockListings.filter((listing) => {
    const matchesType = typeFilter === "all" || listing.type === typeFilter;
    const matchesSearch =
      listing.administrator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice =
      listing.creditValue >= priceRange[0] && listing.creditValue <= priceRange[1];
    return matchesType && matchesSearch && matchesPrice;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.creditValue - b.creditValue;
      case "price-desc":
        return b.creditValue - a.creditValue;
      case "views":
        return b.viewsCount - a.viewsCount;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
              {sortedListings.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedListings.map((listing) => (
                    <Card key={listing.id} className="card-hover overflow-hidden">
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <Badge
                            className={
                              listing.type === "property"
                                ? "type-property"
                                : "type-vehicle"
                            }
                          >
                            {listing.type === "property" ? (
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
                          {listing.isVerified && (
                            <div className="trust-badge status-verified">
                              <CheckCircle className="h-3 w-3" />
                              Verificado
                            </div>
                          )}
                        </div>

                        {/* Credit Value */}
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Valor do Crédito</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(listing.creditValue)}
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
                            <span className="font-medium">{listing.paidPercentage}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Entrada</span>
                            <span className="font-medium text-success">
                              {formatCurrency(listing.entryValue)}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {listing.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {listing.viewsCount} visualizações
                          </span>
                          {listing.isVerified && (
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3 text-success" />
                              Parceira
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <Button className="w-full" asChild>
                          <Link to={`/carta/${listing.id}`}>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
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

import { useState } from "react";
import { Heart, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Listing {
  id: string;
  credit_value: number;
  administrator: string;
  paid_percentage: number;
  entry_value: number;
  consortium_type: string;
  description: string;
  seller_id: string;
  seller?: {
    full_name: string;
    avatar_url: string;
  };
}

interface ListingCardProps {
  listing: Listing;
  isLiked?: boolean;
  onLikeChange?: (isLiked: boolean) => void;
}

export function ListingCard({ listing, isLiked = false, onLikeChange }: ListingCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (liked) {
        await supabase
          .from("listing_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", listing.id);
        setLiked(false);
        setLikeCount(Math.max(0, likeCount - 1));
      } else {
        await supabase.from("listing_likes").insert({
          user_id: user.id,
          listing_id: listing.id,
        });
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
      onLikeChange?.(!liked);
    } catch (error) {
      console.error("Erro ao atualizar like:", error);
    }
  };

  const handleWhatsAppContact = () => {
    const phone = "5511999999999";
    const message = encodeURIComponent(
      `Olá! Tenho interesse na carta de consórcio: ${listing.administrator} - Valor: R$ ${listing.credit_value.toLocaleString("pt-BR")}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleExpertContact = async () => {
    if (!user) return;

    try {
      await supabase.from("expert_contacts").insert({
        user_id: user.id,
        listing_id: listing.id,
        contact_type: "whatsapp",
      });

      const expertPhone = "5511988888888";
      const message = encodeURIComponent(
        `Quero falar com um especialista sobre a carta: ${listing.administrator}`
      );
      window.open(`https://wa.me/${expertPhone}?text=${message}`, "_blank");
    } catch (error) {
      console.error("Erro ao contactar especialista:", error);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6 space-y-4">
        {/* Seller Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={listing.seller?.avatar_url} />
              <AvatarFallback>
                {listing.seller?.full_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {listing.seller?.full_name || "Vendedor"}
              </p>
              <p className="text-sm text-muted-foreground">Anunciante verificado</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={liked ? "text-red-500" : ""}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Badge */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">{listing.consortium_type === "property" ? "Imóvel" : "Veículo"}</Badge>
          <Badge variant="outline">{listing.paid_percentage}% pago</Badge>
        </div>

        {/* Listing Details */}
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Administradora</p>
            <p className="font-semibold">{listing.administrator}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Valor do Crédito</p>
              <p className="font-semibold text-lg">
                R$ {listing.credit_value.toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor de Entrada</p>
              <p className="font-semibold text-lg">
                R$ {listing.entry_value.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          {listing.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {listing.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            className="flex-1"
            onClick={handleWhatsAppContact}
            size="sm"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleExpertContact}
            size="sm"
          >
            <Phone className="mr-2 h-4 w-4" />
            Especialista
          </Button>
        </div>
      </div>
    </Card>
  );
}

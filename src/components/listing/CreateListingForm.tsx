import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { AlertCircle, Phone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const listingSchema = z.object({
  consortium_type: z.enum(["property", "vehicle"]),
  credit_value: z.string().min(1, "Valor do crédito é obrigatório").pipe(z.coerce.number().positive()),
  administrator: z.string().min(2, "Administradora é obrigatória"),
  paid_percentage: z.string().min(1, "Percentual pago é obrigatório").pipe(z.coerce.number().min(0).max(100)),
  entry_value: z.string().min(1, "Valor de entrada é obrigatório").pipe(z.coerce.number().nonnegative()),
  description: z.string().optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface CreateListingFormProps {
  onSuccess?: () => void;
}

export function CreateListingForm({ onSuccess }: CreateListingFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showExpertAlert, setShowExpertAlert] = useState(true);

  const [formData, setFormData] = useState<ListingFormData>({
    consortium_type: "property",
    credit_value: "",
    administrator: "",
    paid_percentage: "",
    entry_value: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = listingSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para criar um anúncio.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("listings").insert({
        seller_id: user.id,
        consortium_type: result.data.consortium_type,
        credit_value: result.data.credit_value,
        administrator: result.data.administrator,
        paid_percentage: result.data.paid_percentage,
        entry_value: result.data.entry_value,
        description: result.data.description,
        status: "pending_approval",
      });

      if (error) throw error;

      toast({
        title: "Anúncio criado com sucesso!",
        description: "Seu anúncio será revisado por um especialista em breve.",
      });

      setFormData({
        consortium_type: "property",
        credit_value: "",
        administrator: "",
        paid_percentage: "",
        entry_value: "",
        description: "",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar anúncio:", error);
      toast({
        title: "Erro ao criar anúncio",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showExpertAlert && (
        <Alert>
          <Phone className="h-4 w-4" />
          <AlertDescription className="ml-2">
            Após publicar seu anúncio, você poderá avisar um especialista para ajudar na negociação via WhatsApp.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Anunciar Carta de Consórcio</CardTitle>
          <CardDescription>
            Preencha os dados da sua carta contemplada para publicar no marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div className="space-y-3">
              <Label>Tipo de Consórcio</Label>
              <RadioGroup
                value={formData.consortium_type}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    consortium_type: value as "property" | "vehicle",
                  }))
                }
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="property"
                  className={`flex items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.consortium_type === "property"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <RadioGroupItem value="property" id="property" />
                  <span>Imóvel</span>
                </Label>
                <Label
                  htmlFor="vehicle"
                  className={`flex items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.consortium_type === "vehicle"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <RadioGroupItem value="vehicle" id="vehicle" />
                  <span>Veículo</span>
                </Label>
              </RadioGroup>
            </div>

            {/* Administrator */}
            <div className="space-y-2">
              <Label htmlFor="administrator">Administradora</Label>
              <Input
                id="administrator"
                name="administrator"
                placeholder="Ex: Bradesco, Caixa, Itaú"
                value={formData.administrator}
                onChange={handleInputChange}
                className={errors.administrator ? "border-destructive" : ""}
              />
              {errors.administrator && (
                <p className="text-xs text-destructive">{errors.administrator}</p>
              )}
            </div>

            {/* Credit Value */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credit_value">Valor do Crédito (R$)</Label>
                <Input
                  id="credit_value"
                  name="credit_value"
                  type="number"
                  placeholder="0.00"
                  value={formData.credit_value}
                  onChange={handleInputChange}
                  className={errors.credit_value ? "border-destructive" : ""}
                />
                {errors.credit_value && (
                  <p className="text-xs text-destructive">{errors.credit_value}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry_value">Valor de Entrada (R$)</Label>
                <Input
                  id="entry_value"
                  name="entry_value"
                  type="number"
                  placeholder="0.00"
                  value={formData.entry_value}
                  onChange={handleInputChange}
                  className={errors.entry_value ? "border-destructive" : ""}
                />
                {errors.entry_value && (
                  <p className="text-xs text-destructive">{errors.entry_value}</p>
                )}
              </div>
            </div>

            {/* Paid Percentage */}
            <div className="space-y-2">
              <Label htmlFor="paid_percentage">Percentual já Pago (%)</Label>
              <Input
                id="paid_percentage"
                name="paid_percentage"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={formData.paid_percentage}
                onChange={handleInputChange}
                className={errors.paid_percentage ? "border-destructive" : ""}
              />
              {errors.paid_percentage && (
                <p className="text-xs text-destructive">{errors.paid_percentage}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Observações (Opcional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Informações adicionais sobre a carta..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Publicando..." : "Publicar Anúncio"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

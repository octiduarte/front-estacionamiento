"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Home, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
  const t = useTranslations("Reservation");
  const router = useRouter();

  const handleRetry = () => {
     router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleNewReservation = () => {
    router.push('/reservations/create');
  };

  return (
    <div className="bg-gradient-to-b from-muted to-black min-h-screen flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl text-destructive">
                {t("paymentCancelled")}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                {t("paymentCancelledMessage")}
              </p>
              
              <div className="bg-accent/15 border border-accent rounded-lg p-4">
                <p className="text-sm text-accent-foreground">
                  {t("modifyDataMessage")}
                </p>
              </div>
              
              {/* Botones Nueva reserva e Ir al inicio: columna en mobile, fila en md+ */}
              <div className="flex flex-col gap-3 md:flex-row">
                <Button 
                  variant="outline"
                  onClick={handleNewReservation}
                  className="w-full md:flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("newReservation")}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleGoHome}
                  className="w-full md:flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  {t("goHome")}
                </Button>
              </div>
              {/* Botón Volver al pago abajo, ancho completo */}
              <Button 
                onClick={handleRetry}
                variant="parking"
                className="w-full mt-3 bg-primary  hover:bg-primary/85"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("backToPayment")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

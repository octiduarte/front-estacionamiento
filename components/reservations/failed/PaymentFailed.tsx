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
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">
                {t("paymentCancelled")}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                {t("paymentCancelledMessage")}
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  {t("modifyDataMessage")}
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleRetry}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("backToPayment")}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleNewReservation}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("newReservation")}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleGoHome}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  {t("goHome")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

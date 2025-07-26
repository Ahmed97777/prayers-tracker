"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-sm shadow-lg border-none">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <p className="text-lg font-medium text-muted-foreground">
            Loading, please wait...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loading;

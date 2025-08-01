import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Construction className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">{description}</p>
          <p className="text-sm text-muted-foreground">
            This page is under development. Contact @robina2721 at Telegram.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

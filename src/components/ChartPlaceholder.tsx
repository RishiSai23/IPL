import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const ChartPlaceholder = () => {
  return (
    <Card className="gradient-card border hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Performance Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
          <div className="text-center space-y-2">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">
              Chart visualization coming soon
            </p>
            <p className="text-xs text-muted-foreground">
              Performance comparison over time
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ChartPlaceholder;

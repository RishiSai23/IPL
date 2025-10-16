import MatchWizard from "@/components/match/MatchWizard";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddMatch = () => {
  const steps = [
    { id: 1, label: "Match Info" },
    { id: 2, label: "Innings Summary" },
    { id: 3, label: "Player Contributions" },
    { id: 4, label: "Review & Save" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Add Match</h1>
          <p className="text-muted-foreground">
            Enter T20 innings-level details and player contributions to compute talent scores.
          </p>
        </div>

        {/* Stepper */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Match Entry Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {steps.map((s) => (
                <li
                  key={s.id}
                  className="rounded-lg border border-border bg-card px-4 py-3 flex items-center gap-3"
                >
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-7 h-7 text-sm font-semibold">
                    {s.id}
                  </span>
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                </li>
              ))}
            </ol>

            {/* Wizard */}
            <div className="mt-6">
              <MatchWizard />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddMatch;

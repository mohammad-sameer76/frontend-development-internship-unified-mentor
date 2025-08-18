import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Target, Clock } from 'lucide-react';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuth } from '@/hooks/useAuth';

export function MemberDietPlan() {
  const { userData } = useAuth();
  const { data: dietPlans, loading } = useFirestore('dietPlans');
  
  // Filter diet plans for current member
  const memberDietPlans = dietPlans.filter(plan => plan.memberEmail === userData?.email);
  const latestPlan = memberDietPlans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  if (loading) {
    return <div>Loading diet plan...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5" />
          My Diet Plan
        </CardTitle>
        <CardDescription>Your personalized nutrition plan</CardDescription>
      </CardHeader>
      <CardContent>
        {!latestPlan ? (
          <div className="text-center py-8 text-muted-foreground">
            No diet plan assigned yet. Please contact your trainer or admin.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Plan Header */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Goal: {latestPlan.goal}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Created: {latestPlan.createdAt}</span>
                </div>
              </div>
              <Badge variant="default">Active Plan</Badge>
            </div>

            {/* Meal Plan */}
            <div className="grid gap-4">
              {latestPlan.breakfast && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    🍳 Breakfast
                  </h3>
                  <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">
                    {latestPlan.breakfast}
                  </p>
                </div>
              )}

              {latestPlan.lunch && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    🍽️ Lunch
                  </h3>
                  <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">
                    {latestPlan.lunch}
                  </p>
                </div>
              )}

              {latestPlan.dinner && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    🍲 Dinner
                  </h3>
                  <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">
                    {latestPlan.dinner}
                  </p>
                </div>
              )}

              {latestPlan.snacks && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    🥜 Snacks
                  </h3>
                  <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">
                    {latestPlan.snacks}
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            {latestPlan.notes && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">📝 Additional Notes</h3>
                <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                  <p className="text-sm">{latestPlan.notes}</p>
                </div>
              </div>
            )}

            {/* Plan History */}
            {memberDietPlans.length > 1 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Previous Plans ({memberDietPlans.length - 1})
                </h3>
                <div className="space-y-1">
                  {memberDietPlans.slice(1).map((plan, index) => (
                    <div key={plan.id} className="text-xs text-muted-foreground p-2 bg-muted/20 rounded">
                      Plan #{index + 2}: {plan.goal} - Created: {plan.createdAt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart } from 'lucide-react';
import { useFirestore } from '@/hooks/useFirestore';
import { useToast } from '@/hooks/use-toast';

export function MemberSupplements() {
  const { data: supplements, loading } = useFirestore('supplements');
  const { toast } = useToast();
  
  // Only show available supplements (in stock)
  const availableSupplements = supplements.filter(supplement => supplement.stock > 0);

  const handlePurchaseInterest = (supplementName: string) => {
    toast({
      title: "Interest Noted",
      description: `We'll contact you about purchasing ${supplementName}. Please speak to the admin for more details.`,
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'destructive', text: 'Out of Stock' };
    if (stock < 5) return { color: 'secondary', text: 'Low Stock' };
    return { color: 'default', text: 'In Stock' };
  };

  if (loading) {
    return <div>Loading supplements...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Available Supplements
        </CardTitle>
        <CardDescription>Browse our supplement store and express interest</CardDescription>
      </CardHeader>
      <CardContent>
        {availableSupplements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No supplements available at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSupplements.map((supplement) => {
              const stockStatus = getStockStatus(supplement.stock);
              return (
                <div key={supplement.id} className="border rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{supplement.name}</h3>
                    <p className="text-sm text-muted-foreground">by {supplement.brand}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-green-600">₹{supplement.price}</span>
                      <Badge variant={stockStatus.color === 'destructive' ? 'destructive' : stockStatus.color === 'secondary' ? 'secondary' : 'default'}>
                        {stockStatus.text}
                      </Badge>
                    </div>
                    
                    {supplement.category && (
                      <Badge variant="outline">{supplement.category}</Badge>
                    )}
                  </div>
                  
                  {supplement.description && (
                    <p className="text-sm text-muted-foreground">{supplement.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Available: {supplement.stock} units
                    </p>
                    
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handlePurchaseInterest(supplement.name)}
                      disabled={supplement.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {supplement.stock === 0 ? 'Out of Stock' : 'Express Interest'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
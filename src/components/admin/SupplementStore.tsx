import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/useFirestore';

export function SupplementStore() {
  const { data: supplements, loading, addItem, updateItem, deleteItem } = useFirestore('supplements');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    category: '',
    description: ''
  });

  const handleAddSupplement = async () => {
    if (!formData.name || !formData.brand || !formData.price || !formData.stock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await addItem({
        name: formData.name,
        brand: formData.brand,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        description: formData.description
      });

      setFormData({ name: '', brand: '', price: '', stock: '', category: '', description: '' });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Supplement added successfully"
      });
    } catch (error) {
      console.error('Error adding supplement:', error);
    }
  };

  const handleDeleteSupplement = async (id: string) => {
    try {
      await deleteItem(id);
      toast({
        title: "Success",
        description: "Supplement deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting supplement:', error);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
    if (stock < 5) return { color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' };
    return { color: 'bg-green-100 text-green-800', text: 'In Stock' };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Supplement Store</CardTitle>
            <CardDescription>Manage gym supplement inventory</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Supplement</DialogTitle>
                <DialogDescription>Enter supplement details below</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="Enter brand name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Protein">Protein</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="Vitamins">Vitamins</SelectItem>
                      <SelectItem value="Pre-Workout">Pre-Workout</SelectItem>
                      <SelectItem value="Post-Workout">Post-Workout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description"
                  />
                </div>
                <Button onClick={handleAddSupplement} className="w-full">
                  Add Supplement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supplements.map((supplement) => {
              const stockStatus = getStockStatus(supplement.stock);
              return (
                <TableRow key={supplement.id}>
                  <TableCell className="font-medium">{supplement.name}</TableCell>
                  <TableCell>{supplement.brand}</TableCell>
                  <TableCell>{supplement.category}</TableCell>
                  <TableCell>₹{supplement.price}</TableCell>
                  <TableCell>{supplement.stock}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteSupplement(supplement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
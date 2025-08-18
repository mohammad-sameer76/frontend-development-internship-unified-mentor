import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function useFirestore<T extends DocumentData>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as unknown as T));
      setData(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName]);

  const addItem = async (item: Omit<T, 'id'>) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: new Date().toISOString()
      });
      toast({
        title: "Success",
        description: "Item added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      toast({
        title: "Success",
        description: "Item updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({
        title: "Success",
        description: "Item deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    data,
    loading,
    addItem,
    updateItem,
    deleteItem
  };
}
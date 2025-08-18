import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export const createDemoAccounts = async () => {
  const demoAccounts = [
    { email: 'admin@gym.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { email: 'member@gym.com', password: 'member123', role: 'member', name: 'Demo Member' },
    { email: 'user@gym.com', password: 'user123', role: 'user', name: 'Demo User' }
  ];

  for (const account of demoAccounts) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: account.email,
        name: account.name,
        role: account.role,
        phone: '+1234567890',
        status: 'active',
        createdAt: new Date().toISOString()
      });
    } catch (error: any) {
      // Account might already exist, skip
      if (!error.message.includes('email-already-in-use')) {
        console.error('Error creating demo account:', error);
      }
    }
  }
};
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserData, UserRole } from '@/types/user';

export function useAuth() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const fetchUserData = async (user: User) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setUserRole(data.role);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    if (user) {
      fetchUserData(user);
    } else {
      setUserData(null);
      setUserRole(null);
    }
  }, [user]);

  return {
    user,
    userData,
    userRole,
    loading,
    error,
    isAdmin: userRole === 'admin',
    isMember: userRole === 'member',
    isUser: userRole === 'user'
  };
}
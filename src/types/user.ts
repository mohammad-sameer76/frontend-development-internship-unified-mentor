export type UserRole = 'admin' | 'member' | 'user';

export interface UserData {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  joinDate?: Date;
  membershipType?: string;
  feePackage?: string;
  isActive?: boolean;
}

export interface Member extends UserData {
  role: 'member';
  membershipType: string;
  feePackage: string;
  joinDate: Date;
  monthlyFee: number;
  lastPayment?: Date;
  nextPayment?: Date;
}

export interface Bill {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
  receiptNumber?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  targetRole?: UserRole;
  targetMembers?: string[];
  createdAt: Date;
  isRead?: boolean;
}

export interface FeePackage {
  id: string;
  name: string;
  duration: number; // in months
  amount: number;
  description: string;
  isActive: boolean;
}

export interface Supplement {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export interface DietPlan {
  id: string;
  memberId: string;
  memberName: string;
  goal: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  notes: string;
  createdAt: Date;
}
export type Role = 'Admin' | 'Trainer' | 'Member';

export interface Member {
  id: string;
  fullName: string;
  photoUrl: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  height: string; // e.g. "180 cm"
  weight: number; // in kg
  bmi: number;
  weightHistory: { date: string; weight: number }[];
  address: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  planId: string;
  joiningDate: string;
  expiryDate: string;
  assignedTrainerId?: string;
  status: 'Active' | 'Expired' | 'Suspended';
}

export interface Trainer {
  id: string;
  name: string;
  photoUrl: string;
  specialization: string;
  experience: string; // e.g., "5 Years"
  contactDetails: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string; // e.g., "1 Month", "1 Year"
  price: number;
  description: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberPhoto: string;
  planName: string;
  timestamp: string; // ISO date or hh:mm A
  status: 'SUCCESS' | 'FAIL';
}

export interface PaymentRecord {
  id: string;
  memberName: string;
  planName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
}

export interface Exercise {
  id: string;
  name: string;
  category: string; // "Chest" | "Back" | "Biceps" | "Triceps" | "Shoulders" | "Legs" | "Core" | "Cardio" | "Functional"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  equipment: string;
  description: string;
  benefits: string[];
  mistakes: string[];
  postureGuide: string[];
  instructions: string[];
  safetyTips: string[];
  bgImage: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  goal: string;
  durationWeeks: number;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: string; // e.g., "8-12"
    restSeconds: number;
    bgImage?: string;
    category?: string;
  }[];
}

export interface DietPlan {
  id: string;
  name: string;
  goal: 'Weight Loss' | 'Muscle Gain' | 'Maintenance';
  meals: {
    mealName: string;
    description: string;
    calories: number;
    protein: number; // in grams
    carbs: number; // in grams
    fats: number; // in grams
    time: string; // e.g., "08:30 AM"
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'expiry' | 'payment' | 'workout' | 'diet' | 'announcement';
}

export interface GymNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread?: boolean;
  category: 'CHECK_IN' | 'SYSTEM' | 'ANNOUNCEMENT';
}

export interface GymStats {
  totalMembers: number;
  activeMembers: number;
  revenueThisMonth: number;
}

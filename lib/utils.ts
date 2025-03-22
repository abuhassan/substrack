import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateNextBillingDate(
  currentDate: Date,
  billingCycle: string
): Date | null {
  // Return null for lifetime purchases as they have no next billing date
  if (billingCycle === 'LIFETIME') {
    return null;
  }
  
  const nextDate = new Date(currentDate);
  
  switch (billingCycle) {
    case 'MONTHLY':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'QUARTERLY':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'BIANNUAL':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'ANNUAL':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    // Handle custom case separately
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  return nextDate;
}

export function formatCurrency(amount: number, currency: string = 'MYR') {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
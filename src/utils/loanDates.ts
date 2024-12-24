import { addDays, addMonths, addYears } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export async function getLoanActivationDate(loanId: number): Promise<Date | null> {
  console.log('Getting activation date for loan:', loanId);
  
  const { data, error } = await supabase
    .from('loan_status_change')
    .select('loan_status_date')
    .eq('loan_id', loanId)
    .eq('loan_status', 'Active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching loan activation date:', error);
    return null;
  }

  return data ? new Date(data.loan_status_date) : null;
}

export async function calculateLoanEndDate(
  loanId: number, 
  activationDate: Date
): Promise<Date | null> {
  console.log('Calculating end date for loan:', loanId);
  
  const { data: tenor, error } = await supabase
    .from('loan_tenor')
    .select('duration, duration_period')
    .eq('loan_id', loanId)
    .single();

  if (error || !tenor) {
    console.error('Error fetching loan tenor:', error);
    return null;
  }

  const { duration, duration_period } = tenor;

  switch (duration_period) {
    case 'Week':
      return addDays(activationDate, duration * 7);
    case 'Month':
      return addMonths(activationDate, duration);
    case 'Year':
      return addYears(activationDate, duration);
    default:
      return null;
  }
}
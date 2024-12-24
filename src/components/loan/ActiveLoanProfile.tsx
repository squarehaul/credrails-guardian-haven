import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateRepaymentSchedule } from "@/utils/loanCalculations";
import { LoanSummaryStats } from "./LoanSummaryStats";
import { LoanTermsDisplay } from "./LoanTermsDisplay";
import { RepaymentScheduleTable } from "./RepaymentScheduleTable";
import { PaymentHistoryTable } from "./PaymentHistoryTable";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";

export function ActiveLoanProfile() {
  const { loanId } = useParams();
  const numericLoanId = Number(loanId);
  const userRole = localStorage.getItem("userRole") as "client" | "manager" | "admin" || "client";

  console.log('ActiveLoanProfile mounted for loan:', numericLoanId);

  const { data: loanData, isLoading: isLoadingLoan } = useQuery({
    queryKey: ['active-loan', numericLoanId],
    queryFn: async () => {
      console.log('Fetching loan data for:', numericLoanId);
      
      const { data, error } = await supabase
        .from('loans')
        .select(`
          *,
          clients (
            first_name,
            last_name,
            national_id,
            email,
            phone_number,
            place_of_work,
            work_economic_activity
          ),
          loan_tenor!inner (
            duration,
            duration_period
          ),
          interest!inner (
            interest_rate,
            interest_period,
            interest_model,
            repayment_installment
          ),
          guarantors (
            name,
            phone_number,
            national_id,
            place_of_work,
            id_photo_front,
            id_photo_back,
            passport_photo
          ),
          collateral (
            name,
            value,
            pic_1,
            pic_2
          )
        `)
        .eq('id', numericLoanId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching loan data:', error);
        toast.error("Error loading loan data");
        throw error;
      }

      console.log('Fetched loan data:', data);
      return data;
    }
  });

  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ['loan-schedule', numericLoanId, loanData?.id],
    queryFn: async () => {
      if (!loanData?.id) {
        console.log('No loan ID available for schedule calculation');
        return null;
      }

      console.log('Generating repayment schedule for loan ID:', loanData.id);
      try {
        const schedule = await generateRepaymentSchedule(loanData.id);
        console.log('Generated schedule:', schedule);
        return schedule;
      } catch (error) {
        console.error('Error generating schedule:', error);
        toast.error("Error calculating repayment schedule");
        return null;
      }
    },
    enabled: !!loanData?.id
  });

  const content = (
    <div className="space-y-6">
      <LoanSummaryStats loanData={loanData} />
      <LoanTermsDisplay 
        interest={loanData?.interest} 
        loan_tenor={loanData?.loan_tenor} 
      />
      {schedule && <RepaymentScheduleTable schedule={schedule} />}
      <PaymentHistoryTable payments={[]} />
    </div>
  );

  if (isLoadingLoan || isLoadingSchedule) {
    return (
      <CompanyDashboardLayout userRole={userRole}>
        <div className="p-4">Loading loan details...</div>
      </CompanyDashboardLayout>
    );
  }

  if (!loanData) {
    return (
      <CompanyDashboardLayout userRole={userRole}>
        <div className="p-4 text-red-500">No loan data found</div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout userRole={userRole}>
      <div className="p-6">
        {content}
      </div>
    </CompanyDashboardLayout>
  );
}
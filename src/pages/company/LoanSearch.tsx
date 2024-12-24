import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { toast } from "sonner";

export default function LoanSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const { companyUsername } = useParams();

  const { data: company } = useQuery({
    queryKey: ['company', companyUsername],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('company_username', companyUsername)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: loans, isError } = useQuery({
    queryKey: ['client-loans', searchTerm, company?.id],
    enabled: !!searchTerm && !!company?.id,
    queryFn: async () => {
      try {
        console.log('Searching for clients with National ID:', searchTerm, 'in company:', company.id);
        
        // First find all clients by national ID within this company
        const { data: clients, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .eq('national_id', searchTerm)
          .eq('company_id', company.id);

        if (clientError) {
          console.error('Error finding clients:', clientError);
          throw clientError;
        }

        if (!clients?.length) {
          console.log('No clients found with this National ID in this company');
          return [];
        }

        const clientIds = clients.map(client => client.id);
        console.log('Found client IDs:', clientIds);

        // Then find their loans using the clients' numeric IDs
        const { data: loans, error: loansError } = await supabase
          .from('loans')
          .select(`
            id,
            loan_id,
            client_id,
            principal,
            loan_purpose,
            loan_status,
            created_at,
            loan_applicant_email,
            loan_applicant_role,
            clients (
              first_name,
              last_name,
              email,
              phone_number,
              national_id
            ),
            loan_tenor (
              duration,
              duration_period
            ),
            interest (
              interest_rate,
              interest_period,
              interest_model,
              repayment_installment
            )
          `)
          .in('client_id', clientIds)
          .neq('loan_status', 'Pending')
          .order('created_at', { ascending: false });

        if (loansError) {
          console.error('Error finding loans:', loansError);
          throw loansError;
        }

        console.log('Found loans:', loans);
        return loans || [];
      } catch (error) {
        console.error("Error in query function:", error);
        toast.error("No loans found for this client");
        return [];
      }
    }
  });

  if (isError) {
    toast.error("Error fetching loans. Please try again.");
  }

  // Get the role from the URL path
  const urlPath = window.location.pathname;
  const userRole = urlPath.includes('/admin/') ? 'admin' : 'manager';

  return (
    <CompanyDashboardLayout userRole={userRole}>
      <div className="container mx-auto p-6">
        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search by National ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline">
              Search
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          {loans?.map((loan) => (
            <Card key={loan.id} className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Loan ID</p>
                  <p className="font-medium">{loan.loan_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{loan.clients.first_name} {loan.clients.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{loan.principal}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{loan.loan_status}</p>
                  </div>
                  <Link 
                    to={`/${companyUsername}/${userRole}/loan/${loan.id}`}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
          {loans?.length === 0 && searchTerm && (
            <p className="text-center text-muted-foreground">No active loans found for this client.</p>
          )}
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
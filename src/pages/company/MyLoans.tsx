import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function MyLoans() {
  const navigate = useNavigate();
  const { companyUsername } = useParams();
  const clientId = localStorage.getItem("userId"); // Changed from clientId to userId to match login storage

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!clientId || userRole !== "client") {
      toast.error("Please login as a client to view your loans");
      navigate("/");
    }
  }, [clientId, navigate]);

  const { data: loans, isLoading } = useQuery({
    queryKey: ['my-loans', clientId],
    queryFn: async () => {
      console.log('Fetching loans for client ID:', clientId);
      
      const { data: loansData, error } = await supabase
        .from('loans')
        .select(`
          *,
          loan_tenor (
            duration,
            duration_period
          ),
          interest (
            interest_rate,
            interest_period
          )
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching loans:', error);
        toast.error("Error loading loans");
        throw error;
      }

      console.log('Fetched loans data:', loansData);
      return loansData;
    },
    enabled: !!clientId
  });

  const handleViewLoan = (loanId: number) => {
    navigate(`/${companyUsername}/client/loan/${loanId}`);
  };

  if (isLoading) {
    return (
      <CompanyDashboardLayout userRole="client">
        <div className="p-6">Loading loans...</div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout userRole="client">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Loans</h1>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans && loans.length > 0 ? (
                loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.loan_id}</TableCell>
                    <TableCell>KES {loan.principal.toLocaleString()}</TableCell>
                    <TableCell>
                      {format(new Date(loan.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={loan.loan_status === 'active' ? 'default' : 'secondary'}
                      >
                        {loan.loan_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewLoan(loan.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No loans found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
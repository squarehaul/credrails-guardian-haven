import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientProfile as ClientProfileComponent } from "@/components/client/ClientProfile";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { toast } from "sonner";
import { UserRole, isValidUserRole } from "@/types/auth";

export default function ClientProfile() {
  const { clientId } = useParams();
  const storedRole = localStorage.getItem("userRole") || "admin";
  const userRole: UserRole = isValidUserRole(storedRole) ? storedRole : "admin";

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      console.log('Fetching client data for ID:', clientId);
      
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          loans (
            *
          ),
          client_next_of_kin (
            *
          )
        `)
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching client:', error);
        toast.error("Error loading client data");
        throw error;
      }

      console.log('Fetched client data:', data);
      return data;
    }
  });

  if (isLoading) {
    return (
      <CompanyDashboardLayout userRole={userRole}>
        <div className="p-6">
          <div>Loading client profile...</div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  if (!client) {
    return (
      <CompanyDashboardLayout userRole={userRole}>
        <div className="p-6">
          <div>Client not found</div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout userRole={userRole}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Client Profile</h1>
        <ClientProfileComponent client={client} />
      </div>
    </CompanyDashboardLayout>
  );
}
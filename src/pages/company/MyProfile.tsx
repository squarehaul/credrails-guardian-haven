import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientProfile } from "@/components/client/ClientProfile";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const navigate = useNavigate();
  const clientId = localStorage.getItem("userId"); // This is set during login

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!clientId || userRole !== "client") {
      toast.error("Please login as a client to view your profile");
      navigate("/");
    }
  }, [clientId, navigate]);

  const { data: client, isLoading } = useQuery({
    queryKey: ['my-profile', clientId],
    queryFn: async () => {
      console.log('Fetching client profile data for ID:', clientId);
      
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
        toast.error("Error loading profile data");
        throw error;
      }

      console.log('Fetched client data:', data);
      return data;
    },
    enabled: !!clientId
  });

  if (isLoading) {
    return (
      <CompanyDashboardLayout userRole="client">
        <div className="p-6">Loading profile...</div>
      </CompanyDashboardLayout>
    );
  }

  if (!client) {
    return (
      <CompanyDashboardLayout userRole="client">
        <div className="p-6">Profile not found</div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout userRole="client">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <ClientProfile client={client} />
      </div>
    </CompanyDashboardLayout>
  );
}
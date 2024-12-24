import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientProfile as ClientProfileComponent } from "@/components/client/ClientProfile";
import { toast } from "sonner";

export default function AdminClientProfile() {
  const { clientId } = useParams();

  const { data: client, isLoading } = useQuery({
    queryKey: ['admin-client', clientId],
    queryFn: async () => {
      console.log('Admin fetching client data for ID:', clientId);
      
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          loans (
            *,
            interest (*),
            loan_tenor (*)
          ),
          client_next_of_kin (*)
        `)
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching client:', error);
        toast.error("Error loading client data");
        throw error;
      }

      console.log('Admin fetched client data:', data);
      return data;
    }
  });

  const content = isLoading ? (
    <div className="p-6">
      <div>Loading client profile...</div>
    </div>
  ) : !client ? (
    <div className="p-6">
      <div>Client not found</div>
    </div>
  ) : (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Client Profile</h1>
      <ClientProfileComponent client={client} />
    </div>
  );

  return content;
}
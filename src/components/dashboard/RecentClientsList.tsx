import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface RecentClient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  loanCount: number;
}

interface RecentClientsListProps {
  clients: RecentClient[];
}

export function RecentClientsList({ clients }: RecentClientsListProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleViewClient = (clientId: number) => {
    console.log('Viewing client:', clientId);
    // Get the current path and add /client/{id} to it
    const basePath = location.pathname;
    navigate(`${basePath}/client/${clientId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Clients</h2>
      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border"
          >
            <div>
              <h3 className="font-medium">
                {client.first_name} {client.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {client.loanCount} loans
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleViewClient(client.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
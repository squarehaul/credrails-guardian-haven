import { DashboardCard } from "@/components/DashboardCard";
import { CreditorsList } from "@/components/CreditorsList";
import { DollarSign, CreditCard, Calendar, ChartBar } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Credrails Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardCard
          title="Total Outstanding"
          value="$12,500"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Active Creditors"
          value="3"
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Due This Month"
          value="2"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Payment Rate"
          value="85%"
          icon={<ChartBar className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Creditors</h2>
        <CreditorsList />
      </div>
    </div>
  );
};

export default Index;
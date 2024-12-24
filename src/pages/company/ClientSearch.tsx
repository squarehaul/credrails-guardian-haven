import { useEffect } from "react";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { ClientSearch } from "@/components/client/ClientSearch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ClientSearchPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (!userRole || (userRole !== "admin" && userRole !== "manager")) {
      toast.error("Unauthorized access");
      navigate("/");
    }
  }, [userRole, navigate]);

  if (!userRole) return null;

  return (
    <CompanyDashboardLayout userRole={userRole as "admin" | "manager"}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Client Search</h1>
        <ClientSearch />
      </div>
    </CompanyDashboardLayout>
  );
}
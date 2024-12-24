import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Creditor {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
}

const creditors: Creditor[] = [
  { id: "1", name: "ABC Corp", amount: 5000, dueDate: "2024-03-15", status: "pending" },
  { id: "2", name: "XYZ Ltd", amount: 3500, dueDate: "2024-03-10", status: "paid" },
  { id: "3", name: "123 Industries", amount: 7500, dueDate: "2024-02-28", status: "overdue" },
];

export function CreditorsList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creditor</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creditors.map((creditor) => (
            <TableRow key={creditor.id}>
              <TableCell className="font-medium">{creditor.name}</TableCell>
              <TableCell>${creditor.amount.toLocaleString()}</TableCell>
              <TableCell>{new Date(creditor.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    creditor.status === "paid"
                      ? "default"
                      : creditor.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {creditor.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
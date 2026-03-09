import { requireAdminAuth } from "@/lib/admin-auth";
import AdminImportsClient from "./page-client";

export default async function AdminImportsPage() {
  await requireAdminAuth();
  return (
    <AdminImportsClient />
  );
}

import { AdminProductsPage } from "@/components/admin/AdminProductsPage";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";

export default function Admin() {
  return (
    <ProtectedAdminRoute>
      <AdminProductsPage />
    </ProtectedAdminRoute>
  );
}

import { connection } from "next/server";
import AdminNewProductPage from "./AdminNewProductsPage";

export default async function Page() {
  await connection();
  return <AdminNewProductPage />;
}

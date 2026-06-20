// app/account/page.tsx
import { redirect } from "next/navigation";

export default function AccountIndexPage() {
  redirect("/account/orders");
}
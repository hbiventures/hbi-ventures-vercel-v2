import { redirect } from "next/navigation";

export default function PartnersPage() {
  // These are Academy program relationships, not Ventures commercial partners.
  redirect("https://hbisteam.org/about#partners-title");
}

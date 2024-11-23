import { auth } from "@/auth";
import Header from "@/components/ui/header";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

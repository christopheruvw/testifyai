import { LoginForm } from "@/components/admin/login-form";
import { BrandBackground, BrandLogo } from "@/components/brand/brand-background";

export default function AdminLoginPage() {
  return (
    <>
      <BrandBackground />
      <main className="brand-page relative flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md space-y-6">
          <BrandLogo />
          <LoginForm />
        </div>
      </main>
    </>
  );
}

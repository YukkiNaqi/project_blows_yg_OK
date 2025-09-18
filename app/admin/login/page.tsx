import { LoginForm } from "@/components/auth/login-form"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <LoginForm isAdminLogin={true} />

        <div className="mt-6 p-4 bg-card border rounded-lg">
          <h3 className="font-semibold mb-2">Informasi Login Admin</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Superadmin:</strong>
            </p>
            <p>Username: Agungsaputra</p>
            <p>Password: 12345678910</p>
            <p className="mt-2 text-xs">Akses penuh ke semua fitur manajemen sistem</p>
          </div>
        </div>
      </div>
    </div>
  )
}

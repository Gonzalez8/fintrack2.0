"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  TrendingUp,
  Eye,
  EyeOff,
  PieChart,
  BarChart3,
  Shield,
  Wallet,
} from "lucide-react";
import { authApi, ApiClientError } from "@/lib/api-client";

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
const ALLOW_REGISTRATION =
  process.env.NEXT_PUBLIC_ALLOW_REGISTRATION !== "false";

// ── Login form ───────────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.login({ username, password });
      onSuccess();
    } catch {
      setError("Credenciales invalidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="login-user">Usuario</Label>
        <Input
          id="login-user"
          placeholder="Tu nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-pass">Contrasena</Label>
        <div className="relative">
          <Input
            id="login-pass"
            type={showPassword ? "text" : "password"}
            placeholder="Tu contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      <Button
        type="submit"
        className="w-full h-10 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] hover:from-[#1e40af] hover:to-[#2563eb] shadow-[0_2px_12px_rgba(59,130,246,0.3)]"
        disabled={loading}
      >
        {loading ? "Iniciando sesion..." : "Iniciar sesion"}
      </Button>
    </form>
  );
}

// ── Register form ────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const setField = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await authApi.register(form);
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        try {
          const data = JSON.parse(err.body);
          const flat: Record<string, string> = {};
          for (const [k, v] of Object.entries(data)) {
            flat[k] = Array.isArray(v) ? (v as string[])[0] : String(v);
          }
          setErrors(flat);
        } catch {
          setErrors({ non_field_errors: "Error al registrar" });
        }
      } else {
        setErrors({ non_field_errors: "Error al registrar" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-user">Usuario</Label>
        <Input
          id="reg-user"
          placeholder="Elige un nombre de usuario"
          value={form.username}
          onChange={(e) => setField("username", e.target.value)}
          autoFocus
          autoComplete="username"
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email" className="text-muted-foreground">
          Email <span className="text-xs font-normal">(opcional)</span>
        </Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="tu@email.com"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-pass">Contrasena</Label>
        <div className="relative">
          <Input
            id="reg-pass"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 caracteres"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-pass2">Confirmar contrasena</Label>
        <Input
          id="reg-pass2"
          type={showPassword ? "text" : "password"}
          placeholder="Repite la contrasena"
          value={form.password2}
          onChange={(e) => setField("password2", e.target.value)}
          autoComplete="new-password"
        />
        {errors.password2 && (
          <p className="text-xs text-destructive">{errors.password2}</p>
        )}
      </div>
      {errors.non_field_errors && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2">
          <p className="text-sm text-destructive">{errors.non_field_errors}</p>
        </div>
      )}
      <Button
        type="submit"
        className="w-full h-10 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] hover:from-[#1e40af] hover:to-[#2563eb] shadow-[0_2px_12px_rgba(59,130,246,0.3)]"
        disabled={loading}
      >
        {loading ? "Registrando..." : "Crear cuenta"}
      </Button>
    </form>
  );
}

// ── Feature highlights for left panel ────────────────────────────
const highlights = [
  { icon: PieChart, text: "Cartera en tiempo real" },
  { icon: BarChart3, text: "P&L y fiscalidad" },
  { icon: Wallet, text: "Dividendos e intereses" },
  { icon: Shield, text: "Privacidad total, self-hosted" },
];

// ── Page ─────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState("");

  const onSuccess = () => router.push("/");

  const handleDemo = async () => {
    setDemoLoading(true);
    setDemoError("");
    try {
      const { worker } = await import("@/demo/index");
      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: { url: "/mockServiceWorker.js" },
      });
      await authApi.login({ username: "demo", password: "demo" });
      router.push("/");
    } catch {
      setDemoError("Error al iniciar demo");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left panel — Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(59,130,246,0.08),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] shadow-[0_0_24px_rgba(59,130,246,0.5)]">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-mono text-sm font-bold tracking-[3px] uppercase text-white">
              Fintrack
            </span>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.15] text-white">
                Controla tus{" "}
                <span className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">
                  inversiones
                </span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                Cartera, operaciones, dividendos, intereses y fiscalidad.
                Todo en un unico panel.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                >
                  <Icon className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="text-sm text-slate-300">{text}</span>
                </div>
              ))}
            </div>

            {/* Mock stats */}
            <div className="flex gap-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[2px] text-slate-500 mb-1">
                  Patrimonio
                </p>
                <p className="text-2xl font-bold tabular-nums text-white">
                  127.450 &euro;
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[2px] text-slate-500 mb-1">
                  Rentabilidad
                </p>
                <p className="text-2xl font-bold tabular-nums text-green-400">
                  +12,4%
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[2px] text-slate-500 mb-1">
                  Dividendos
                </p>
                <p className="text-2xl font-bold tabular-nums text-blue-400">
                  3.210 &euro;
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-slate-500">
              Open Source &middot; Self-Hosted &middot; Privado
            </span>
          </div>
        </div>
      </div>

      {/* ── Right panel — Auth form ── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="flex items-center gap-3 lg:invisible">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="font-mono text-sm font-bold tracking-[3px] uppercase">
              Fintrack
            </span>
          </div>
          <Link
            href="/welcome"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Volver al inicio
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-12">
          <div className="w-full max-w-[400px] space-y-8">
            {/* Heading */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {ALLOW_REGISTRATION ? "Bienvenido" : "Iniciar sesion"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {ALLOW_REGISTRATION
                  ? "Inicia sesion o crea una cuenta para continuar"
                  : "Introduce tus credenciales para acceder"}
              </p>
            </div>

            {/* Auth forms */}
            {ALLOW_REGISTRATION ? (
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="w-full">
                  <TabsTrigger value="login" className="flex-1">
                    Iniciar sesion
                  </TabsTrigger>
                  <TabsTrigger value="register" className="flex-1">
                    Registrarse
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm onSuccess={onSuccess} />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm onSuccess={onSuccess} />
                </TabsContent>
              </Tabs>
            ) : (
              <LoginForm onSuccess={onSuccess} />
            )}

            {/* Demo button */}
            {IS_DEMO && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    o
                  </span>
                </div>
              </div>
            )}
            {IS_DEMO && (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10"
                  disabled={demoLoading}
                  onClick={handleDemo}
                >
                  {demoLoading ? "Cargando demo..." : "Explorar demo sin cuenta"}
                </Button>
                {demoError && (
                  <p className="text-sm text-destructive text-center">
                    {demoError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom footer */}
        <div className="p-4 lg:p-6 text-center">
          <p className="font-mono text-[10px] tracking-[1px] text-muted-foreground">
            Fintrack &middot; Investment Tracker
          </p>
        </div>
      </div>
    </div>
  );
}

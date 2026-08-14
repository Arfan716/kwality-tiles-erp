import { useState } from "react";
import { useNavigate } from "react-router";
import { Package, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("shaikharfan1@gmail.com");
  const [password, setPassword] = useState("password@123");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setLoading(false);
    alert(error.message);
    return;
  }

  const user = data.user;

  if (!user) {
    setLoading(false);
    alert("Login failed");
    return;
  }

  console.log("Logged in User ID:", user.id);

const { data: userProfile, error: profileError } = await supabase
  .from("users")
  .select("*")
  .eq("id", user.id)
  .single();

setLoading(false);

if (profileError || !userProfile) {
  alert("User profile not found.");
  return;
}

localStorage.setItem("userRole", userProfile.role);
localStorage.setItem("userName", userProfile.full_name);
localStorage.setItem("userEmail", user.email || "");
localStorage.setItem(
  "permissions",
  JSON.stringify(userProfile.permissions || [])
);

navigate("/");
};

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90"></div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center">
              <Package className="w-10 h-10 text-primary" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white">
                Kwality Tiles
              </h1>
              <p className="text-xl text-white/90">& Granite</p>
            </div>
          </div>

          <p className="text-2xl text-white mb-6">
            Modern ERP Solution for Building Materials Business
          </p>

          <ul className="space-y-4 text-white/90">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>
                Manage inventory, sales, and purchases effortlessly
              </span>
            </li>

            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>
                Track customers and suppliers in one place
              </span>
            </li>

            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>
                Generate reports and insights instantly
              </span>
            </li>

            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>
                Easy to use for non-technical users
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Package className="w-8 h-8 text-primary-foreground" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Kwality Tiles
              </h1>
              <p className="text-sm text-muted-foreground">
                & Granite
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="mb-8">
              <h2 className="mb-2">Welcome Back</h2>

              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">

              <div>
                <label className="block text-sm mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full px-4 py-3 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 pr-12"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-muted-foreground/10 rounded-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                  />

                  <span className="text-sm text-muted-foreground">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button className="text-primary hover:underline">
                  Contact Administrator
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
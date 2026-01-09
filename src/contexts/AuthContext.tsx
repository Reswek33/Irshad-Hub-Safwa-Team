import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type AppRole = "admin" | "teacher" | "student";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  const ensureUserBootstrap = async (u: User) => {
    try {
      // Create profile if missing
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", u.id)
        .maybeSingle();

      if (!existingProfile) {
        const meta = (u.user_metadata || {}) as Record<string, any>;
        const fullName: string =
          meta.full_name || (u.email ? u.email.split("@")[0] : "User");
        const phone: string | null = meta.phone || null;
        await supabase.from("profiles").insert({
          user_id: u.id,
          full_name: fullName,
          phone: phone,
        });
      }

      // Create default role if missing (student)
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id, role")
        .eq("user_id", u.id)
        .maybeSingle();

      if (!existingRole) {
        await supabase.from("user_roles").insert({
          user_id: u.id,
          role: "student",
        });
        setRole("student");
      } else if (existingRole?.role) {
        setRole(existingRole.role as AppRole);
      }
    } catch (e) {
      console.error("Error bootstrapping user:", e);
    }
  };

  const fetchUserRole = async (userId: string) => {
    setRoleLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .limit(1);

      if (error) {
        console.error("Error fetching role:", error);
        setRoleLoading(false);
        return null;
      }
      setRoleLoading(false);
      return data[0]?.role as AppRole | null;
    } catch (e) {
      console.error("Error fetching role:", e);
      setRoleLoading(false);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Defer role fetch with setTimeout to avoid deadlock
      if (session?.user) {
        setTimeout(() => {
          // Ensure user has required rows, then load role
          ensureUserBootstrap(session.user).then(() => {
            fetchUserRole(session.user!.id).then(setRole);
          });
        }, 0);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        ensureUserBootstrap(session.user).then(() => {
          fetchUserRole(session.user!.id).then(setRole);
        });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });
    // Assume email confirmed by default; attempt immediate sign-in to establish session
    if (!error) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: signInError ?? null };
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        loading: loading || roleLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

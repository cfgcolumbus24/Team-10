"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

// Types matching your server-side interfaces
interface AuthSession {
    token: string;
    createdAt: Date;
    expiresAt: Date;
}

interface AuthUser {
    id: number;
    email: string;
    userType: string;
}

interface AuthContextType {
    session: AuthSession | null;
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState<AuthSession | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);

    const fetchAuthState = async () => {
        try {
            const response = await fetch("/api/auth/session");
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Authentication failed");
            }

            // Parse dates from strings to Date objects
            const authData = result.data.auth;
            setSession({
                ...authData.session,
                createdAt: new Date(authData.session.createdAt),
                expiresAt: new Date(authData.session.expiresAt),
            });
            setUser(authData.user);
            setError(null);
        } catch (err) {
            setSession(null);
            setUser(null);
            setError(
                err instanceof Error ? err.message : "Authentication failed"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthState();
    }, []);

    // Check session expiry and refresh if needed
    useEffect(() => {
        if (!session) return;

        const checkSession = () => {
            const now = new Date();
            const expiresAt = new Date(session.expiresAt);

            // Refresh 2 days before expiry (matching server-side logic)
            if (
                now >= new Date(expiresAt.getTime() - 2 * 24 * 60 * 60 * 1000)
            ) {
                fetchAuthState();
            }
        };

        const interval = setInterval(checkSession, 60 * 1000); // Check every minute
        return () => clearInterval(interval);
    }, [session]);

    return (
        <AuthContext.Provider
            value={{
                session,
                user,
                isLoading,
                error,
                refresh: fetchAuthState,
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

export function withAuth<P extends object>(
    Component: React.ComponentType<P>
): React.FC<P> {
    return function WithAuthComponent(props: P) {
        const { user, isLoading } = useAuth();

        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (!user) {
            // You can replace this with a redirect to login page
            return <div>Please log in to access this page</div>;
        }

        return <Component {...props} />;
    };
}

interface UseAuthRedirectOptions {
    redirectTo?: string;
    redirectIfAuthed?: boolean;
}

export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
    const { redirectTo = "/auth/signin", redirectIfAuthed = false } = options;
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if ((!user && !redirectIfAuthed) || (user && redirectIfAuthed)) {
                router.replace(redirectTo);
            }
        }
    }, [user, isLoading, redirectTo, redirectIfAuthed, router]);

    return { user, isLoading };
}

// Optional: HOC version for class components or simpler usage
export function withAuthRedirect<P extends object>(
    Component: React.ComponentType<P>,
    options: UseAuthRedirectOptions = {}
) {
    return function WithAuthRedirectWrapper(props: P) {
        const { user, isLoading } = useAuthRedirect(options);

        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (
            (!user && !options.redirectIfAuthed) ||
            (user && options.redirectIfAuthed)
        ) {
            return null; // The useEffect will handle the redirect
        }

        return <Component {...props} />;
    };
}

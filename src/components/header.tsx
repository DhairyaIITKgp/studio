"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navLinks = [
    { href: "/", label: "Focus" },
    { href: "/my-forest", label: "My Forest" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">FocusForge</span>
        </Link>
        <nav className="flex items-center space-x-4 flex-1">
          {user && navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
            {user ? (
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            ) : (
                <>
                    {pathname !== '/login' && (
                      <Button variant="ghost" asChild>
                          <Link href="/login">Login</Link>
                      </Button>
                    )}
                    {pathname !== '/signup' && (
                      <Button asChild>
                          <Link href="/signup">Sign Up</Link>
                      </Button>
                    )}
                </>
            )}
        </div>
      </div>
    </header>
  );
}

import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type Role = "admin" | "tenant";

export type AppSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export async function getSession(): Promise<AppSession | null> {
  return auth.api.getSession({ headers: await headers() });
}

export function getRole(session: AppSession): Role {
  return session.user.role === "admin" ? "admin" : "tenant";
}

export async function requireSession(nextPath = "/"): Promise<AppSession> {
  const session = await getSession();

  if (!session) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}

export async function requireAdmin(): Promise<AppSession> {
  const session = await requireSession("/admin");

  if (getRole(session) !== "admin") {
    redirect("/tenant");
  }

  return session;
}

export async function requireTenant(): Promise<AppSession> {
  const session = await requireSession("/tenant");

  if (getRole(session) !== "tenant") {
    redirect("/admin");
  }

  return session;
}

"use client";

// @/components/JoinInitiativeButton.tsx
import { useState, useEffect } from "react";
import { Users, UserCheck, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/const/api";
import Link from "next/link";

interface Props {
  initiativeId: string;
  initialMembers?: { id: number }[];
}

type State =
  | "loading"
  | "unauthenticated"
  | "not-eligible"
  | "member"
  | "not-member";

export function JoinInitiativeButton({
  initiativeId,
  initialMembers = [],
}: Props) {
  const [actionLoading, setActionLoading] = useState(false);
  const [state, setState] = useState<State>("loading");
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setState("unauthenticated");
      return;
    }

    try {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      const userId = payload.id;
      const joined = initialMembers.some((m) => m.id === userId);
      setIsMember(joined);

      fetch(`${API_URL}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.role?.name === "member") {
            setState(joined ? "member" : "not-member");
          } else {
            setState("not-eligible");
          }
        })
        .catch(() => setState("not-eligible"));
    } catch {
      setState("unauthenticated");
    }
  }, [initialMembers]);

  async function handleAction() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    setActionLoading(true);
    try {
      const method = isMember ? "DELETE" : "POST";
      const endpoint = isMember
        ? `${API_URL}/api/iniciatives/${initiativeId}/leave`
        : `${API_URL}/api/iniciatives/${initiativeId}/join`;

      const res = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (res.ok) {
        setIsMember(!isMember);
        setState(!isMember ? "member" : "not-member");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setActionLoading(false);
    }
  }

  if (state === "loading") {
    return <div className="h-14 rounded-full bg-muted/50 animate-pulse" />;
  }

  if (state === "unauthenticated") {
    return (
      <Link href="/login">
        <Button className="w-full rounded-full py-6 font-semibold text-base gap-2">
          <LogIn className="h-5 w-5" />
          Iniciar sesión para unirse
        </Button>
      </Link>
    );
  }

  if (state === "not-eligible") {
    return (
      <Button
        disabled
        className="w-full rounded-full py-6 font-semibold text-base opacity-50"
      >
        Solo miembros pueden unirse
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAction}
      disabled={actionLoading}
      variant={isMember ? "outline" : "default"}
      className="w-full rounded-full py-6 font-semibold text-base gap-2.5 transition-all"
    >
      {actionLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isMember ? (
        <>
          <UserCheck className="h-5 w-5 text-primary" />
          Ya eres miembro · Salir
        </>
      ) : (
        <>
          <Users className="h-5 w-5" />
          Unirme a esta iniciativa
        </>
      )}
    </Button>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight, RefreshCw, Lock, CheckCircle2 } from "lucide-react";
import { UserRole } from "@/shared/types/user";
import { useAuth } from "./authContext";
import { getRoleDashboard } from "./rolePermissions";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  moduleName?: string;
}

export function RoleGuard({ allowedRoles, children, moduleName }: RoleGuardProps) {
  const router = useRouter();
  const { user, role, switchRole } = useAuth();

  const isAuthorized = allowedRoles.includes(role);

  if (isAuthorized) {
    return <>{children}</>;
  }

  const userDashboard = getRoleDashboard(role);
  const targetRole = allowedRoles[0];

  const handleSimulateSwitch = (target: UserRole) => {
    switchRole(target);
    router.refresh();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 border-[#e2e8df] shadow-md bg-white text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-[#dc2626]">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="rose" size="md">
            Credential Boundary
          </Badge>
          <h2 className="text-xl font-bold text-[#142019] tracking-tight">
            Role Permission Required
          </h2>
          <p className="text-xs text-[#627267] leading-relaxed">
            You are currently signed in as <strong className="text-[#142019]">{user.name}</strong> with the{" "}
            <strong className="text-[#1b4332]">{role}</strong> persona.
          </p>
        </div>

        <div className="bg-[#f7f9f6] p-4 rounded-xl border border-[#e2e8df] text-left text-xs space-y-2">
          <p className="font-semibold text-[#142019]">
            Authorized Roles for {moduleName || "this Operational Zone"}:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {allowedRoles.map((r) => (
              <span
                key={r}
                className="px-2.5 py-1 rounded-md bg-[#e8f5e9] text-[#1b4332] font-semibold border border-[#c8e6c9] text-[11px]"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href={userDashboard} className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full gap-2 border-[#d6ded4] text-[#334139]">
              <span>Return to My Dashboard</span>
            </Button>
          </Link>

          <Button
            variant="primary"
            size="md"
            onClick={() => handleSimulateSwitch(targetRole)}
            className="w-full sm:w-auto gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Switch to {targetRole}</span>
          </Button>
        </div>

        <p className="text-[11px] text-[#627267] pt-2">
          Tip: You can also switch personas anytime via the top navigation avatar menu.
        </p>
      </Card>
    </div>
  );
}

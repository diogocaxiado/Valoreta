import { useMemo } from "react";
import { IAgent } from "../../../types";

interface RoleFilterProps {
  agents: IAgent[];
  enabledAgents: IAgent[];
  onRoleToggle: (roleName: string) => void;
  canInteract?: boolean;
}

interface RoleInfo {
  displayName: string;
  displayIcon: string;
  total: number;
  enabledCount: number;
}

export function RoleFilter({
  agents,
  enabledAgents,
  onRoleToggle,
  canInteract = true,
}: RoleFilterProps) {
  const roles = useMemo(() => {
    const map = new Map<string, RoleInfo>();

    agents.forEach((a) => {
      const name = a.role.displayName;
      const existing = map.get(name);
      if (existing) {
        existing.total++;
      } else {
        map.set(name, {
          displayName: name,
          displayIcon: a.role.displayIcon,
          total: 1,
          enabledCount: 0,
        });
      }
    });

    enabledAgents.forEach((a) => {
      const entry = map.get(a.role.displayName);
      if (entry) entry.enabledCount++;
    });

    return Array.from(map.values());
  }, [agents, enabledAgents]);

  return (
    <section className="flex justify-center items-center relative z-10 mt-4">
      <div className="flex flex-wrap justify-center gap-2">
        {roles.map((role) => {
          const allEnabled = role.enabledCount === role.total;
          const noneEnabled = role.enabledCount === 0;

          let btnClass =
            "flex items-center gap-2 px-3 py-1.5 rounded border-2 transition-all duration-200 ";

          if (allEnabled) {
            btnClass +=
              "border-valorant-green bg-white/10 text-white opacity-100";
          } else if (noneEnabled) {
            btnClass +=
              "border-white/20 bg-black/40 text-white/40 opacity-60";
          } else {
            btnClass +=
              "border-yellow-500 bg-white/5 text-white/80 opacity-80";
          }

          if (canInteract) {
            btnClass += " cursor-pointer hover:scale-105 hover:brightness-110";
          } else {
            btnClass += " cursor-default";
          }

          return (
            <button
              key={role.displayName}
              className={btnClass}
              onClick={() => canInteract && onRoleToggle(role.displayName)}
              title={
                allEnabled
                  ? `Desabilitar todos ${role.displayName}`
                  : `Habilitar todos ${role.displayName}`
              }
            >
              <img
                src={role.displayIcon}
                alt={role.displayName}
                className="w-5 h-5"
              />
              <span className="text-xs font-montserrat font-bold uppercase tracking-wider">
                {role.displayName}
              </span>
              <span
                className={`text-[10px] font-mono ${
                  allEnabled
                    ? "text-valorant-green"
                    : noneEnabled
                    ? "text-white/30"
                    : "text-yellow-400"
                }`}
              >
                {role.enabledCount}/{role.total}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

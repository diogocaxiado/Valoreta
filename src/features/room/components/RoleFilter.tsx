import { useMemo } from "react";
import { IAgent } from "../../../types";

interface RoleFilterProps {
  agents: IAgent[];
  enabledAgents: IAgent[];
  onRoleToggle: (roleName: string) => void;
  canInteract?: boolean;
  hasResult?: boolean;
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
  hasResult = false,
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
    <section className="flex justify-center items-center relative z-10 mt-2 sm:mt-3 md:mt-4 px-2">
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {roles.map((role) => {
          const allEnabled = role.enabledCount === role.total;
          const noneEnabled = role.enabledCount === 0;

          let btnClass =
            "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded border-2 transition-all duration-200 ";

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

          if (hasResult) {
            btnClass += " cursor-not-allowed opacity-50";
          } else if (canInteract) {
            btnClass += " cursor-pointer hover:scale-105 hover:brightness-110";
          } else {
            btnClass += " cursor-default grayscale opacity-50 select-none";
          }

          return (
            <button
              key={role.displayName}
              className={btnClass}
              onClick={() => canInteract && !hasResult && onRoleToggle(role.displayName)}
              title={
                !canInteract
                  ? "Apenas o Host pode alterar os filtros"
                  : allEnabled
                  ? `Desabilitar todos ${role.displayName}`
                  : `Habilitar todos ${role.displayName}`
              }
            >
              <img
                src={role.displayIcon}
                alt={role.displayName}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 object-contain"
              />
              <span className="text-[10px] sm:text-xs font-montserrat font-bold uppercase tracking-wider">
                {role.displayName}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

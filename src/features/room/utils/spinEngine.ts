import { IAgent } from "../../../types";

export interface SpinCallbacks {
  onTick: (agent: IAgent) => void;
  onComplete: (agent: IAgent) => void;
}

export function createSpinAnimation(
  agents: IAgent[],
  callbacks: SpinCallbacks
): { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let cancelled = false;

  const SPIN_DURATION = 2000;
  const SPIN_INTERVAL = 100;

  function start() {
    intervalId = setInterval(() => {
      if (!cancelled) {
        const randomIndex = Math.floor(Math.random() * agents.length);
        callbacks.onTick(agents[randomIndex]);
      }
    }, SPIN_INTERVAL);

    timeoutId = setTimeout(() => {
      if (intervalId !== null) clearInterval(intervalId);
      if (!cancelled) {
        const finalIndex = Math.floor(Math.random() * agents.length);
        callbacks.onComplete(agents[finalIndex]);
      }
    }, SPIN_DURATION);
  }

  function cancel() {
    cancelled = true;
    if (intervalId !== null) clearInterval(intervalId);
    if (timeoutId !== null) clearTimeout(timeoutId);
  }

  start();

  return { cancel };
}

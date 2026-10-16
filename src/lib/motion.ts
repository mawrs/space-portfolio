import gsap from "gsap";
import { flight } from "./flight";

export function startFlight() {
  if (flight.started || flight.mode === "idle") return false;
  const selector =
    flight.mode === "open"
      ? "[data-project-sheet]"
      : `[data-gl="card"][data-id="${flight.id}"]`;
  if (!document.querySelector(selector)) return false;
  flight.started = true;
  gsap.to(flight.progress, {
    value: 1,
    duration: 0.95,
    ease: "power3.inOut",
    overwrite: true,
  });
  return true;
}

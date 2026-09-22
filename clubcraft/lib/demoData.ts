/**
 * Demo sessions — the canonical ClubCraft seed list.
 * Used when Supabase is not configured yet, so the demo path ALWAYS works.
 * Dates are generated relative to "now" and always future-facing.
 */
export function demoWorkshops() {
  const at = (d: number, h: number, m: number) => {
    const t = new Date(Date.now() + d * 864e5);
    t.setHours(h, m, 0, 0);
    return t.toISOString();
  };
  return [
    { id: 'w1', title: 'Shipping the Golden Path', description: 'How we froze the stack on day one, drew the state matrix before the screens, and built in demo order — login, gate, grid, button. The unglamorous decisions that make a demo boring, in the best possible way.', speaker: 'Maya Okafor', role: 'Core · API', location: 'Forge Hall — Stage A', dur: '45 min', starts_at: at(2, 17, 30) },
    { id: 'w2', title: 'The Optimistic Interface', description: 'Flip the button first, reconcile later. A field guide to optimistic UI: instant flips, 409s that are not errors, and reverting with grace when the network disagrees with your confidence.', speaker: 'Dev Ramanan', role: 'Surface · Frontend', location: 'Forge Hall — Stage A', dur: '40 min', starts_at: at(4, 18, 0) },
    { id: 'w3', title: 'Auth Without Tears', description: 'Sessions without ceremony. Email and password done properly, inline validation that respects the person typing, and the tiny ?next= trick that makes redirects feel like magic instead of punishment.', speaker: 'Lena Vogt', role: 'Core · Auth', location: 'Workshop Bay 2', dur: '50 min', starts_at: at(6, 17, 30) },
    { id: 'w4', title: 'Designing at 375 Pixels', description: 'One primary action per screen, contrast you can read in a bright hall, focus rings you can see in the dark. Mobile-first is not a constraint — it is the floor everything else stands on.', speaker: 'Sofia Marchetti', role: 'Surface · Design', location: 'Workshop Bay 2', dur: '40 min', starts_at: at(9, 16, 0) },
    { id: 'w5', title: 'States Are the Product', description: 'Loading, empty, error, success — four states per view, no exceptions. Why the empty state deserves real copy, the error state deserves an apology, and the success state deserves a stamp.', speaker: 'Jonas Feld', role: 'Surface · Frontend', location: 'Forge Hall — Stage B', dur: '45 min', starts_at: at(12, 17, 30) },
    { id: 'w6', title: 'Demo Day Rehearsal', description: 'The full run: no typing live, no fresh signups, console clean from load to logout. We click the golden path until it clicks back. Bring your demo hat and your most pessimistic teammate.', speaker: 'The ClubCraft Crew', role: 'All lanes', location: 'Main Floor', dur: '90 min', starts_at: at(15, 18, 30) }
  ];
}

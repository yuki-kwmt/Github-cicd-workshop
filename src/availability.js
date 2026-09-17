export function formatAvailability(capacity, attendees) {
  const remainingSeats = Math.max(capacity - attendees, 0)

  if (remainingSeats === 0) {
    return '満席'
  }

  return `残り ${remainingSeats} 席`
}

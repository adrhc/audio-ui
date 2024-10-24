export function truncateVolume(volume?: number | null) {
  return volume == null ? 0 : Math.max(0, Math.min(100, volume));
}

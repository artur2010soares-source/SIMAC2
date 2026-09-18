export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}

export const MODEL_URLS = {
  truck: assetUrl('models/truck.glb'),
  crate: assetUrl('models/crate.glb'),
};

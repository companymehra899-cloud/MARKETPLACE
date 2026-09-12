export function inr(n) {
  const num = Number(n) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function typeLabel(type) {
  return type === 'app' ? 'Android App' : 'Website';
}

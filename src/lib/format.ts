const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const date = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const longDate = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatCurrency(value: number): string {
  return currency.format(value);
}

export function formatDate(value: Date | string): string {
  return date.format(new Date(value));
}

export function formatLongDate(value: Date | string): string {
  return longDate.format(new Date(value));
}

export function formatAddress(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(", ");
}

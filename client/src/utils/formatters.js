export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(value))
    : 'N/A';
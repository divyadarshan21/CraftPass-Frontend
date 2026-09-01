import { format, formatDistanceToNow } from 'date-fns';

export const formatters = {
  date: (date, formatStr = 'MMM d, yyyy') => {
    if (!date) return '—';
    return format(new Date(date), formatStr);
  },

  dateTime: (date) => {
    if (!date) return '—';
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  },

  timeAgo: (date) => {
    if (!date) return '—';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  },

  currency: (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  number: (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  },

  truncate: (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  },

  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  slugify: (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};
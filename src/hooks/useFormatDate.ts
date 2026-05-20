import { UK_TIMEZONE } from '@/constants';

export const useFormatDate = () => {
  const formatDate = (dateStr: string | Date): string => {
    if (!dateStr) return 'TBC';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: UK_TIMEZONE,
    });
  };

  const formatTime = (dateStr: string | Date): string => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: UK_TIMEZONE,
    }) + ' GMT';
  };

  const formatDateTime = (dateStr: string | Date): string => {
    if (!dateStr) return 'TBC';
    return new Date(dateStr).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: UK_TIMEZONE,
    }) + ' GMT';
  };

  return { formatDate, formatTime, formatDateTime };
};

export default useFormatDate;

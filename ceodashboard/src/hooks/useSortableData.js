import { useMemo, useState } from 'react';

const parseValue = (value) => {
  if (value == null) return '';
  if (typeof value === 'number') return value;

  const asNumber = Number(value);
  if (!Number.isNaN(asNumber) && value !== '') return asNumber;

  const asDate = Date.parse(value);
  if (!Number.isNaN(asDate)) return asDate;

  return String(value).toLowerCase();
};

export default function useSortableData(items, initialConfig = { key: null, direction: 'asc' }) {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  const sortedItems = useMemo(() => {
    const sortable = [...items];
    if (!sortConfig.key) return sortable;

    sortable.sort((a, b) => {
      const aValue = parseValue(a[sortConfig.key]);
      const bValue = parseValue(b[sortConfig.key]);

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sortable;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }

      return { key, direction: 'asc' };
    });
  };

  return { sortedItems, sortConfig, requestSort };
}

import React from 'react';
import { FilterType } from '../../types';
import './TodoFilter.css';

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filter,
  onFilterChange,
}) => {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="todo-filter" role="group" aria-label="Filter todos">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          className={filter === value ? 'active' : ''}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

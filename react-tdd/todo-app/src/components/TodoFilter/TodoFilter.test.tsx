import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilter } from './TodoFilter';
import { FilterType } from '../../types';

describe('TodoFilter', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders three filter buttons', () => {
    render(<TodoFilter filter="all" onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /completed/i })
    ).toBeInTheDocument();
  });

  it('highlights the active filter', () => {
    render(<TodoFilter filter="all" onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: /all/i })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /active/i })).not.toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /completed/i })).not.toHaveClass(
      'active'
    );
  });

  it('highlights active filter when filter is "active"', () => {
    render(<TodoFilter filter="active" onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: /all/i })).not.toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /active/i })).toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /completed/i })).not.toHaveClass(
      'active'
    );
  });

  it('highlights completed filter when filter is "completed"', () => {
    render(
      <TodoFilter filter="completed" onFilterChange={mockOnFilterChange} />
    );

    expect(screen.getByRole('button', { name: /all/i })).not.toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /active/i })).not.toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: /completed/i })).toHaveClass(
      'active'
    );
  });

  it('calls onFilterChange with "all" when All button is clicked', async () => {
    const user = userEvent.setup();

    render(<TodoFilter filter="active" onFilterChange={mockOnFilterChange} />);

    await user.click(screen.getByRole('button', { name: /all/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith('all');
  });

  it('calls onFilterChange with "active" when Active button is clicked', async () => {
    const user = userEvent.setup();

    render(<TodoFilter filter="all" onFilterChange={mockOnFilterChange} />);

    await user.click(screen.getByRole('button', { name: /active/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith('active');
  });

  it('calls onFilterChange with "completed" when Completed button is clicked', async () => {
    const user = userEvent.setup();

    render(<TodoFilter filter="all" onFilterChange={mockOnFilterChange} />);

    await user.click(screen.getByRole('button', { name: /completed/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith('completed');
  });
});

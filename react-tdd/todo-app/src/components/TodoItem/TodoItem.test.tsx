import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import { Todo } from '../../types';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    text: 'Learn TDD',
    completed: false,
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todo text', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Learn TDD')).toBeInTheDocument();
  });

  it('renders a checkbox', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('checkbox is unchecked when todo is not completed', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('checkbox is checked when todo is completed', () => {
    const completedTodo: Todo = { ...mockTodo, completed: true };

    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onToggle with todo id when checkbox is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    );

    await user.click(screen.getByRole('checkbox'));

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('renders a delete button', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onDelete with todo id when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('applies completed style when todo is completed', () => {
    const completedTodo: Todo = { ...mockTodo, completed: true };

    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const todoText = screen.getByText('Learn TDD');
    expect(todoText).toHaveClass('completed');
  });
});

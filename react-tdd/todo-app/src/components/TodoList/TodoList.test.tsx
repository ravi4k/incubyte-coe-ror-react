import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from './TodoList';
import { Todo } from '../../types';

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    { id: '1', text: 'Learn TDD', completed: false },
    { id: '2', text: 'Write tests', completed: true },
    { id: '3', text: 'Build app', completed: false },
  ];

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a list of todos', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Learn TDD')).toBeInTheDocument();
    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.getByText('Build app')).toBeInTheDocument();
  });

  it('renders empty state when no todos', () => {
    render(
      <TodoList todos={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    );

    expect(screen.getByText(/no todos/i)).toBeInTheDocument();
  });

  it('passes onToggle to TodoItem components', async () => {
    const user = userEvent.setup();

    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('passes onDelete to TodoItem components', async () => {
    const user = userEvent.setup();

    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith('2');
  });

  it('renders todos in the correct order', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent('Learn TDD');
    expect(listItems[1]).toHaveTextContent('Write tests');
    expect(listItems[2]).toHaveTextContent('Build app');
  });
});

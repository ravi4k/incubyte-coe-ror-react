import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from './TodoForm';

describe('TodoForm', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders an input field', () => {
    render(<TodoForm onAdd={mockOnAdd} />);

    expect(
      screen.getByRole('textbox', { name: /add todo/i })
    ).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    render(<TodoForm onAdd={mockOnAdd} />);

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('allows user to type in the input', async () => {
    const user = userEvent.setup();

    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByRole('textbox', { name: /add todo/i });
    await user.type(input, 'New todo');

    expect(input).toHaveValue('New todo');
  });

  it('calls onAdd with input value when form is submitted', async () => {
    const user = userEvent.setup();

    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByRole('textbox', { name: /add todo/i });
    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });

  it('clears input after form submission', async () => {
    const user = userEvent.setup();

    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByRole('textbox', { name: /add todo/i });
    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(input).toHaveValue('');
  });

  it('does not call onAdd when input is empty', async () => {
    const user = userEvent.setup();

    render(<TodoForm onAdd={mockOnAdd} />);

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('does not call onAdd when input contains only whitespace', async () => {
    const user = userEvent.setup();

    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByRole('textbox', { name: /add todo/i });
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('trims whitespace from input before calling onAdd', async () => {
    const user = userEvent.setup();

    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByRole('textbox', { name: /add todo/i });
    await user.type(input, '  New todo  ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });

  it('submits form when Enter key is pressed', async () => {
    const user = userEvent.setup();

    render(<TodoForm onAdd={mockOnAdd} />);

    const input = screen.getByRole('textbox', { name: /add todo/i });
    await user.type(input, 'New todo{Enter}');

    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });
});

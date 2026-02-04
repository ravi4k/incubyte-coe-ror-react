import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
  });

  describe('rendering', () => {
    it('renders the app title', () => {
      render(<App />);

      expect(
        screen.getByRole('heading', { name: /todo app/i })
      ).toBeInTheDocument();
    });

    it('renders the todo form', () => {
      render(<App />);

      expect(
        screen.getByRole('textbox', { name: /add todo/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('renders the filter buttons', () => {
      render(<App />);

      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /active/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /completed/i })
      ).toBeInTheDocument();
    });

    it('renders empty state when no todos', () => {
      render(<App />);

      expect(screen.getByText(/no todos/i)).toBeInTheDocument();
    });
  });

  describe('adding todos', () => {
    it('adds a new todo when form is submitted', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByRole('textbox', { name: /add todo/i });
      await user.type(input, 'Learn TDD');
      await user.click(screen.getByRole('button', { name: /add/i }));

      expect(screen.getByText('Learn TDD')).toBeInTheDocument();
    });

    it('adds multiple todos', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByRole('textbox', { name: /add todo/i });

      await user.type(input, 'First todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      await user.type(input, 'Second todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      expect(screen.getByText('First todo')).toBeInTheDocument();
      expect(screen.getByText('Second todo')).toBeInTheDocument();
    });

    it('saves todos to localStorage when added', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByRole('textbox', { name: /add todo/i });
      await user.type(input, 'Learn TDD');
      await user.click(screen.getByRole('button', { name: /add/i }));

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'todos',
        expect.stringContaining('Learn TDD')
      );
    });
  });

  describe('toggling todos', () => {
    it('marks a todo as completed when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo first
      const input = screen.getByRole('textbox', { name: /add todo/i });
      await user.type(input, 'Learn TDD');
      await user.click(screen.getByRole('button', { name: /add/i }));

      // Toggle it
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it('marks a completed todo as incomplete when checkbox is clicked again', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo
      const input = screen.getByRole('textbox', { name: /add todo/i });
      await user.type(input, 'Learn TDD');
      await user.click(screen.getByRole('button', { name: /add/i }));

      // Toggle twice
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      await user.click(checkbox);

      expect(checkbox).not.toBeChecked();
    });
  });

  describe('deleting todos', () => {
    it('removes a todo when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo
      const input = screen.getByRole('textbox', { name: /add todo/i });
      await user.type(input, 'Learn TDD');
      await user.click(screen.getByRole('button', { name: /add/i }));

      expect(screen.getByText('Learn TDD')).toBeInTheDocument();

      // Delete it
      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(screen.queryByText('Learn TDD')).not.toBeInTheDocument();
    });

    it('only deletes the clicked todo', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByRole('textbox', { name: /add todo/i });

      await user.type(input, 'First todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      await user.type(input, 'Second todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      // Delete first todo
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(screen.queryByText('First todo')).not.toBeInTheDocument();
      expect(screen.getByText('Second todo')).toBeInTheDocument();
    });
  });

  describe('filtering todos', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByRole('textbox', { name: /add todo/i });

      // Add two todos
      await user.type(input, 'Active todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      await user.type(input, 'Completed todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      // Mark second as completed
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);
    });

    it('shows all todos by default', () => {
      expect(screen.getByText('Active todo')).toBeInTheDocument();
      expect(screen.getByText('Completed todo')).toBeInTheDocument();
    });

    it('shows only active todos when Active filter is selected', async () => {
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /^active$/i }));

      expect(screen.getByText('Active todo')).toBeInTheDocument();
      expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
    });

    it('shows only completed todos when Completed filter is selected', async () => {
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /^completed$/i }));

      expect(screen.queryByText('Active todo')).not.toBeInTheDocument();
      expect(screen.getByText('Completed todo')).toBeInTheDocument();
    });

    it('shows all todos when All filter is selected after filtering', async () => {
      const user = userEvent.setup();

      // Filter to active
      await user.click(screen.getByRole('button', { name: /^active$/i }));
      // Back to all
      await user.click(screen.getByRole('button', { name: /all/i }));

      expect(screen.getByText('Active todo')).toBeInTheDocument();
      expect(screen.getByText('Completed todo')).toBeInTheDocument();
    });
  });

  describe('persistence', () => {
    it('loads todos from localStorage on mount', () => {
      const savedTodos = [
        { id: '1', text: 'Saved todo', completed: false },
        { id: '2', text: 'Another saved', completed: true },
      ];
      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(savedTodos)
      );

      render(<App />);

      expect(screen.getByText('Saved todo')).toBeInTheDocument();
      expect(screen.getByText('Another saved')).toBeInTheDocument();
    });

    it('persists completed state to localStorage', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByRole('textbox', { name: /add todo/i });
      await user.type(input, 'Test todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      await user.click(screen.getByRole('checkbox'));

      // Check that setItem was called with completed: true
      const lastCall = (localStorage.setItem as jest.Mock).mock.calls.pop();
      const savedData = JSON.parse(lastCall[1]);
      expect(savedData[0].completed).toBe(true);
    });
  });

  describe('todo count', () => {
    it('displays the count of active todos', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByRole('textbox', { name: /add todo/i });

      await user.type(input, 'Todo 1');
      await user.click(screen.getByRole('button', { name: /add/i }));

      await user.type(input, 'Todo 2');
      await user.click(screen.getByRole('button', { name: /add/i }));

      expect(screen.getByText(/2 items left/i)).toBeInTheDocument();
    });

    it('updates count when todo is completed', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByRole('textbox', { name: /add todo/i });

      await user.type(input, 'Todo 1');
      await user.click(screen.getByRole('button', { name: /add/i }));

      await user.type(input, 'Todo 2');
      await user.click(screen.getByRole('button', { name: /add/i }));

      // Complete one todo
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);

      expect(screen.getByText(/1 item left/i)).toBeInTheDocument();
    });

    it('shows "1 item" singular form', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByRole('textbox', { name: /add todo/i });
      await user.type(input, 'Single todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      expect(screen.getByText(/1 item left/i)).toBeInTheDocument();
    });
  });
});

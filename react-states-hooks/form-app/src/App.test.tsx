import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the app with header', () => {
    render(<App />);

    expect(screen.getByText('Contact Manager')).toBeInTheDocument();
    expect(screen.getByText('React State & Hooks Demo')).toBeInTheDocument();
  });

  it('renders contact form and contact list', () => {
    render(<App />);

    expect(screen.getByText('Add New Contact')).toBeInTheDocument();
    expect(screen.getByText(/contacts \(0\)/i)).toBeInTheDocument();
  });

  it('does not show clear all button when no contacts', () => {
    render(<App />);

    expect(screen.queryByText(/clear all contacts/i)).not.toBeInTheDocument();
  });

  it('adds a contact and displays it in the list', async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');

    fireEvent.click(screen.getByRole('button', { name: /add contact/i }));

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
    });
  });

  it('shows clear all button when contacts exist', async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');

    fireEvent.click(screen.getByRole('button', { name: /add contact/i }));

    await waitFor(() => {
      expect(screen.getByText(/clear all contacts/i)).toBeInTheDocument();
    });
  });

  it('deletes a contact from the list', async () => {
    render(<App />);

    // Add a contact first
    await userEvent.type(screen.getByLabelText(/name/i), 'Delete Me');
    await userEvent.type(screen.getByLabelText(/email/i), 'delete@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '1111111111');

    fireEvent.click(screen.getByRole('button', { name: /add contact/i }));

    await waitFor(() => {
      expect(screen.getByText('Delete Me')).toBeInTheDocument();
    });

    // Delete the contact
    fireEvent.click(screen.getByRole('button', { name: /delete delete me/i }));

    await waitFor(() => {
      expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
    });
  });

  it('persists contacts to localStorage', async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Stored User');
    await userEvent.type(screen.getByLabelText(/email/i), 'stored@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '2222222222');

    fireEvent.click(screen.getByRole('button', { name: /add contact/i }));

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('contacts') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe('Stored User');
    });
  });

  it('loads contacts from localStorage on mount', () => {
    const existingContacts = [
      { id: '123', name: 'Existing User', email: 'existing@example.com', phone: '3333333333' }
    ];
    localStorage.setItem('contacts', JSON.stringify(existingContacts));

    render(<App />);

    expect(screen.getByText('Existing User')).toBeInTheDocument();
    expect(screen.getByText('existing@example.com')).toBeInTheDocument();
  });

  it('updates document title based on contact count', async () => {
    render(<App />);

    expect(document.title).toBe('Contact Manager');

    await userEvent.type(screen.getByLabelText(/name/i), 'Title Test');
    await userEvent.type(screen.getByLabelText(/email/i), 'title@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '4444444444');

    fireEvent.click(screen.getByRole('button', { name: /add contact/i }));

    await waitFor(() => {
      expect(document.title).toBe('(1) Contact Manager');
    });
  });
});

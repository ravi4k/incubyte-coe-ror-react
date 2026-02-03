import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactList } from './ContactList';
import { Contact } from '../ContactForm';

describe('ContactList', () => {
  const mockContacts: Contact[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', phone: '5555555555' }
  ];

  const mockOnDeleteContact = jest.fn();

  beforeEach(() => {
    mockOnDeleteContact.mockClear();
  });

  it('renders empty state when no contacts', () => {
    render(<ContactList contacts={[]} onDeleteContact={mockOnDeleteContact} />);

    expect(screen.getByText(/no contacts yet/i)).toBeInTheDocument();
  });

  it('renders all contacts with correct information', () => {
    render(<ContactList contacts={mockContacts} onDeleteContact={mockOnDeleteContact} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
  });

  it('displays correct contact count', () => {
    render(<ContactList contacts={mockContacts} onDeleteContact={mockOnDeleteContact} />);

    expect(screen.getByText(/contacts \(3\)/i)).toBeInTheDocument();
  });

  it('calls onDeleteContact when delete button is clicked', () => {
    render(<ContactList contacts={mockContacts} onDeleteContact={mockOnDeleteContact} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDeleteContact).toHaveBeenCalledWith('1');
  });

  it('filters contacts based on search term - by name', async () => {
    render(<ContactList contacts={mockContacts} onDeleteContact={mockOnDeleteContact} />);

    const searchInput = screen.getByPlaceholderText(/search contacts/i);
    await userEvent.type(searchInput, 'Jane');

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
  });

  it('filters contacts based on search term - by email', async () => {
    render(<ContactList contacts={mockContacts} onDeleteContact={mockOnDeleteContact} />);

    const searchInput = screen.getByPlaceholderText(/search contacts/i);
    await userEvent.type(searchInput, 'bob@');

    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('filters contacts based on search term - by phone', async () => {
    render(<ContactList contacts={mockContacts} onDeleteContact={mockOnDeleteContact} />);

    const searchInput = screen.getByPlaceholderText(/search contacts/i);
    await userEvent.type(searchInput, '5555');

    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('shows empty state when search has no results', async () => {
    render(<ContactList contacts={mockContacts} onDeleteContact={mockOnDeleteContact} />);

    const searchInput = screen.getByPlaceholderText(/search contacts/i);
    await userEvent.type(searchInput, 'nonexistent');

    expect(screen.getByText(/no contacts match your search/i)).toBeInTheDocument();
  });

  it('shows filter count when searching', async () => {
    render(<ContactList contacts={mockContacts} onDeleteContact={mockOnDeleteContact} />);

    const searchInput = screen.getByPlaceholderText(/search contacts/i);
    await userEvent.type(searchInput, 'john');

    expect(screen.getByText(/showing 1 of 3 contacts/i)).toBeInTheDocument();
  });

  it('clears filter when search is cleared', async () => {
    render(<ContactList contacts={mockContacts} onDeleteContact={mockOnDeleteContact} />);

    const searchInput = screen.getByPlaceholderText(/search contacts/i);
    await userEvent.type(searchInput, 'Jane');
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    
    await userEvent.clear(searchInput);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
  });
});

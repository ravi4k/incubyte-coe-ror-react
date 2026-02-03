import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  const mockOnAddContact = jest.fn();

  beforeEach(() => {
    mockOnAddContact.mockClear();
  });

  it('renders all form fields', () => {
    render(<ContactForm onAddContact={mockOnAddContact} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add contact/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<ContactForm onAddContact={mockOnAddContact} />);

    fireEvent.click(screen.getByRole('button', { name: /add contact/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
    });

    expect(mockOnAddContact).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email', async () => {
    render(<ContactForm onAddContact={mockOnAddContact} />);

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short name', async () => {
    render(<ContactForm onAddContact={mockOnAddContact} />);

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, 'A');
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid phone', async () => {
    render(<ContactForm onAddContact={mockOnAddContact} />);

    const phoneInput = screen.getByLabelText(/phone/i);
    await userEvent.type(phoneInput, '123');
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.getByText(/phone must be 10 digits/i)).toBeInTheDocument();
    });
  });

  it('successfully submits form with valid data', async () => {
    render(<ContactForm onAddContact={mockOnAddContact} />);

    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');

    fireEvent.click(screen.getByRole('button', { name: /add contact/i }));

    await waitFor(() => {
      expect(mockOnAddContact).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890'
        })
      );
    });
  });

  it('shows success message after submission', async () => {
    render(<ContactForm onAddContact={mockOnAddContact} />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '9876543210');

    fireEvent.click(screen.getByRole('button', { name: /add contact/i }));

    await waitFor(() => {
      expect(screen.getByText(/contact added successfully/i)).toBeInTheDocument();
    });
  });

  it('clears form after successful submission', async () => {
    render(<ContactForm onAddContact={mockOnAddContact} />);

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/phone/i) as HTMLInputElement;

    await userEvent.type(nameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(phoneInput, '5555555555');

    fireEvent.click(screen.getByRole('button', { name: /add contact/i }));

    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(phoneInput.value).toBe('');
    });
  });
});

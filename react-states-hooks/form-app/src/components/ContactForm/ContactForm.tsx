import { useState, useEffect } from 'react';
import './ContactForm.css';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface ContactFormProps {
  onAddContact: (contact: Contact) => void;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: ''
};

export function ContactForm({ onAddContact }: ContactFormProps) {
  // useState for form data - demonstrates object state management
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  // useState for validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // useState for tracking if form has been touched
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // useState for submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // useEffect for real-time validation when form data changes
  // This demonstrates proper use of dependencies
  useEffect(() => {
    const newErrors: FormErrors = {};

    // Name validation
    if (touched.name) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    // Email validation
    if (touched.email) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (touched.phone) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Phone must be 10 digits';
      }
    }

    setErrors(newErrors);
  }, [formData, touched]);

  // useEffect to clear success message after 3 seconds
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

      // Cleanup function - important for avoiding memory leaks
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  // Event handler for input changes - demonstrates controlled components
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Event handler for blur - marks field as touched
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // Validate all fields before submission
  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true });

    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler - demonstrates preventDefault
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newContact: Contact = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim()
    };

    onAddContact(newContact);
    
    // Reset form
    setFormData(initialFormData);
    setTouched({});
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  // Helper to determine if field has error
  const hasError = (field: keyof FormErrors): boolean => {
    return touched[field] === true && errors[field] !== undefined;
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <h2>Add New Contact</h2>

      {/* Success message - conditional rendering */}
      {submitSuccess && (
        <div className="success-message">
          Contact added successfully!
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={hasError('name') ? 'error' : ''}
          placeholder="Enter full name"
          disabled={isSubmitting}
        />
        {/* Conditional rendering of error message */}
        {hasError('name') && (
          <span className="error-message">{errors.name}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={hasError('email') ? 'error' : ''}
          placeholder="Enter email address"
          disabled={isSubmitting}
        />
        {hasError('email') && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={hasError('phone') ? 'error' : ''}
          placeholder="Enter 10-digit phone"
          disabled={isSubmitting}
        />
        {hasError('phone') && (
          <span className="error-message">{errors.phone}</span>
        )}
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Contact'}
      </button>
    </form>
  );
}

import { useReducer } from 'react';
import { Box, Input, Textarea, Text, Flex } from '@chakra-ui/react';
import { Button } from '../Button';
import { useTheme } from '../../context';

// Form state types
interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface FormState {
  values: FormValues;
  errors: FormErrors;
  touched: Record<keyof FormValues, boolean>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
}

// Action types
type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormValues; value: string }
  | { type: 'SET_TOUCHED'; field: keyof FormValues }
  | { type: 'SET_ERROR'; field: keyof FormValues; error: string }
  | { type: 'CLEAR_ERROR'; field: keyof FormValues }
  | { type: 'VALIDATE_ALL' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_FAILURE'; error: string }
  | { type: 'RESET' };

// Initial state
const initialState: FormState = {
  values: {
    name: '',
    email: '',
    subject: '',
    message: '',
  },
  errors: {},
  touched: {
    name: false,
    email: false,
    subject: false,
    message: false,
  },
  isSubmitting: false,
  isSubmitted: false,
  submitError: null,
};

// Validation helpers
function validateEmail(email: string): string | undefined {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return undefined;
}

function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value.trim()) return `${fieldName} is required`;
  return undefined;
}

function validateMinLength(value: string, min: number, fieldName: string): string | undefined {
  if (value.trim().length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return undefined;
}

// Validate all fields
function validateForm(values: FormValues): FormErrors {
  return {
    name: validateRequired(values.name, 'Name'),
    email: validateEmail(values.email),
    subject: validateRequired(values.subject, 'Subject'),
    message: validateRequired(values.message, 'Message') || 
             validateMinLength(values.message, 10, 'Message'),
  };
}

// Reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        // Clear error when user starts typing
        errors: { ...state.errors, [action.field]: undefined },
      };

    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: undefined },
      };

    case 'VALIDATE_ALL': {
      const errors = validateForm(state.values);
      return {
        ...state,
        errors,
        touched: { name: true, email: true, subject: true, message: true },
      };
    }

    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        submitError: null,
      };

    case 'SUBMIT_SUCCESS':
      return {
        ...initialState,
        isSubmitted: true,
      };

    case 'SUBMIT_FAILURE':
      return {
        ...state,
        isSubmitting: false,
        submitError: action.error,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// Props
interface ContactFormProps {
  onSubmit?: (values: FormValues) => Promise<void>;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { state: themeState } = useTheme();
  const isDark = themeState.colorMode === 'dark';

  const handleChange = (field: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({ type: 'SET_FIELD', field, value: e.target.value });
  };

  const handleBlur = (field: keyof FormValues) => () => {
    dispatch({ type: 'SET_TOUCHED', field });
    
    // Validate on blur
    const value = state.values[field];
    let error: string | undefined;
    
    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'message':
        error = validateRequired(value, 'Message') || validateMinLength(value, 10, 'Message');
        break;
      default:
        error = validateRequired(value, field.charAt(0).toUpperCase() + field.slice(1));
    }
    
    if (error) {
      dispatch({ type: 'SET_ERROR', field, error });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    dispatch({ type: 'VALIDATE_ALL' });
    const errors = validateForm(state.values);
    const hasErrors = Object.values(errors).some(error => error !== undefined);
    
    if (hasErrors) return;

    dispatch({ type: 'SUBMIT_START' });

    try {
      if (onSubmit) {
        await onSubmit(state.values);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch (error) {
      dispatch({ 
        type: 'SUBMIT_FAILURE', 
        error: error instanceof Error ? error.message : 'Submission failed' 
      });
    }
  };

  const inputStyles = {
    bg: isDark ? 'gray.700' : 'white',
    borderColor: isDark ? 'gray.600' : 'gray.300',
    color: isDark ? 'white' : 'gray.800',
    _hover: { borderColor: isDark ? 'gray.500' : 'gray.400' },
    _focus: { 
      borderColor: `${themeState.primaryColor}.500`,
      boxShadow: `0 0 0 1px var(--chakra-colors-${themeState.primaryColor}-500)`,
    },
  };

  const labelStyles = {
    color: isDark ? 'gray.200' : 'gray.700',
    fontWeight: 'medium',
    mb: 1,
  };

  if (state.isSubmitted) {
    return (
      <Box 
        p={6} 
        bg={isDark ? 'green.800' : 'green.50'} 
        borderRadius="md"
        textAlign="center"
      >
        <Text 
          fontSize="lg" 
          fontWeight="bold" 
          color={isDark ? 'green.200' : 'green.700'}
          mb={2}
        >
          Thank you!
        </Text>
        <Text color={isDark ? 'green.300' : 'green.600'} mb={4}>
          Your message has been sent successfully.
        </Text>
        <Button 
          variant="secondary" 
          onClick={() => dispatch({ type: 'RESET' })}
        >
          Send another message
        </Button>
      </Box>
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Flex direction="column" gap={4}>
        {/* Name Field */}
        <Box>
          <Text as="label" htmlFor="name" {...labelStyles}>
            Name
          </Text>
          <Input
            id="name"
            type="text"
            value={state.values.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            placeholder="Your name"
            aria-invalid={!!state.errors.name}
            aria-describedby={state.errors.name ? 'name-error' : undefined}
            {...inputStyles}
            borderColor={state.errors.name && state.touched.name ? 'red.500' : inputStyles.borderColor}
          />
          {state.errors.name && state.touched.name && (
            <Text id="name-error" color="red.500" fontSize="sm" mt={1}>
              {state.errors.name}
            </Text>
          )}
        </Box>

        {/* Email Field */}
        <Box>
          <Text as="label" htmlFor="email" {...labelStyles}>
            Email
          </Text>
          <Input
            id="email"
            type="email"
            value={state.values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="your@email.com"
            aria-invalid={!!state.errors.email}
            aria-describedby={state.errors.email ? 'email-error' : undefined}
            {...inputStyles}
            borderColor={state.errors.email && state.touched.email ? 'red.500' : inputStyles.borderColor}
          />
          {state.errors.email && state.touched.email && (
            <Text id="email-error" color="red.500" fontSize="sm" mt={1}>
              {state.errors.email}
            </Text>
          )}
        </Box>

        {/* Subject Field */}
        <Box>
          <Text as="label" htmlFor="subject" {...labelStyles}>
            Subject
          </Text>
          <Input
            id="subject"
            type="text"
            value={state.values.subject}
            onChange={handleChange('subject')}
            onBlur={handleBlur('subject')}
            placeholder="What is this about?"
            aria-invalid={!!state.errors.subject}
            aria-describedby={state.errors.subject ? 'subject-error' : undefined}
            {...inputStyles}
            borderColor={state.errors.subject && state.touched.subject ? 'red.500' : inputStyles.borderColor}
          />
          {state.errors.subject && state.touched.subject && (
            <Text id="subject-error" color="red.500" fontSize="sm" mt={1}>
              {state.errors.subject}
            </Text>
          )}
        </Box>

        {/* Message Field */}
        <Box>
          <Text as="label" htmlFor="message" {...labelStyles}>
            Message
          </Text>
          <Textarea
            id="message"
            value={state.values.message}
            onChange={handleChange('message')}
            onBlur={handleBlur('message')}
            placeholder="Your message (at least 10 characters)"
            rows={4}
            aria-invalid={!!state.errors.message}
            aria-describedby={state.errors.message ? 'message-error' : undefined}
            {...inputStyles}
            borderColor={state.errors.message && state.touched.message ? 'red.500' : inputStyles.borderColor}
          />
          {state.errors.message && state.touched.message && (
            <Text id="message-error" color="red.500" fontSize="sm" mt={1}>
              {state.errors.message}
            </Text>
          )}
        </Box>

        {/* Submit Error */}
        {state.submitError && (
          <Box 
            p={3} 
            bg={isDark ? 'red.800' : 'red.50'} 
            borderRadius="md"
            role="alert"
          >
            <Text color={isDark ? 'red.200' : 'red.600'}>
              {state.submitError}
            </Text>
          </Box>
        )}

        {/* Submit Button */}
        <Flex justify="flex-end" gap={2} mt={2}>
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => dispatch({ type: 'RESET' })}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            isLoading={state.isSubmitting}
          >
            Send Message
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export type { FormValues, FormState, ContactFormProps };

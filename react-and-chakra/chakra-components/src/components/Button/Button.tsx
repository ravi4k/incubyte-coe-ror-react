import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useTheme } from '../../context';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ChakraButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Map our variants to Chakra styles
function getVariantStyles(variant: ButtonVariant, primaryColor: string, colorMode: string) {
  const isDark = colorMode === 'dark';
  
  const variants = {
    primary: {
      bg: `${primaryColor}.500`,
      color: 'white',
      _hover: { bg: `${primaryColor}.600` },
      _active: { bg: `${primaryColor}.700` },
    },
    secondary: {
      bg: isDark ? 'gray.700' : 'gray.100',
      color: isDark ? 'gray.100' : 'gray.800',
      _hover: { bg: isDark ? 'gray.600' : 'gray.200' },
      _active: { bg: isDark ? 'gray.500' : 'gray.300' },
    },
    danger: {
      bg: 'red.500',
      color: 'white',
      _hover: { bg: 'red.600' },
      _active: { bg: 'red.700' },
    },
    ghost: {
      bg: 'transparent',
      color: isDark ? 'gray.100' : 'gray.800',
      _hover: { bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' },
      _active: { bg: isDark ? 'whiteAlpha.300' : 'blackAlpha.200' },
    },
  };

  return variants[variant];
}

// Map sizes
const sizeMap = {
  sm: { px: 3, py: 1, fontSize: 'sm' },
  md: { px: 4, py: 2, fontSize: 'md' },
  lg: { px: 6, py: 3, fontSize: 'lg' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  const { state } = useTheme();
  const variantStyles = getVariantStyles(variant, state.primaryColor, state.colorMode);
  const sizeStyles = sizeMap[size];

  return (
    <ChakraButton
      {...variantStyles}
      {...sizeStyles}
      borderRadius="md"
      fontWeight="semibold"
      transition="all 0.2s"
      disabled={disabled || isLoading}
      opacity={disabled ? 0.6 : 1}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      display="inline-flex"
      alignItems="center"
      gap={2}
      {...props}
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </ChakraButton>
  );
}

export type { ButtonProps, ButtonVariant, ButtonSize };

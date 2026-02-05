import { Box, Flex } from '@chakra-ui/react';
import { ReactNode, createContext, useContext } from 'react';
import { useTheme } from '../../context';

// Context for card variant info
interface CardContextType {
  colorMode: string;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

function useCardContext() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('Card compound components must be used within a Card');
  }
  return context;
}

// Card Props
interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

interface CardSectionProps {
  children: ReactNode;
}

// Size mappings
const sizeMap = {
  sm: { p: 3 },
  md: { p: 4 },
  lg: { p: 6 },
};

// Main Card component
export function Card({ children, variant = 'elevated', size = 'md' }: CardProps) {
  const { state } = useTheme();
  const isDark = state.colorMode === 'dark';

  const variantStyles = {
    elevated: {
      bg: isDark ? 'gray.800' : 'white',
      boxShadow: 'md',
      border: 'none',
    },
    outlined: {
      bg: isDark ? 'gray.900' : 'white',
      boxShadow: 'none',
      border: '1px solid',
      borderColor: isDark ? 'gray.600' : 'gray.200',
    },
    filled: {
      bg: isDark ? 'gray.700' : 'gray.50',
      boxShadow: 'none',
      border: 'none',
    },
  };

  return (
    <CardContext.Provider value={{ colorMode: state.colorMode }}>
      <Box
        {...variantStyles[variant]}
        {...sizeMap[size]}
        borderRadius="lg"
        overflow="hidden"
        transition="all 0.2s"
        _hover={{
          boxShadow: variant === 'elevated' ? 'lg' : undefined,
        }}
      >
        {children}
      </Box>
    </CardContext.Provider>
  );
}

// Card Header
function CardHeader({ children }: CardSectionProps) {
  const { colorMode } = useCardContext();
  const isDark = colorMode === 'dark';

  return (
    <Box
      pb={3}
      mb={3}
      borderBottom="1px solid"
      borderColor={isDark ? 'gray.600' : 'gray.200'}
    >
      {children}
    </Box>
  );
}

// Card Body
function CardBody({ children }: CardSectionProps) {
  return <Box py={2}>{children}</Box>;
}

// Card Footer
function CardFooter({ children }: CardSectionProps) {
  const { colorMode } = useCardContext();
  const isDark = colorMode === 'dark';

  return (
    <Flex
      pt={3}
      mt={3}
      borderTop="1px solid"
      borderColor={isDark ? 'gray.600' : 'gray.200'}
      gap={2}
      justifyContent="flex-end"
    >
      {children}
    </Flex>
  );
}

// Card Image
interface CardImageProps {
  src: string;
  alt: string;
}

function CardImage({ src, alt }: CardImageProps) {
  return (
    <Box mx={-4} mt={-4} mb={4}>
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </Box>
  );
}

// Attach compound components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

export type { CardProps, CardSectionProps, CardImageProps };

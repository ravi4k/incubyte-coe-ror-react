import { Box, Container, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { useTheme } from './context';
import { Button, Card, ContactForm } from './components';
import { ThemeSettings } from './components/ThemeSettings';

function App() {
  const { state } = useTheme();
  const isDark = state.colorMode === 'dark';

  // Font size mapping
  const fontSizeMap = {
    sm: { heading: 'xl', body: 'sm' },
    md: { heading: '2xl', body: 'md' },
    lg: { heading: '3xl', body: 'lg' },
  };

  const fontSize = fontSizeMap[state.fontSize];

  return (
    <Box
      minH="100vh"
      bg={isDark ? 'gray.900' : 'gray.50'}
      color={isDark ? 'gray.100' : 'gray.900'}
      transition="background-color 0.2s"
    >
      {/* Header */}
      <Box
        as="header"
        bg={isDark ? 'gray.800' : 'white'}
        borderBottom="1px solid"
        borderColor={isDark ? 'gray.700' : 'gray.200'}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="container.xl" py={4}>
          <Flex 
            justify="space-between" 
            align="center"
            direction={{ base: 'column', md: 'row' }}
            gap={4}
          >
            <Heading 
              as="h1" 
              fontSize={{ base: 'xl', md: '2xl' }}
              color={`${state.primaryColor}.500`}
            >
              Chakra Component Library
            </Heading>
            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
              useReducer + Context + Chakra UI Demo
            </Text>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 300px' }}
          gap={8}
        >
          {/* Main Section */}
          <Flex direction="column" gap={8}>
            {/* Button Showcase */}
            <Card>
              <Card.Header>
                <Heading as="h2" fontSize={fontSize.heading}>
                  Button Variants
                </Heading>
              </Card.Header>
              <Card.Body>
                <Text fontSize={fontSize.body} mb={4} color={isDark ? 'gray.300' : 'gray.600'}>
                  Reusable button component with multiple variants and sizes, 
                  integrated with theme context.
                </Text>
                
                {/* Button Variants */}
                <Box mb={6}>
                  <Text fontWeight="semibold" mb={2} fontSize={fontSize.body}>
                    Variants
                  </Text>
                  <Flex gap={2} wrap="wrap">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="ghost">Ghost</Button>
                  </Flex>
                </Box>

                {/* Button Sizes */}
                <Box mb={6}>
                  <Text fontWeight="semibold" mb={2} fontSize={fontSize.body}>
                    Sizes
                  </Text>
                  <Flex gap={2} wrap="wrap" align="center">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </Flex>
                </Box>

                {/* Button States */}
                <Box>
                  <Text fontWeight="semibold" mb={2} fontSize={fontSize.body}>
                    States
                  </Text>
                  <Flex gap={2} wrap="wrap">
                    <Button isLoading>Loading</Button>
                    <Button disabled>Disabled</Button>
                  </Flex>
                </Box>
              </Card.Body>
            </Card>

            {/* Card Showcase */}
            <Box>
              <Heading as="h2" fontSize={fontSize.heading} mb={4}>
                Card Variants
              </Heading>
              <Text fontSize={fontSize.body} mb={4} color={isDark ? 'gray.300' : 'gray.600'}>
                Compound component pattern with Card.Header, Card.Body, and Card.Footer.
              </Text>
              
              <Grid 
                templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                gap={4}
              >
                <Card variant="elevated">
                  <Card.Header>
                    <Text fontWeight="bold">Elevated Card</Text>
                  </Card.Header>
                  <Card.Body>
                    <Text fontSize={fontSize.body}>
                      Uses box shadow for depth. Default style for most use cases.
                    </Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button size="sm" variant="ghost">Learn More</Button>
                  </Card.Footer>
                </Card>

                <Card variant="outlined">
                  <Card.Header>
                    <Text fontWeight="bold">Outlined Card</Text>
                  </Card.Header>
                  <Card.Body>
                    <Text fontSize={fontSize.body}>
                      Subtle border instead of shadow. Good for dense layouts.
                    </Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button size="sm" variant="ghost">Learn More</Button>
                  </Card.Footer>
                </Card>

                <Card variant="filled">
                  <Card.Header>
                    <Text fontWeight="bold">Filled Card</Text>
                  </Card.Header>
                  <Card.Body>
                    <Text fontSize={fontSize.body}>
                      Background fill for emphasis. Works well in sections.
                    </Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button size="sm" variant="ghost">Learn More</Button>
                  </Card.Footer>
                </Card>
              </Grid>
            </Box>

            {/* Contact Form */}
            <Card>
              <Card.Header>
                <Heading as="h2" fontSize={fontSize.heading}>
                  Contact Form
                </Heading>
              </Card.Header>
              <Card.Body>
                <Text fontSize={fontSize.body} mb={4} color={isDark ? 'gray.300' : 'gray.600'}>
                  Complex form state managed with useReducer. Includes field validation, 
                  error handling, loading states, and form reset.
                </Text>
                <ContactForm />
              </Card.Body>
            </Card>

            {/* Responsive Demo */}
            <Card>
              <Card.Header>
                <Heading as="h2" fontSize={fontSize.heading}>
                  Responsive Layout Demo
                </Heading>
              </Card.Header>
              <Card.Body>
                <Text fontSize={fontSize.body} mb={4} color={isDark ? 'gray.300' : 'gray.600'}>
                  Resize the window to see responsive behavior. Layout changes at different breakpoints.
                </Text>
                <Grid
                  templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
                  gap={4}
                >
                  {['One', 'Two', 'Three', 'Four'].map((item, index) => (
                    <Box
                      key={item}
                      p={4}
                      bg={`${state.primaryColor}.${(index + 1) * 100}`}
                      color={index > 2 ? 'white' : 'gray.800'}
                      borderRadius="md"
                      textAlign="center"
                      fontWeight="bold"
                    >
                      {item}
                    </Box>
                  ))}
                </Grid>
                <Box mt={4} p={4} bg={isDark ? 'gray.700' : 'gray.100'} borderRadius="md">
                  <Text fontSize="sm">
                    <strong>Breakpoints:</strong> base (0px), sm (480px), md (768px), lg (992px), xl (1280px)
                  </Text>
                </Box>
              </Card.Body>
            </Card>
          </Flex>

          {/* Sidebar - Theme Settings */}
          <Box
            position={{ base: 'static', lg: 'sticky' }}
            top="100px"
            alignSelf="start"
          >
            <Card>
              <Card.Header>
                <Heading as="h3" fontSize="lg">
                  Theme Settings
                </Heading>
              </Card.Header>
              <Card.Body>
                <Text fontSize="sm" mb={4} color={isDark ? 'gray.400' : 'gray.600'}>
                  Uses Context API with useReducer to manage theme state across all components.
                </Text>
                <ThemeSettings />
              </Card.Body>
            </Card>
          </Box>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        as="footer"
        bg={isDark ? 'gray.800' : 'white'}
        borderTop="1px solid"
        borderColor={isDark ? 'gray.700' : 'gray.200'}
        mt={8}
      >
        <Container maxW="container.xl" py={6}>
          <Flex 
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
              Advanced React & Chakra UI Learning Exercise
            </Text>
            <Flex gap={4}>
              <Text 
                as="a" 
                href="https://react.dev/reference/react/useReducer"
                fontSize="sm"
                color={`${state.primaryColor}.500`}
                _hover={{ textDecoration: 'underline' }}
              >
                useReducer Docs
              </Text>
              <Text 
                as="a" 
                href="https://react.dev/reference/react/useContext"
                fontSize="sm"
                color={`${state.primaryColor}.500`}
                _hover={{ textDecoration: 'underline' }}
              >
                Context Docs
              </Text>
              <Text 
                as="a" 
                href="https://chakra-ui.com"
                fontSize="sm"
                color={`${state.primaryColor}.500`}
                _hover={{ textDecoration: 'underline' }}
              >
                Chakra UI
              </Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default App;

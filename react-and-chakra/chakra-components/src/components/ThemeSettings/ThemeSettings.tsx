import { Box, Flex, Text, Grid } from '@chakra-ui/react';
import { useTheme } from '../../context';
import { Button } from '../Button';

const colorOptions = ['teal', 'blue', 'purple', 'pink', 'orange', 'green'];
const fontSizeOptions: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

export function ThemeSettings() {
  const { state, toggleColorMode, setPrimaryColor, setFontSize, resetTheme } = useTheme();
  const isDark = state.colorMode === 'dark';

  return (
    <Box>
      {/* Color Mode Toggle */}
      <Box mb={6}>
        <Text 
          fontWeight="semibold" 
          mb={2}
          color={isDark ? 'gray.200' : 'gray.700'}
        >
          Color Mode
        </Text>
        <Flex gap={2}>
          <Button
            variant={state.colorMode === 'light' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => state.colorMode === 'dark' && toggleColorMode()}
          >
            Light
          </Button>
          <Button
            variant={state.colorMode === 'dark' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => state.colorMode === 'light' && toggleColorMode()}
          >
            Dark
          </Button>
        </Flex>
      </Box>

      {/* Primary Color Selection */}
      <Box mb={6}>
        <Text 
          fontWeight="semibold" 
          mb={2}
          color={isDark ? 'gray.200' : 'gray.700'}
        >
          Primary Color
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
          {colorOptions.map(color => (
            <Box
              key={color}
              as="button"
              p={2}
              borderRadius="md"
              bg={`${color}.500`}
              color="white"
              fontWeight="medium"
              fontSize="sm"
              textTransform="capitalize"
              border={state.primaryColor === color ? '3px solid white' : 'none'}
              boxShadow={state.primaryColor === color ? 'lg' : 'md'}
              transition="all 0.2s"
              _hover={{ transform: 'scale(1.05)' }}
              onClick={() => setPrimaryColor(color)}
              aria-pressed={state.primaryColor === color}
            >
              {color}
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Font Size Selection */}
      <Box mb={6}>
        <Text 
          fontWeight="semibold" 
          mb={2}
          color={isDark ? 'gray.200' : 'gray.700'}
        >
          Font Size
        </Text>
        <Flex gap={2}>
          {fontSizeOptions.map(size => (
            <Button
              key={size}
              variant={state.fontSize === size ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFontSize(size)}
            >
              {size.toUpperCase()}
            </Button>
          ))}
        </Flex>
      </Box>

      {/* Reset Button */}
      <Button variant="ghost" size="sm" onClick={resetTheme}>
        Reset to defaults
      </Button>
    </Box>
  );
}

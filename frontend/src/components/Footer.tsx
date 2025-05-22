import { Box, Container, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      as="footer"
      bg={bgColor}
      color={textColor}
      py={8}
      mt="auto"
      borderTop="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container maxW="container.xl">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify="space-between"
          align="center"
        >
          <Text>© {new Date().getFullYear()} Medicine Recommendation System. All rights reserved.</Text>
          <Stack direction="row" spacing={6}>
            <Link href="#" color={textColor}>
              Privacy Policy
            </Link>
            <Link href="#" color={textColor}>
              Terms of Service
            </Link>
            <Link href="#" color={textColor}>
              Contact Us
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
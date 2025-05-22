import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Text,
  HStack,
  Container,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      style={{ textDecoration: 'none' }}
    >
      <Text
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.200', 'gray.700'),
        }}
      >
        {children}
      </Text>
    </Link>
  );

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      px={4}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box
            cursor="pointer"
            onClick={() => navigate('/')}
            fontWeight="bold"
            fontSize="xl"
            color={useColorModeValue('blue.600', 'blue.200')}
          >
            MedAI
          </Box>

          <HStack spacing={8} alignItems={'center'}>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about">About</NavLink>
              {user && (
                <>
                  <NavLink to="/predict">Predict</NavLink>
                  <NavLink to="/profile">Profile</NavLink>
                </>
              )}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7} alignItems="center">
              <Button
                onClick={toggleColorMode}
                size="sm"
                variant="ghost"
                aria-label="Toggle color mode"
              >
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              {user ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                  >
                    <Avatar size={'sm'} name={user.username} />
                  </MenuButton>
                  <MenuList alignItems={'center'}>
                    <br />
                    <Center>
                      <Avatar size={'2xl'} name={user.username} />
                    </Center>
                    <br />
                    <Center>
                      <Text>{user.username}</Text>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem onClick={() => navigate('/profile')}>Profile Settings</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Stack
                  direction={'row'}
                  spacing={4}
                >
                  <Button
                    fontSize={'sm'}
                    fontWeight={400}
                    variant={'link'}
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    fontSize={'sm'}
                    fontWeight={600}
                    color={'white'}
                    bg={'blue.400'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </Stack>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

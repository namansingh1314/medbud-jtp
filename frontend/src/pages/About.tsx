import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { FaBrain, FaHospital, FaUserMd, FaDatabase } from "react-icons/fa";

const StatBox = ({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => {
  return (
    <Stack
      color={useColorModeValue("gray.800", "white")}
      bg={useColorModeValue("white", "gray.800")}
      borderWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.600")}
      p={6}
      rounded="xl"
      shadow="lg"
      textAlign="center"
      height="100%"
      justify="center"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        shadow: "xl",
      }}
    >
      <Icon as={icon} w={12} h={12} color="blue.500" mx="auto" />
      <Text fontWeight="bold" fontSize="xl" mt={4}>
        {title}
      </Text>
      <Text color={useColorModeValue("gray.600", "gray.300")}>{description}</Text>
    </Stack>
  );
};

const About = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("blue.600", "blue.300");

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)">
      <Container maxW="container.xl" py={12}>
        <Stack spacing={16}>
          {/* Introduction Section */}
          <Flex direction="column" align="center" textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              color={headingColor}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              mb={6}
            >
              About Our System
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="3xl">
              The Medicine Recommendation System is an advanced healthcare
              solution that combines machine learning with medical knowledge to
              provide personalized health insights and recommendations.
            </Text>
          </Flex>

          {/* Stats Section */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            spacing={{ base: 6, lg: 8 }}
            px={{ base: 4, md: 8 }}
          >
            <StatBox
              icon={FaBrain}
              title="ML-Powered"
              description="Advanced SVM model for accurate disease prediction"
            />
            <StatBox
              icon={FaHospital}
              title="41 Diseases"
              description="Comprehensive coverage of common conditions"
            />
            <StatBox
              icon={FaUserMd}
              title="Personalized"
              description="Tailored health recommendations"
            />
            <StatBox
              icon={FaDatabase}
              title="Rich Dataset"
              description="Trained on 4,920+ medical cases"
            />
          </SimpleGrid>

          {/* Features Section */}
          <Stack spacing={8} px={{ base: 4, md: 8 }}>
            <Heading
              as="h2"
              size="xl"
              color={headingColor}
              textAlign={{ base: "center", md: "left" }}
            >
              Key Features
            </Heading>
            <List spacing={4}>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" w={6} h={6} />
                <Text color={textColor}>
                  Symptom-based disease prediction using Support Vector Machine
                  (SVM) classifier
                </Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" w={6} h={6} />
                <Text color={textColor}>
                  Personalized medicine recommendations based on predicted conditions
                </Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" w={6} h={6} />
                <Text color={textColor}>
                  Comprehensive health insights including diet and lifestyle recommendations
                </Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" w={6} h={6} />
                <Text color={textColor}>
                  User-friendly interface with secure authentication and data privacy
                </Text>
              </ListItem>
            </List>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default About;

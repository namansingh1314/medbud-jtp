import { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Text,
  Avatar,
  Button,
  Input,
  VStack,
  HStack,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Card,
  CardBody,
  Badge,
  List,
  ListItem,
  Divider,
  FormControl,
  FormLabel,
  useColorModeValue,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useAuth, type User } from "../contexts/AuthContext";
import { authApi, predictionApi, type PredictionHistory, type Profile } from "../services/api";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        await Promise.all([getProfile(), getPredictionHistory()]);
      } catch (error: any) {
        console.error('Profile loading error:', error);
        toast({
          title: "Error loading profile data",
          description: error.response?.data?.message || error.message || "Failed to load profile data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const getProfile = async () => {
    if (!user) return;
    try {
      const profileData = await authApi.getProfile();
      setProfile(profileData);
      setUsername(profileData.username || "");
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load profile');
    }
  };

  const getPredictionHistory = async () => {
    try {
      const data = await predictionApi.getPredictionHistory();
      setPredictions(data);
    } catch (error: any) {
      toast({
        title: "Error fetching predictions",
        description: error.message,
        status: "error",
      });
    }
  };

  const updateProfile = async () => {
    try {
      if (!user) throw new Error("No user found");

      const updatedUserData = await authApi.updateProfile({ username }) as Profile;
      const updatedUser: User = {
        ...user,
        ...updatedUserData,
        avatar_url: updatedUserData.avatar_url || undefined
      };
      await updateUser(updatedUser);
      setProfile(updatedUser);

      toast({
        title: "Profile updated successfully",
        status: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        status: "error",
      });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        throw new Error("File must be an image.");
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("Image size must be less than 5MB.");
      }

      const { avatar_url } = await authApi.uploadAvatar(file) as { avatar_url: string };
      if (!user) throw new Error("No user found");

      const updatedUser: User = {
        ...user,
        avatar_url: avatar_url || undefined
      };
      await updateUser(updatedUser);
      setProfile(updatedUser);

      toast({
        title: "Avatar uploaded successfully",
        status: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        status: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Box minH="calc(100vh - 80px)" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  return (
    <Container
      maxW="container.xl"
      py={8}
      minH="calc(100vh - 80px)"
      bg={useColorModeValue("gray.50", "gray.900")}
      px={[4, 6, 8]}
    >
      <Tabs variant="line">
        <TabList gap={2} pb={4}>
          <Tab>Profile</Tab>
          <Tab>Prediction History</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card
              bg={useColorModeValue("white", "gray.800")}
              shadow="xl"
              borderRadius="xl"
              mx="auto"
              w="full"
              maxW="4xl"
            >
              <CardBody p={[6, 8, 10]}>
                <Stack spacing={8} align="center" w="full">
                  <Avatar
                    size="2xl"
                    src={profile?.avatar_url || undefined}
                    name={profile?.username}
                    bg="blue.500"
                    color="white"
                  />
                  <VStack spacing={4} w="full" maxW="md">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={uploadAvatar}
                      disabled={uploading}
                      display="none"
                      id="avatar-upload"
                    />
                    <Button
                      as="label"
                      htmlFor="avatar-upload"
                      colorScheme="blue"
                      isLoading={uploading}
                      w="full"
                    >
                      {uploading ? "Uploading..." : "Upload Avatar"}
                    </Button>
                    <FormControl>
                      <FormLabel>Username</FormLabel>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                      />
                    </FormControl>
                    <Button
                      colorScheme="blue"
                      onClick={updateProfile}
                      isLoading={loading}
                      w="full"
                    >
                      Update Profile
                    </Button>
                  </VStack>
                </Stack>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Stack spacing={[4, 6]} w="full">
              {predictions.length === 0 ? (
                <Text textAlign="center" color="gray.500">
                  No predictions found
                </Text>
              ) : (
                predictions.map((prediction) => (
                  <Card
                    key={prediction.id}
                    bg={useColorModeValue("white", "gray.800")}
                    shadow="md"
                    w="full"
                  >
                    <CardBody p={4}>
                      <Stack spacing={3}>
                        <HStack justify="space-between" align="center">
                          <Badge
                            colorScheme="blue"
                            fontSize="sm"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {prediction.predicted_disease}
                          </Badge>
                          <Text color="gray.500" fontSize="xs">
                            {new Date(prediction.created_at).toLocaleDateString()}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" noOfLines={2}>
                          {prediction.description}
                        </Text>
                        <Divider />
                        <Stack
                          direction={["column", "row"]}
                          spacing={4}
                          justify="space-between"
                          wrap="wrap"
                        >
                          <VStack
                            align="start"
                            spacing={2}
                            flex="1"
                            minW={["full", "200px"]}
                          >
                            <Text fontSize="sm" fontWeight="bold" color="blue.600">
                              Medications
                            </Text>
                            <List spacing={1}>
                              {(expandedSections[`medications-${prediction.id}`]
                                ? prediction.medications
                                : prediction.medications.slice(0, 3)
                              ).map((med, index) => (
                                <ListItem key={index} fontSize="sm">
                                  • {med}
                                </ListItem>
                              ))}
                              {prediction.medications.length > 3 && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  color="gray.500"
                                  onClick={() =>
                                    setExpandedSections((prev) => ({
                                      ...prev,
                                      [`medications-${prediction.id}`]:
                                        !prev[`medications-${prediction.id}`],
                                    }))
                                  }
                                >
                                  {expandedSections[`medications-${prediction.id}`]
                                    ? "Show less"
                                    : `+${prediction.medications.length - 3} more`}
                                </Button>
                              )}
                            </List>
                          </VStack>
                          <VStack
                            align="start"
                            spacing={2}
                            flex="1"
                            minW={["full", "200px"]}
                          >
                            <Text fontSize="sm" fontWeight="bold" color="green.600">
                              Diet
                            </Text>
                            <List spacing={1}>
                              {(expandedSections[`diet-${prediction.id}`]
                                ? prediction.diet
                                : prediction.diet.slice(0, 2)
                              ).map((item, index) => (
                                <ListItem key={index} fontSize="sm">
                                  • {item}
                                </ListItem>
                              ))}
                              {prediction.diet.length > 2 && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  color="gray.500"
                                  onClick={() =>
                                    setExpandedSections((prev) => ({
                                      ...prev,
                                      [`diet-${prediction.id}`]:
                                        !prev[`diet-${prediction.id}`],
                                    }))
                                  }
                                >
                                  {expandedSections[`diet-${prediction.id}`]
                                    ? "Show less"
                                    : `+${prediction.diet.length - 2} more`}
                                </Button>
                              )}
                            </List>
                          </VStack>
                          <VStack
                            align="start"
                            spacing={2}
                            flex="1"
                            minW={["full", "200px"]}
                          >
                            <Text fontSize="sm" fontWeight="bold" color="purple.600">
                              Workout
                            </Text>
                            <List spacing={1}>
                              {(expandedSections[`workout-${prediction.id}`]
                                ? prediction.workout
                                : prediction.workout.slice(0, 2)
                              ).map((item, index) => (
                                <ListItem key={index} fontSize="sm">
                                  • {item}
                                </ListItem>
                              ))}
                              {prediction.workout.length > 2 && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  color="gray.500"
                                  onClick={() =>
                                    setExpandedSections((prev) => ({
                                      ...prev,
                                      [`workout-${prediction.id}`]:
                                        !prev[`workout-${prediction.id}`],
                                    }))
                                  }
                                >
                                  {expandedSections[`workout-${prediction.id}`]
                                    ? "Show less"
                                    : `+${prediction.workout.length - 2} more`}
                                </Button>
                              )}
                            </List>
                          </VStack>
                          <VStack
                            align="start"
                            spacing={2}
                            flex="1"
                            minW={["full", "200px"]}
                          >
                            <Text fontSize="sm" fontWeight="bold" color="orange.600">
                              Precautions
                            </Text>
                            <List spacing={1}>
                              {(expandedSections[`precautions-${prediction.id}`]
                                ? prediction.precautions
                                : prediction.precautions.slice(0, 2)
                              ).map((item, index) => (
                                <ListItem key={index} fontSize="sm">
                                  • {item}
                                </ListItem>
                              ))}
                              {prediction.precautions.length > 2 && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  color="gray.500"
                                  onClick={() =>
                                    setExpandedSections((prev) => ({
                                      ...prev,
                                      [`precautions-${prediction.id}`]:
                                        !prev[`precautions-${prediction.id}`],
                                    }))
                                  }
                                >
                                  {expandedSections[`precautions-${prediction.id}`]
                                    ? "Show less"
                                    : `+${prediction.precautions.length - 2} more`}
                                </Button>
                              )}
                            </List>
                          </VStack>
                        </Stack>
                      </Stack>
                    </CardBody>
                  </Card>
                ))
              )}
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;

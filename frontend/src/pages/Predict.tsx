import { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Select,
  useToast,
  Card,
  CardBody,
  Badge,
  List,
  ListItem,
  VStack,
  Divider,
  Spinner,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { predictionApi, type PredictionHistory } from "../services/api";


const symptoms = [
  "back_pain",
  "constipation",
  "abdominal_pain",
  "diarrhoea",
  "mild_fever",
  "yellow_urine",
  "yellowing_of_eyes",
  "acute_liver_failure",
  "fluid_overload",
  "swelling_of_stomach",
  "swelled_lymph_nodes",
  "malaise",
  "blurred_and_distorted_vision",
  "phlegm",
  "throat_irritation",
  "redness_of_eyes",
  "sinus_pressure",
  "runny_nose",
  "congestion",
  "chest_pain",
  "weakness_in_limbs",
  "fast_heart_rate",
  "pain_during_bowel_movements",
  "pain_in_anal_region",
  "bloody_stool",
  "irritation_in_anus",
  "neck_pain",
  "dizziness",
  "cramps",
  "bruising",
  "obesity",
  "swollen_legs",
  "swollen_blood_vessels",
  "puffy_face_and_eyes",
  "enlarged_thyroid",
  "brittle_nails",
  "swollen_extremeties",
  "excessive_hunger",
  "extra_marital_contacts",
  "drying_and_tingling_lips",
  "slurred_speech",
  "knee_pain",
  "hip_joint_pain",
  "muscle_weakness",
  "stiff_neck",
  "swelling_joints",
  "movement_stiffness",
  "spinning_movements",
  "loss_of_balance",
  "unsteadiness",
  "weakness_of_one_body_side",
  "loss_of_smell",
  "bladder_discomfort",
  "foul_smell_of_urine",
  "continuous_feel_of_urine",
  "passage_of_gases",
  "internal_itching",
  "toxic_look_(typhos)",
  "depression",
  "irritability",
  "muscle_pain",
  "altered_sensorium",
  "red_spots_over_body",
  "belly_pain",
  "abnormal_menstruation",
  "dischromic_patches",
  "watering_from_eyes",
  "increased_appetite",
  "polyuria",
  "family_history",
  "mucoid_sputum",
  "rusty_sputum",
  "lack_of_concentration",
  "visual_disturbances",
  "receiving_blood_transfusion",
  "receiving_unsterile_injections",
  "coma",
  "stomach_bleeding",
  "distention_of_abdomen",
  "history_of_alcohol_consumption",
  "blood_in_sputum",
  "prominent_veins_on_calf",
  "palpitations",
  "painful_walking",
  "pus_filled_pimples",
  "blackheads",
  "scurring",
  "skin_peeling",
  "silver_like_dusting",
  "small_dents_in_nails",
  "inflammatory_nails",
  "blister",
  "red_sore_around_nose",
  "yellow_crust_ooze",
];

// const parseArray = (data: any): any => {
//   console.log("data", data);
//   try {
//     if (Array.isArray(data)) return data;
//     if (typeof data === "string") {
//       const sanitized = data.replace(/'/g, '"');
//       return JSON.parse(sanitized);
//     }
//     return [];
//   } catch (err) {
//     return [];
//   }
// };

const Predict = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<PredictionHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSymptomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const symptom = e.target.value;
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one symptom",
        status: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await predictionApi.predict(selectedSymptoms);
      setPrediction(result);
      toast({
        title: "Prediction Success",
        description: "Disease prediction completed successfully.",
        status: "success",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: error.message === "Please select valid symptoms for prediction" ? "Invalid Symptoms" : "Prediction Failed",
        description: error.message || "Something went wrong while predicting the disease.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxW="container.xl"
      py={8}
      minH="calc(100vh - 80px)"
      overflowX="hidden"
    >
      <Stack spacing={8} w="full">
        <Box>
          <Heading mb={4} color="blue.600">
            Disease Prediction
          </Heading>
          <Text color="gray.600" fontSize="lg" mb={4}>
            Select multiple symptoms from the dropdown below to get an accurate prediction and
            personalized health recommendations.
          </Text>
          <Text color="gray.500" fontSize="md">
            For better prediction accuracy, please select all relevant symptoms you are experiencing.
          </Text>
          
        </Box>

        <Card>
          <CardBody p={6}>
            <Stack spacing={4}>
              <Select
                placeholder="Select symptoms"
                value=""
                onChange={handleSymptomChange}
                mb={4}
                size="lg"
                bg={useColorModeValue('white', 'gray.800')}
                borderColor={useColorModeValue('gray.300', 'gray.600')}
                _hover={{
                  borderColor: useColorModeValue('gray.400', 'gray.500')
                }}
              >
                {symptoms.map((symptom) => (
                  <option key={symptom} value={symptom}>
                    {symptom
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </Select>

              <Box>
                {selectedSymptoms.map((symptom) => (
                  <Badge
                    key={symptom}
                    m={1}
                    colorScheme="blue"
                    variant="subtle"
                    fontSize="sm"
                    py={1}
                    px={2}
                    borderRadius="full"
                    cursor="pointer"
                    onClick={() => removeSymptom(symptom)}
                  >
                    {symptom
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                    ×
                  </Badge>
                ))}
              </Box>

              <Button
                colorScheme="blue"
                onClick={handlePredict}
                isLoading={loading}
                mt={4}
                size="lg"
                w="full"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Get Prediction
              </Button>
            </Stack>
          </CardBody>
        </Card>

        {loading && (
          <Center py={8}>
            <Spinner size="xl" color="blue.500" />
          </Center>
        )}

        {prediction && (
          <Card
            bg={useColorModeValue("white", "gray.800")}
            shadow="xl"
            borderRadius="xl"
            w="full"
          >
            <CardBody p={8}>
              <Stack spacing={6}>
                <Box>
                  <Heading size="lg" color={useColorModeValue("blue.600", "blue.300")} mb={4}>
                    {prediction.predicted_disease}
                  </Heading>
                  <Text fontSize="lg" color={useColorModeValue("gray.700", "gray.300")} mb={4}>
                    {prediction.description}
                  </Text>
                  <Box mb={4}>
                    <Text fontWeight="medium" mb={2}>Selected Symptoms:</Text>
                    <Stack direction="row" flexWrap="wrap" spacing={2}>
                      {prediction.symptoms.map((symptom, index) => (
                        <Badge
                          key={index}
                          colorScheme="blue"
                          variant="subtle"
                          fontSize="sm"
                          py={1}
                          px={2}
                          borderRadius="full"
                        >
                          {symptom.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      ))}
                    </Stack>
                  </Box>
                </Box>
                <Divider />
                <VStack align="start" spacing={6} w="full">
                  <Box
                    w="full"
                    bg={useColorModeValue("blue.50", "blue.900")}
                    p={4}
                    borderRadius="lg"
                  >
                    <Heading
                      size="md"
                      mb={3}
                      color={useColorModeValue("blue.600", "blue.200")}
                    >
                      Recommended Medications
                    </Heading>
                    <List spacing={3}>
                      {prediction.medications.map((med, index) => (
                        <ListItem
                          key={index}
                          fontSize="md"
                          display="flex"
                          alignItems="center"
                        >
                          <Box
                            as="span"
                            w={2}
                            h={2}
                            borderRadius="full"
                            bg="blue.500"
                            mr={3}
                          />
                          {med}
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box
                    w="full"
                    bg={useColorModeValue("green.50", "green.900")}
                    p={4}
                    borderRadius="lg"
                  >
                    <Heading
                      size="md"
                      mb={3}
                      color={useColorModeValue("green.600", "green.200")}
                    >
                      Diet Recommendations
                    </Heading>
                    <List spacing={3}>
                      {prediction.diet.map((item, index) => (
                        <ListItem
                          key={index}
                          fontSize="md"
                          display="flex"
                          alignItems="center"
                        >
                          <Box
                            as="span"
                            w={2}
                            h={2}
                            borderRadius="full"
                            bg="green.500"
                            mr={3}
                          />
                          {item}
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box
                    w="full"
                    bg={useColorModeValue("purple.50", "purple.900")}
                    p={4}
                    borderRadius="lg"
                  >
                    <Heading
                      size="md"
                      mb={3}
                      color={useColorModeValue("purple.600", "purple.200")}
                    >
                      Workout Plan
                    </Heading>
                    <List spacing={3}>
                      {prediction.workout.map((item, index) => (
                        <ListItem
                          key={index}
                          fontSize="md"
                          display="flex"
                          alignItems="center"
                        >
                          <Box
                            as="span"
                            w={2}
                            h={2}
                            borderRadius="full"
                            bg="purple.500"
                            mr={3}
                          />
                          {item}
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box
                    w="full"
                    bg={useColorModeValue("orange.50", "orange.900")}
                    p={4}
                    borderRadius="lg"
                  >
                    <Heading
                      size="md"
                      mb={3}
                      color={useColorModeValue("orange.600", "orange.200")}
                    >
                      Precautions
                    </Heading>
                    <List spacing={3}>
                      {prediction.precautions.map((item, index) => (
                        <ListItem
                          key={index}
                          fontSize="md"
                          display="flex"
                          alignItems="center"
                        >
                          <Box
                            as="span"
                            w={2}
                            h={2}
                            borderRadius="full"
                            bg="orange.500"
                            mr={3}
                          />
                          {item}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </VStack>
              </Stack>
            </CardBody>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default Predict;

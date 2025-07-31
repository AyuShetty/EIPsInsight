import AllLayout from "@/components/Layout";
import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <AllLayout>
      <Box as="section" p={0} m={0}>
        {/* Hero Section */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="60vh"
          py={8} // Reduced from typical py={16} or higher
        >
          <Heading as="h1" size="2xl" mb={3}>
            Welcome to EIPs Insight
          </Heading>
          <Text fontSize="lg" mb={2}>
            The latest on Ethereum Improvement Proposals.
          </Text>
          <Button size="lg" colorScheme="blue">
            Get Started
          </Button>
        </Flex>

        {/* Features Section */}
        <Box as="section" py={4} px={0} m={0}>
          <Heading as="h2" size="lg" mb={2}>
            Features
          </Heading>
          <Flex direction="row" gap={3} wrap="wrap" justify="center">
            <Box p={3} minW="220px" borderWidth={1} borderRadius="md">
              <Heading as="h3" size="md" mb={1}>Track EIPs</Heading>
              <Text fontSize="sm">Stay updated with all proposals.</Text>
            </Box>
            <Box p={3} minW="220px" borderWidth={1} borderRadius="md">
              <Heading as="h3" size="md" mb={1}>Analytics</Heading>
              <Text fontSize="sm">Deep dives into EIP activity.</Text>
            </Box>
            <Box p={3} minW="220px" borderWidth={1} borderRadius="md">
              <Heading as="h3" size="md" mb={1}>Community</Heading>
              <Text fontSize="sm">Join the discussion.</Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    </AllLayout>
  );
}

import {
  Box,
  Grid,
  Heading,
  Link,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";
import Header from "./Header";

interface ToolCardProps {
  imageSrc: string;
  label: string;
  link: string;
}

const ToolCard: FC<ToolCardProps> = ({ imageSrc, label, link }) => {
  const bg = useColorModeValue("#FFFFFF", "#1A202C");
  const hoverBg = useColorModeValue("#F0F8FF", "#2D3748");
  const shadowColor = useColorModeValue("rgba(48, 160, 224, 0.1)", "rgba(48, 160, 224, 0.3)");

  return (
    <Link href={link} _hover={{ textDecoration: "none" }}>
      <Box
        border="2px solid"
        borderColor="#30A0E0"
        borderRadius="xl"
        p={{ base: 3, md: 4, lg: 6 }}
        height={{ base: "200px", md: "240px", lg: "260px" }}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg={bg}
        transition="all 0.3s ease-in-out"
        _hover={{
          bg: hoverBg,
          transform: { base: "translateY(-4px)", md: "translateY(-8px) scale(1.02)" },
          shadow: `0 ${useColorModeValue("10px 30px", "20px 40px")} ${shadowColor}`,
          borderColor: "#2B8AD6",
        }}
        textAlign="center"
        color="#30A0E0"
        overflow="hidden"
        position="relative"
        boxShadow={`0 4px 15px ${shadowColor}`}
      >
        <Image
          src={imageSrc}
          boxSize={{ base: "80px", md: "120px", lg: "140px" }}
          objectFit="contain"
          mb={{ base: 2, md: 3 }}
          transition="transform 0.3s ease"
          _hover={{ transform: { base: "scale(1.05)", md: "scale(1.1)" } }}
        />
        <Text 
          fontSize={{ base: "sm", md: "lg", lg: "xl" }}
          fontWeight="bold" 
          noOfLines={2}
          lineHeight="1.2"
          px={2}
        >
          {label}
        </Text>
        
        {/* Subtle hover indicator */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          height="4px"
          bg="linear-gradient(90deg, #30A0E0 0%, #2B8AD6 100%)"
          opacity="0"
          transition="opacity 0.3s ease"
          _groupHover={{ opacity: 1 }}
        />
      </Box>
    </Link>
  );
};

const ToolsSection: FC = () => {
  const headingColorLight = "#1A202C";
  const headingColorDark = "#F7FAFC";
  const headingBgGradientLight = "linear(to-r, #30A0E0, #2B8AD6)";
  const headingBgGradientDark = "linear(to-r, #30A0E0, #63B3ED)";

  return (
    <Box py={{ base: 4, md: 6, lg: 8 }} id="ourtools">
      <Box textAlign="center" mb={{ base: 4, md: 6, lg: 8 }}>
        <Text
          color={useColorModeValue(headingColorLight, headingColorDark)}
          fontWeight="extrabold"
          fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
          bgGradient={useColorModeValue(
            headingBgGradientLight,
            headingBgGradientDark
          )}
          bgClip="text"
          mb={{ base: 2, md: 4 }}
          letterSpacing="tight"
        >
          🛠️ Our Powerful Tools
        </Text>
        <Text
          fontSize={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
          color={useColorModeValue("gray.600", "gray.300")}
          maxW={{ base: "90%", sm: "xl", md: "2xl" }}
          mx="auto"
          lineHeight="1.6"
          px={{ base: 2, md: 0 }}
          display={{ base: "none", sm: "block" }}
        >
          Discover comprehensive analytics, insights, and resources for Ethereum Standards.
        </Text>
        <Text
          fontSize="sm"
          color={useColorModeValue("gray.600", "gray.300")}
          display={{ base: "block", sm: "none" }}
          px={2}
        >
          Essential tools for Ethereum Standards tracking
        </Text>
      </Box>

      <Grid
        templateColumns={{ 
          base: "1fr", 
          sm: "repeat(2, 1fr)", 
          md: "repeat(2, 1fr)", 
          lg: "repeat(3, 1fr)" 
        }}
        gap={{ base: 3, sm: 4, md: 5, lg: 6 }}
        justifyContent="center"
        width="100%"
        maxW="1400px"
        mx="auto"
        px={{ base: 2, md: 0 }}
      >
        <ToolCard
          imageSrc="/DashboardCard1.png"
          label="Analytics Dashboard"
          link="/Analytics"
        />
        <ToolCard
          imageSrc="/DashboardCard2.png"
          label="Editors Leaderboard"
          link="/Reviewers"
        />
        <ToolCard
          imageSrc="/DashboardCard3.png"
          label="Project Boards"
          link="/boards"
        />
        <ToolCard
          imageSrc="/DashboardCard7.png"
          label="Search by Author"
          link="/authors"
        />
        <ToolCard
          imageSrc="/DashboardCard5.png"
          label="Explore All EIPs"
          link="/all"
        />
        <ToolCard
          imageSrc="/DashBoardCard4.png"
          label="Did You Know?"
          link="/trivia"
        />
        <ToolCard
          imageSrc="/DashboardCard6.png"
          label="Feedback Hub"
          link="/Feedback"
        />
        <ToolCard
          imageSrc="/proposal_builder.png"
          label="Proposal Builder"
          link="/proposalbuilder"
        />
        <ToolCard
          imageSrc="/dashBoardCard8.png"
          label="Learning Resources"
          link="/resources"
        />
      </Grid>
    </Box>
  );
};

export default ToolsSection;

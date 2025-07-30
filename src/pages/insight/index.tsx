import React, { useEffect, useState } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Button,
  useColorModeValue,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import Head from "next/head";
import ViewsShare from "@/components/ViewsNShare";
import { CalendarIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { BsGraphUp } from "react-icons/bs";

interface MonthlyInsight {
  year: number;
  month: number;
  monthName: string;
  totalChanges: number;
  description: string;
}

const getMonthName = (monthNumber: number): string => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("default", { month: "long" });
};

const InsightIndex = () => {
  const [insights, setInsights] = useState<MonthlyInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");

  useEffect(() => {
    // Generate sample insights for recent months
    const recentInsights: MonthlyInsight[] = [];
    for (let i = 0; i < 6; i++) {
      let month = currentMonth - i;
      let year = currentYear;
      
      if (month <= 0) {
        month = 12 + month;
        year = year - 1;
      }
      
      recentInsights.push({
        year,
        month,
        monthName: getMonthName(month),
        totalChanges: Math.floor(Math.random() * 50) + 10,
        description: `EIP status changes and new proposals for ${getMonthName(month)} ${year}`
      });
    }
    
    setInsights(recentInsights);
    setIsLoading(false);
  }, [currentYear, currentMonth]);

  return (
    <AllLayout>
      <Head>
        <title>EIP Insights - Monthly Analysis</title>
        <meta 
          name="description" 
          content="Monthly insights and analysis of Ethereum Improvement Proposals (EIPs) status changes and trends" 
        />
      </Head>
      
      <Box px={{ base: "1rem", md: "4rem" }} py="2rem">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header Section */}
          <Box my={4} textAlign="center">
            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color="#00CED1"
              mb={4}
            >
              EIP Insights
            </Heading>
            
            <Text
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              lineHeight="1.75"
              color={textColor}
              maxW="800px"
              mx="auto"
              mb={6}
            >
              Explore monthly analysis of Ethereum Improvement Proposals (EIPs), 
              tracking status changes, new proposals, and community activity trends.
            </Text>
          </Box>

          {/* Current Month Highlight */}
          <Box my={6}>
            <Card bg={cardBg} shadow="lg" borderLeft="4px solid #00CED1">
              <CardHeader>
                <Flex align="center" gap={2}>
                  <Icon as={CalendarIcon} color="#00CED1" />
                  <Heading size="md" color="#00CED1">
                    Latest Insight
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <NextLink href={`/insight/${currentYear}/${currentMonth}`}>
                  <Flex justify="space-between" align="center" _hover={{ opacity: 0.8 }}>
                    <Box>
                      <Text fontSize="xl" fontWeight="semibold" mb={2}>
                        {getMonthName(currentMonth)} {currentYear}
                      </Text>
                      <Text 
                        fontSize={{ base: "md", md: "lg" }}
                        lineHeight="1.75"
                        color={textColor}
                      >
                        Current month EIP activity and status changes
                      </Text>
                    </Box>
                    <Button
                      colorScheme="blue"
                      rightIcon={<ArrowForwardIcon />}
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </Flex>
                </NextLink>
              </CardBody>
            </Card>
          </Box>

          {/* Monthly Insights Grid */}
          <Box my={6}>
            <Heading
              as="h2"
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="bold"
              color="#30A0E0"
              mb={6}
            >
              Recent Monthly Insights
            </Heading>
            
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
              gap={6}
            >
              {insights.map((insight, index) => (
                <GridItem key={`${insight.year}-${insight.month}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      bg={cardBg} 
                      _hover={{ 
                        transform: "translateY(-4px)",
                        shadow: "xl",
                        transition: "all 0.2s"
                      }}
                      cursor="pointer"
                      height="100%"
                    >
                      <NextLink href={`/insight/${insight.year}/${insight.month}`}>
                        <CardHeader>
                          <Flex align="center" justify="space-between">
                            <Heading size="md" color="#30A0E0">
                              {insight.monthName} {insight.year}
                            </Heading>
                            <Icon as={BsGraphUp} color="#30A0E0" />
                          </Flex>
                        </CardHeader>
                        <CardBody pt={0}>
                          <Text 
                            fontSize={{ base: "md", md: "lg" }}
                            lineHeight="1.75"
                            color={textColor}
                            mb={4}
                          >
                            {insight.description}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Click to view detailed analysis →
                          </Text>
                        </CardBody>
                      </NextLink>
                    </Card>
                  </motion.div>
                </GridItem>
              ))}
            </Grid>
          </Box>

          {/* Additional Information */}
          <Box my={6} textAlign="center">
            <Text 
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.75"
              color={textColor}
              mb={4}
            >
              Each monthly insight provides detailed breakdown of EIP status changes, 
              category analysis, and trends in the Ethereum proposal ecosystem.
            </Text>
            
            <NextLink href="/home">
              <Button
                colorScheme="blue"
                size="lg"
                leftIcon={<ArrowForwardIcon transform="rotate(180deg)" />}
              >
                Back to Dashboard
              </Button>
            </NextLink>
          </Box>
        </motion.div>
        
        <ViewsShare path={'/insight'} />
      </Box>
    </AllLayout>
  );
};

export default InsightIndex;
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Heading,
  Icon,
  Text,
  useColorModeValue,
  useMediaQuery,
  useTheme,
  Link as LI,
  Stack,
  useToast,
  Flex
} from "@chakra-ui/react";
// import React, { useEffect, useState } from "react";
import React, { useEffect, useState, useLayoutEffect } from "react";
import Header from "@/components/Header";
import { DownloadIcon } from "@chakra-ui/icons";
import DashboardDonut2 from "@/components/DashboardDonut2";
import DashboardDonut from "@/components/DashboardDonut";
// import { useRouter } from "next/router";
import {
  Anchor,
  BookOpen,
  Radio,
  Link,
  Clipboard,
  Briefcase
} from "react-feather";
import { BsArrowUpRight, BsGraphUp } from "react-icons/bs";
import StackedColumnChart from "@/components/StackedBarChart";
import AreaC from "@/components/AreaC";
import NextLink from "next/link";
// import { useRouter } from "next/navigation";
import { useRouter } from "next/router";
import { mockEIP } from "@/data/eipdata";
import { usePathname } from "next/navigation";
import FlexBetween from "./FlexBetween";
import StatBox from "./StatBox";
import LoaderComponent from "./Loader";
import Table from "./Table";
import Banner from "@/components/NewsBanner";
import SearchBox from "@/components/SearchBox";
import BoyGirl from "@/components/BoyGirl";
import BoyGirl2 from "@/components/BoyGirl2";
import BoyGirl3 from "@/components/BoyGirl3";
import AllChart from "./AllChart2";
import EIPS_dashboard_img from "../../public/EIPS_dashboard_img.png";
import ToolsSection from "./AvailableTools";
import TypeGraphs from "@/components/TypeGraphs2";
import CopyLink from "./CopyLink";
import {
  FiMenu,
  FiHome,
  FiSettings,
  FiBarChart2,
  FiTool,
  FiInfo,
  FiDatabase,
} from "react-icons/fi";

import { useSidebar } from "@/components/Sidebar/SideBarContext";

import DashboardCards from "./DashboardCards";
import FeedbackWidget from "./FeedbackWidget";
import { Clients } from "./Clients";
import { useScrollSpy } from "@/hooks/useScrollSpy";

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: Date;
  discussion: string;
  deadline: string;
  requires: string;
  repo: string;
  unique_ID: number;
  __v: number;
}

interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

const Dashboard = () => {
  const { setSections } = useSidebar();
  const [data, setData] = useState<APIResponse>({
    eip: [],
    erc: [],
    rip: [],
  });

  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [isDarkMode, setIsDarkMode] = useState(false);

  const textColorLight = "#2C3E50"; // Darker color for better visibility in light mode
  const textColorDark = "#F5F5F5"; // Light color for dark mode
  const bgGradientLight = "linear(to-r, #2980B9, #3498DB)"; // Clear gradient for better visibility in light mode
  const bgGradientDark = "linear(to-r, #30A0E0, #F5F5F5)";
  const toast = useToast();
  // useEffect(() => {
  //   setSections([
  //     { label: 'All EIPs', icon: FiHome, id: 'all' },
  //     { label: 'Our Tools', icon: FiTool, id: 'ourtools' },
  //     { label: 'What is EIPs Insights?', icon: FiInfo, id: 'what' },
  //     { label: 'EIP Status Changes by Year', icon: FiBarChart2, id: 'statuschanges' },
  //     { label: 'Dashboard', icon: FiDatabase, id: 'dashboard' },
  //   ]);
  // }, []);

  const scrollToFeedbackSection = () => {
    const element = document.getElementById("feedback");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false); // Set loader state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loader state to false even if an error occurs
      }
    };

    fetchData();
  }, []);
  const allData: EIP[] = data?.eip?.concat(data?.erc?.concat(data?.rip)) || [];
  const uniqueStatuses = [...new Set(allData.map((item) => item.status))];
  console.log(uniqueStatuses);
  const uniqueeip = allData.filter((item) => item.status === "");
  console.log("unique eip1:", uniqueeip);
  const uniqueeip2 = allData.filter((item) => item.status === " ");
  console.log("unique eip2:", uniqueeip2);
const textColor = useColorModeValue("gray.800", "gray.200");
const linkColor = useColorModeValue("blue.600", "blue.300");

  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const text = useColorModeValue("white", "black");
  const router = useRouter();
  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  });

  const monthName = new Date().toLocaleString([], {
    month: "long",
  });
  const year = new Date().getFullYear();

  // const router = useRouter();

  const scrollToHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToHash();
    }
  }, [isLoading]);

  useLayoutEffect(() => {
    router.events.on("routeChangeComplete", scrollToHash);
    return () => {
      router.events.off("routeChangeComplete", scrollToHash);
    };
  }, [router]);

  //  const [showThumbs, setShowThumbs] = useState(false);

  const submitFeedback = async (type: "like" | "dislike") => {
    try {
      const res = await fetch("/api/Feedback/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (!res.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Unexpected response format");
      }

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Thanks for your feedback!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err: any) {
      toast({
        title: "Error submitting feedback",
        description: err?.message || "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useScrollSpy([
    "all",
    "ourtools",
    "trending",
    "what",
    "statuschanges",
    "dashboard",
  ]);


  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300); // delay ensures DOM is ready
    }
  }, []);

  return (
    <>
      <FeedbackWidget />
  <Box px={{ base: 3, md: 5, lg: 8 }} py={{ base: 3, md: 4, lg: 6 }}>
    {isLoading ? (
      <Flex justify="center" align="center" minH="70vh">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoaderComponent />
        </motion.div>
      </Flex>
    ) : (
          // Show dashboard content if data is loaded
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 🎯 SECTION 1: HERO - First Impression & Value Proposition */}
              <Box
                id={"hero"}
                pt={{ base: 4, md: 6, lg: 8 }} 
                pb={{ base: 4, md: 6, lg: 8 }}
              >
                <div className="lg:block hidden">
                  <Box
                    display={{ lg: "grid" }}
                    gridTemplateColumns={{ lg: "2fr 1fr" }}
                    gap={12}
                    alignItems="center"
                  >
                    <Stack direction={"column"} spacing={8}>
                      <Box>
                        <Text
                          color={useColorModeValue(
                            textColorLight,
                            textColorDark
                          )}
                          fontWeight={"black"}
                          bgGradient={useColorModeValue(
                            bgGradientLight,
                            bgGradientDark
                          )}
                          bgClip="text"
                          fontSize={{
                            lg: "6xl",
                            md: "5xl",
                            sm: "4xl",
                            base: "2xl",
                          }}
                          lineHeight="0.95"
                          letterSpacing="tight"
                          mb={6}
                        >
                          Ethereum <br /> Improvement <br /> Proposal <br />
                          <Text 
                            as="span" 
                            bgGradient="linear(45deg, #30A0E0, #63B3ED)"
                            bgClip="text"
                            fontSize="inherit"
                            fontWeight="inherit"
                          >
                            Insight
                          </Text>
                        </Text>
                        <Text 
                          fontSize="xl" 
                          color={useColorModeValue("gray.600", "gray.300")}
                          maxW="500px"
                          lineHeight="1.7"
                          fontWeight="medium"
                        >
                          Your comprehensive platform for tracking, analyzing, and understanding 
                          Ethereum's evolution through EIPs, ERCs, and RIPs.
                        </Text>
                      </Box>

                      <Stack direction={"row"} spacing={"4"} flexWrap="wrap">
                        <NextLink href={"/home#dashboard"}>
                          <Button
                            size="lg"
                            bg="linear-gradient(135deg, #30A0E0 0%, #2B8AD6 100%)"
                            color="white"
                            rightIcon={<BsArrowUpRight />}
                            _hover={{
                              bg: "linear-gradient(135deg, #2B8AD6 0%, #1A75BB 100%)",
                              transform: "translateY(-2px)",
                              shadow: "xl",
                            }}
                            transition="all 0.3s ease"
                            fontWeight="bold"
                            px={8}
                          >
                            View Dashboard
                          </Button>
                        </NextLink>

                        <NextLink href={`/insight/${year}/${getMonth(monthName)}`}>
                          <Button
                            size="lg"
                            variant="outline"
                            borderColor="#30A0E0"
                            color="#30A0E0"
                            rightIcon={<BsGraphUp />}
                            _hover={{
                              bg: useColorModeValue("blue.50", "blue.900"),
                              borderColor: "#2B8AD6",
                              transform: "translateY(-2px)",
                              shadow: "lg",
                            }}
                            transition="all 0.3s ease"
                            fontWeight="bold"
                            px={6}
                          >
                            {monthName} {year} Insights
                          </Button>
                        </NextLink>

                        <NextLink href={"/all"}>
                          <Button
                            size="lg"
                            variant="ghost"
                            color="#30A0E0"
                            rightIcon={<BookOpen size={20} />}
                            _hover={{
                              bg: useColorModeValue("blue.50", "blue.900"),
                              transform: "translateY(-2px)",
                            }}
                            transition="all 0.3s ease"
                            fontWeight="semibold"
                          >
                            Explore All
                          </Button>
                        </NextLink>
                      </Stack>
                    </Stack>
                    <BoyGirl3 />
                  </Box>
                  
                  {/* Desktop Quick Stats */}
                  <Box
                    mt={16}
                    borderRadius="2xl"
                    bg={useColorModeValue("gray.50", "gray.800")}
                    p={8}
                    id="all"
                  >
                    <Box textAlign="center" mb={6}>
                      <Text 
                        fontSize="2xl" 
                        fontWeight="bold" 
                        color={useColorModeValue("gray.800", "white")}
                        mb={2}
                      >
                        Live Ethereum Standards Overview
                      </Text>
                      <Text 
                        fontSize="md" 
                        color={useColorModeValue("gray.600", "gray.400")}
                      >
                        Real-time statistics across all proposal categories
                      </Text>
                    </Box>
                    <Box overflowX="auto" w="full" minW={{ base: "280px", sm: "400px" }}>
                      <AllChart type="Total" dataset={data} />
                    </Box>
                  </Box>
                </div>

                {/* Mobile Hero - Optimized for smaller screens */}
                <div className="lg:hidden block text-center">
                  <Text
                    fontWeight={"black"}
                    color={useColorModeValue(textColorLight, textColorDark)}
                    bgGradient={useColorModeValue(
                      bgGradientLight,
                      bgGradientDark
                    )}
                    bgClip="text"
                    fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                    lineHeight="0.95"
                    letterSpacing="tight"
                    mb={{ base: 4, sm: 6 }}
                  >
                    Ethereum <br /> Improvement <br /> Proposals <br /> 
                    <Text 
                      as="span" 
                      bgGradient="linear(45deg, #30A0E0, #63B3ED)"
                      bgClip="text"
                      fontSize="inherit"
                      fontWeight="inherit"
                    >
                      Insight
                    </Text>
                  </Text>
                  
                  <Text 
                    fontSize={{ base: "md", sm: "lg", md: "xl" }}
                    color={useColorModeValue("gray.600", "gray.300")}
                    mb={{ base: 6, sm: 8 }}
                    px={{ base: 2, sm: 4 }}
                    maxW="600px"
                    mx="auto"
                    lineHeight="1.6"
                    fontWeight="medium"
                  >
                    Track Ethereum's evolution through comprehensive EIP analytics, 
                    insights, and community-driven data visualization.
                  </Text>

                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    spacing={{ base: 3, sm: 4 }}
                    justifyContent={"center"}
                    px={{ base: 2, sm: 4 }}
                    mb={{ base: 6, sm: 8 }}
                  >
                    <NextLink href={"/home#dashboard"}>
                      <Button
                        bg="linear-gradient(135deg, #30A0E0 0%, #2B8AD6 100%)"
                        color="white"
                        rightIcon={<BsArrowUpRight />}
                        size="lg"
                        w={{ base: "full", sm: "auto" }}
                        _hover={{
                          bg: "linear-gradient(135deg, #2B8AD6 0%, #1A75BB 100%)",
                          transform: "translateY(-2px)",
                          shadow: "xl",
                        }}
                        transition="all 0.3s ease"
                        fontWeight="bold"
                        px={8}
                      >
                        View Dashboard
                      </Button>
                    </NextLink>
                    <NextLink href={"/all"}>
                      <Button
                        variant="outline"
                        borderColor="#30A0E0"
                        color="#30A0E0"
                        rightIcon={<BookOpen size={20} />}
                        size="lg"
                        w={{ base: "full", sm: "auto" }}
                        _hover={{
                          bg: useColorModeValue("blue.50", "blue.900"),
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.3s ease"
                        fontWeight="bold"
                        px={6}
                      >
                        Explore EIPs
                      </Button>
                    </NextLink>
                  </Stack>
                  
                  {/* Mobile Quick Stats */}
                  <Box
                    mt={8}
                    borderRadius="xl"
                    bg={useColorModeValue("gray.50", "gray.800")}
                    p={6}
                    mx={-4}
                  >
                    <Text 
                      fontSize="xl" 
                      fontWeight="bold" 
                      mb={4}
                      color={useColorModeValue("gray.800", "white")}
                    >
                      Live Overview
                    </Text>
                    <Box overflowX="auto" w="full" minW={{ base: "280px", sm: "400px" }}>
                      <AllChart type="Total" dataset={data} />
                    </Box>
                  </Box>
                </div>
              </Box>

              {/* 🎯 SECTION 2: WHAT IS EIPSINSIGHT - Educational Context & Credibility */}
              <Box 
                py={{ base: 12, lg: 16 }} 
                id="what"
                bg={useColorModeValue("white", "gray.900")}
                borderRadius="2xl"
                mx={{ base: -3, md: -5, lg: -8 }}
                px={{ base: 6, md: 8, lg: 12 }}
                my={8}
                shadow="lg"
              >
                <Box textAlign="center" mb={12}>
                  <Text 
                    fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                    fontWeight="bold"
                    bgGradient="linear(45deg, #30A0E0, #63B3ED)"
                    bgClip="text"
                    mb={4}
                  >
                    What is EIPsInsight?
                  </Text>
                  <Text 
                    fontSize={{ base: "lg", md: "xl" }}
                    color={useColorModeValue("gray.600", "gray.300")}
                    maxW="3xl"
                    mx="auto"
                    lineHeight="1.6"
                  >
                    A comprehensive platform that visualizes Ethereum proposal activity, 
                    tracks progress, and monitors editor workloads across the ecosystem.
                  </Text>
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                  gap={{ base: 8, lg: 12 }}
                  alignItems="center"
                >
                  {/* Left Side - Video */}
                  <Box>
                    <Box
                      position="relative"
                      borderRadius="xl"
                      overflow="hidden"
                      shadow="2xl"
                      _hover={{
                        transform: "scale(1.02)",
                        shadow: "3xl",
                      }}
                      transition="all 0.3s ease"
                    >
                      <iframe
                        width="100%"
                        height="315"
                        src="https://www.youtube.com/embed/AyidVR6X6J8?start=8"
                        title="EIPsInsight Overview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: "12px" }}
                      ></iframe>
                    </Box>
                  </Box>

                  {/* Right Side - Enhanced Content */}
                  <Box>
                    <Stack spacing={6}>
                      <Text 
                        fontSize={{ base: "lg", md: "xl" }}
                        lineHeight="1.7"
                        color={useColorModeValue("gray.700", "gray.200")}
                      >
                        <Text as="span" fontWeight="bold" color="#30A0E0">
                          EIPsInsight
                        </Text> is a comprehensive tooling platform designed to provide 
                        visual insights into the activity of Ethereum Improvement Proposals (
                        <NextLink href="/eip">
                          <Text as="span" color="blue.400" _hover={{ textDecoration: "underline" }}>
                            EIPs
                          </Text>
                        </NextLink>
                        ), Ethereum Request for Comments (
                        <NextLink href="/erc">
                          <Text as="span" color="blue.400" _hover={{ textDecoration: "underline" }}>
                            ERCs
                          </Text>
                        </NextLink>
                        ), and Rollup Improvement Proposals (
                        <NextLink href="/rip">
                          <Text as="span" color="blue.400" _hover={{ textDecoration: "underline" }}>
                            RIPs
                          </Text>
                        </NextLink>
                        ).
                      </Text>

                      <Text 
                        fontSize={{ base: "lg", md: "xl" }}
                        lineHeight="1.7"
                        color={useColorModeValue("gray.700", "gray.200")}
                      >
                        It helps track proposal progress and workload of{" "}
                        <NextLink href="/eips/eip-1">
                          <Text as="span" color="blue.400" _hover={{ textDecoration: "underline" }}>
                            EIP Editors
                          </Text>
                        </NextLink>
                        , enhancing transparency and efficiency in the review process.
                      </Text>

                      <NextLink href="/resources">
                        <Button
                          size="lg"
                          variant="outline"
                          borderColor="#30A0E0"
                          color="#30A0E0"
                          rightIcon={<BsArrowUpRight />}
                          _hover={{
                            bg: useColorModeValue("blue.50", "blue.900"),
                            transform: "translateY(-2px)",
                            shadow: "lg",
                          }}
                          transition="all 0.3s ease"
                          fontWeight="bold"
                        >
                          Learn More & Resources
                        </Button>
                      </NextLink>
                    </Stack>
                  </Box>
                </Box>
              </Box>

              {/* 🎯 SECTION 3: QUICK OVERVIEW - Immediate Value Demonstration */}
              <Box
                py={{ base: 8, md: 10, lg: 12 }}
                bg={useColorModeValue("gray.50", "gray.800")}
                borderRadius="2xl"
                mx={{ base: -3, md: -5, lg: -8 }}
                px={{ base: 4, md: 8, lg: 12 }}
                my={{ base: 6, md: 8 }}
                id="overview"
              >
                <Box textAlign="center" mb={{ base: 6, md: 8 }}>
                  <Text 
                    fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                    fontWeight="bold"
                    bgGradient="linear(45deg, #30A0E0, #63B3ED)"
                    bgClip="text"
                    mb={{ base: 3, md: 4 }}
                  >
                    📊 Live Ethereum Standards Overview
                  </Text>
                  <Text 
                    fontSize={{ base: "md", md: "lg", lg: "xl" }}
                    color={useColorModeValue("gray.600", "gray.300")}
                    maxW="2xl"
                    mx="auto"
                    px={{ base: 2, md: 0 }}
                  >
                    Real-time statistics and insights across all proposal categories
                  </Text>
                </Box>
                
                <Box
                  bg={useColorModeValue("white", "gray.700")}
                  borderRadius="xl"
                  p={{ base: 4, md: 6 }}
                  shadow="lg"
                  overflowX="auto"
                  minW={{ base: "280px", sm: "400px" }}
                >
                  <AllChart type="Total" dataset={data} />
                </Box>
              </Box>

              {/* 🎯 SECTION 4: OUR TOOLS - Core Product Showcase */}
              <Box 
                py={{ base: 12, lg: 16 }}
                id="ourtools"
              >
                <ToolsSection />
              </Box>

              {/* 🎯 SECTION 5: LIVE ANALYTICS - Data Insights & Engagement */}
              <Box py={{ base: 8, md: 10, lg: 12 }} id="statuschanges">
                <Box textAlign="center" mb={{ base: 6, md: 8 }}>
                  <Text 
                    fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                    fontWeight="bold"
                    bgGradient="linear(45deg, #30A0E0, #63B3ED)"
                    bgClip="text"
                    mb={{ base: 3, md: 4 }}
                  >
                    📈 EIP Status Changes by Year
                  </Text>
                  <Text 
                    fontSize={{ base: "md", md: "lg", lg: "xl" }}
                    color={useColorModeValue("gray.600", "gray.300")}
                    maxW="2xl"
                    mx="auto"
                    px={{ base: 2, md: 0 }}
                  >
                    Track the evolution and progress of Ethereum proposals over time
                  </Text>
                </Box>
                <Box 
                  bg={useColorModeValue("white", "gray.800")}
                  borderRadius="xl"
                  p={{ base: 4, md: 6 }}
                  shadow="lg"
                  overflowX="auto"
                  minW={{ base: "280px", sm: "400px" }}
                >
                  <TypeGraphs />
                </Box>
              </Box>

              {/* 🎯 SECTION 6: TRENDING CONTENT - Social Proof & Community Activity */}
              <Box
                py={{ base: 8, md: 10, lg: 12 }}
                bg={useColorModeValue("blue.50", "blue.900")}
                borderRadius="2xl"
                mx={{ base: -3, md: -5, lg: -8 }}
                px={{ base: 4, md: 8, lg: 12 }}
                my={{ base: 6, md: 8 }}
                position="relative"
                overflow="hidden"
              >
                {/* Subtle background pattern */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  opacity="0.1"
                  bgGradient="radial(circle at 30% 20%, blue.400, transparent 50%)"
                />
                <Box position="relative" zIndex="1">
                  <Clients />
                </Box>
              </Box>

              {/* Mobile Search - Utility for mobile users */}
              <Box
                display={{ base: "block", md: "block", lg: "none" }}
                py={{ base: 6, md: 8 }}
                textAlign="center"
              >
                <Text 
                  fontSize="xl" 
                  fontWeight="bold" 
                  mb={4}
                  color={useColorModeValue("gray.700", "gray.200")}
                >
                  🔍 Quick Search
                </Text>
                <Text 
                  fontSize="sm" 
                  color={useColorModeValue("gray.600", "gray.400")}
                  mb={4}
                >
                  Find EIPs, ERCs, and RIPs instantly
                </Text>
                <Box
                  className="max-w-md mx-auto"
                  bg={useColorModeValue("white", "gray.700")}
                  borderRadius="xl"
                  p={4}
                  shadow="lg"
                  border="1px solid"
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                  _hover={{
                    shadow: "xl",
                    borderColor: useColorModeValue("blue.300", "blue.500"),
                  }}
                  transition="all 0.3s ease"
                >
                  <SearchBox />
                </Box>
              </Box>

            </motion.div>
            
            {/* 🎯 SECTION 7: COMPREHENSIVE DASHBOARD - Detailed Analytics for Advanced Users */}
            <Box 
              id="dashboard" 
              sx={{ scrollMarginTop: "100px" }}
              py={{ base: 8, md: 12, lg: 16 }}
            >
              <Box textAlign="center" mb={{ base: 8, md: 12 }}>
                <Text 
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl", xl: "5xl" }}
                  fontWeight="bold"
                  bgGradient="linear(45deg, #30A0E0, #63B3ED)"
                  bgClip="text"
                  mb={{ base: 3, md: 4 }}
                >
                  📊 Comprehensive Dashboard
                </Text>
                <Text 
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
                  color={useColorModeValue("gray.600", "gray.300")}
                  maxW="3xl"
                  mx="auto"
                  lineHeight="1.6"
                  px={{ base: 2, md: 0 }}
                >
                  Deep dive into Ethereum Standards analytics with detailed metrics across 
                  all proposal types, statuses, and lifecycle progression.
                </Text>
              </Box>

              <Box
                bg={useColorModeValue("white", "gray.800")}
                borderRadius="2xl"
                p={{ base: 4, md: 6, lg: 8 }}
                shadow="xl"
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.600")}
                overflowX="auto"
                minW={{ base: "280px", sm: "400px" }}
              >
                <Box
                  display="grid"
                  gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={{ base: 4, md: 6 }}
                  mt={{ base: 4, md: 6 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <StatBox
                        title="Meta EIPs"
                        value={
                          new Set(
                            allData
                              .filter((item) => item.type === "Meta")
                              .map((item) => item.eip)
                          ).size
                        }
                        description="Meta EIPs describe changes to the EIP process, or other non-optional changes."
                        icon={
                          <Icon
                            as={Briefcase}
                            fontSize={{ base: "10", lg: "15" }}
                          />
                        }
                        url="meta"
                      />
                    </div>

                    <StatBox
                      title="Core EIPs"
                      value={
                        data?.eip?.filter(
                          (item) =>
                            item.type === "Standards Track" &&
                            item.category === "Core"
                        ).length || 0
                      }
                      description="Core EIPs describe changes to the Ethereum protocol."
                      icon={
                        <Icon as={Anchor} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="core"
                    />

                    <StatBox
                      title="ERCs"
                      value={
                        new Set(
                          allData
                            .filter((item) => item.category === "ERC")
                            .map((item) => item.eip)
                        ).size
                      }
                      description="ERCs describe application-level standards for the Ethereum ecosystem."
                      icon={
                        <Icon as={BookOpen} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="erc"
                    />

                    <StatBox
                      title="Networking EIPs"
                      value={
                        new Set(
                          allData
                            .filter((item) => item.category === "Networking")
                            .map((item) => item.eip)
                        ).size
                      }
                      description="Networking EIPs describe changes to the Ethereum network protocol."
                      icon={
                        <Icon as={Radio} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="networking"
                    />

                    <StatBox
                      title="Interface EIPs"
                      value={
                        new Set(
                          allData
                            .filter((item) => item.category === "Interface")
                            .map((item) => item.eip)
                        ).size
                      }
                      description="Interface EIPs describe changes to the Ethereum client API."
                      icon={
                        <Icon as={Link} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="interface"
                    />

                    <StatBox
                      title="Informational EIPs"
                      value={
                        new Set(
                          allData
                            .filter((item) => item.type === "Informational")
                            .map((item) => item.eip)
                        ).size
                      }
                      description="Informational EIPs describe other changes to the Ethereum ecosystem."
                      icon={
                        <Icon
                          as={Clipboard}
                          fontSize={{ base: "10", lg: "15" }}
                        />
                      }
                      url="informational"
                    />

                    <StatBox
                      title="RIPs"
                      value={
                        new Set(
                          allData
                            .filter((item) => item.repo === "rip")
                            .map((item) => item.eip)
                        ).size
                      }
                      description="RIPs describe changes to the RIP process, or other non-optional changes."
                      icon={
                        <Icon
                          as={Briefcase}
                          fontSize={{ base: "10", lg: "15" }}
                        />
                      }
                      url="rip"
                    />
                  </div>

                  <Box
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 } as any}
                    bgColor={bg}
                    paddingY={{ lg: "1rem", sm: "1rem" }}
                    paddingX={{ lg: "1.5rem", sm: "0.5rem" }}
                    borderRadius="0.55rem"
                    _hover={{
                      border: "1px",
                      borderColor: "#30A0E0",
                    }}
                    className="hover: cursor-pointer ease-in duration-200"
                  >
                    <NextLink href="/all">
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="#30A0E0"
                        marginTop="4"
                        marginRight="6"
                        paddingBottom={6}
                        padding={2}
                      >
                        {`Category - [${allData.length}]`}
                      </Text>
                    </NextLink>
                    <DashboardDonut2 dataset={data} />
                  </Box>
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns={{ lg: "repeat(2, 1fr)" }}
                  gap={"4"}
                  marginTop={"6px"}
                >
                  <Box
                    as={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 } as any}
                    bgColor={bg}
                    paddingY={{ lg: "1rem", sm: "1rem" }}
                    paddingX={{ lg: "2rem", sm: "0.5rem" }}
                    borderRadius="0.55rem"
                    _hover={{
                      border: "1px",
                      borderColor: "#30A0E0",
                    }}
                    className="hover: cursor-pointer ease-in duration-200"
                  >
                    <NextLink href="/status">
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="#30A0E0"
                        marginTop="4"
                        marginRight="6"
                        paddingBottom={6}
                        padding={2}
                      >
                        {`Status - [${allData.length}]`}
                      </Text>
                    </NextLink>
                    <DashboardDonut dataset={data} />
                  </Box>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <StatBox
                        title="Draft"
                        value={
                          allData.filter((item) => item.status === "Draft")
                            .length
                        }
                        description="Draft EIPs are proposals still under initial consideration and open for feedback."
                        icon={
                          <Icon
                            as={Briefcase}
                            fontSize={{ base: "10", lg: "15" }}
                          />
                        }
                        url="alltable"
                      />
                    </div>

                    <StatBox
                      title="Review"
                      value={
                        allData.filter((item) => item.status === "Review")
                          .length
                      }
                      description="EIPs in the Review stage are being actively discussed and evaluated by the community."
                      icon={
                        <Icon as={Anchor} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="alltable"
                    />

                    <StatBox
                      title="Last Call"
                      value={
                        allData.filter((item) => item.status === "Last Call")
                          .length
                      }
                      description="Last Call EIPs are nearing finalization, with a short period for final community comments."
                      icon={
                        <Icon as={BookOpen} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="alltable"
                    />

                    <StatBox
                      title="Final"
                      value={
                        allData.filter((item) => item.status === "Final").length
                      }
                      description="Final EIPs have been formally accepted and implemented as part of the Ethereum protocol."
                      icon={
                        <Icon as={Radio} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="alltable"
                    />

                    <StatBox
                      title="Withdrawn"
                      value={
                        allData.filter((item) => item.status === "Withdrawn")
                          .length
                      }
                      description="Withdrawn EIPs have been removed from consideration by the author or due to lack of support."
                      icon={
                        <Icon as={Link} fontSize={{ lg: "15", sm: "10" }} />
                      }
                      url="alltable"
                    />

                    <StatBox
                      title="Stagnant"
                      value={
                        allData.filter((item) => item.status === "Stagnant")
                          .length
                      }
                      description="Stagnant EIPs are inactive and have not progressed for a prolonged period."
                      icon={
                        <Icon
                          as={Clipboard}
                          fontSize={{ base: "10", lg: "15" }}
                        />
                      }
                      url="alltable"
                    />

                    <StatBox
                      title="Living"
                      value={
                        allData.filter((item) => item.status === "Living")
                          .length
                      }
                      description="Living EIPs are continuously updated and reflect evolving standards or documentation."
                      icon={
                        <Icon
                          as={Briefcase}
                          fontSize={{ base: "10", lg: "15" }}
                        />
                      }
                      url="alltable"
                    />
                  </div>
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}
      </Box>
    </>
  );
};

function getMonth(monthName: any) {
  switch (monthName) {
    case "January":
      return 1;
    case "February":
      return 2;
    case "March":
      return 3;
    case "April":
      return 4;
    case "May":
      return 5;
    case "June":
      return 6;
    case "July":
      return 7;
    case "August":
      return 8;
    case "September":
      return 9;
    case "October":
      return 10;
    case "November":
      return 11;
    case "December":
      return 12;
    default:
      return "1";
  }
}

export default Dashboard;

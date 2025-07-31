"use client";
import { Providers } from "@/app/providers";
import React, { useEffect, useState } from "react";
import LargeWithAppLinksAndSocial from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SubscriptionFloater from "@/components/SubscriptionFloater";
import {
  Box,
  ColorModeScript,
  useBreakpointValue,
  Portal,
} from "@chakra-ui/react";
import { Rajdhani } from "next/font/google";
import "../app/globals.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Script from "next/script";
import FloatingContributionIcon from "./FloatingContributionIcon";
import BookmarkFloater from "./BookmarkFloater";
import SessionWrapper from "@/components/SessionWrapper";
import { AuthLocalStorageInitializer } from "./AuthLocalStorageInitializer";
import { BookmarkProvider } from "./BookmarkContext";
import SidebarConfigLoader from "./Sidebar/SideBarConfigLoader";
import { sidebarConfig } from "./Sidebar/slidebarConfig";
import { useSidebarStore } from "@/stores/useSidebarStore";

const mont = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const AllLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const topLevelRoute =
    pathname === "/" ? "/" : `/${pathname?.split("/")?.[1]}`;
  const shouldShowSidebar = !!sidebarConfig[topLevelRoute];
  const { isCollapsed } = useSidebarStore();

  // Responsive sidebar width
  const sidebarWidth = useBreakpointValue({ base: "0px", md: isCollapsed ? "60px" : "240px" });
  const sidebarVisible = shouldShowSidebar;

  return (
    <SessionWrapper>
      <motion.div
        key={pathname}
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{ duration: 0.75 }}
        variants={{
          initialState: { opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" },
          animateState: { opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" },
          exitState: { clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)" },
        }}
        className={mont.className + " base-page-size"}
        style={{ minHeight: "100vh", padding: 0, margin: 0 }}
      >
        <Head>
          <title>EIPs Insights</title>
          <link rel="icon" href="/eipFavicon.png" />
        </Head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-R36R5NJFTW" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-R36R5NJFTW');
        `}</Script>
        <ColorModeScript initialColorMode="dark" />

        <Providers>
          <BookmarkProvider>
            <SidebarConfigLoader />
            {sidebarVisible && (
              <Portal>
                <Box position="fixed" top="0" left="0" zIndex={100000}>
                  <AppSidebar />
                </Box>
              </Portal>
            )}
            <Box
              ml={sidebarWidth}
              transition="margin 0.3s ease"
              w="100%"
              maxW="100vw"
              overflowX="hidden"
              p={0}
              m={0}
            >
              <Navbar />
              <AuthLocalStorageInitializer />
              {/* Main Content */}
              <Box as="main" p={0} m={0}>
                {children}
              </Box>
              {/* Floater icons - minimal spacing */}
              <Box position="fixed" bottom={8} right={8} display="flex" flexDirection="row" gap={2} zIndex={2000}>
                <FloatingContributionIcon />
                <BookmarkFloater />
                <SubscriptionFloater />
              </Box>
              {/* Footer - minimal top margin */}
              <Box mt={2}>
                <LargeWithAppLinksAndSocial />
              </Box>
            </Box>
          </BookmarkProvider>
        </Providers>
      </motion.div>
    </SessionWrapper>
  );
};

export default AllLayout;

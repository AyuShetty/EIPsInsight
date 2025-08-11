import React from "react";
import logoLight from '@/../public/EIPsInsightsDark.gif'; // for light mode
import logoDark from '@/../public/EIPsInsights.gif';     // for dark mode
import Image from 'next/image';
import { useColorModeValue, useBreakpointValue } from "@chakra-ui/react";

function Logo() {
  const logoSrc = useColorModeValue(logoLight, logoDark); // use the imported image objects
  const logoSize = useBreakpointValue({ base: 40, sm: 45, md: 50 });

  return (
    <Image
      src={logoSrc}
      width={logoSize}
      height={logoSize}
      alt="logo"
      priority
      style={{ color: 'inherit', backgroundColor: 'transparent' }}
    />
  );
}

export default Logo;

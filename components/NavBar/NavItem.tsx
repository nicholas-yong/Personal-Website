import { Box, Link } from "@chakra-ui/layout";
import React from "react";
import NextLink from "next/link";
import { background } from "@chakra-ui/styled-system";
import styled from "@emotion/styled";

export interface NavItemProps {
  name: string;
}

export const NavItemBox = styled(Box)({
  margin: "16px",
  overflow: "hidden",
  position: "relative",

  ["&:hover"]: {
    fontWeight: "bold",
  },

  ["&:after"]: {
    content: `""`,
    width: "0px",
    height: "5px",
    background: "#000",
    transition: "width 0.5s",
    bottom: "-0.2rem",
    left: "-2px",
    position: "absolute",
  },

  ["&:hover:after"]: {
    width: "100%",
  },
});

export const NavItem: React.FC<NavItemProps> = ({ name }: NavItemProps) => {
  return (
    <NavItemBox>
      <Link as={NextLink} href={`/${name}`}>
        {name}
      </Link>
    </NavItemBox>
  );
};

import React from "react"
import { Center, Flex } from "@chakra-ui/layout"
import { Sections } from "../../../utils/sections"
import { NavItem, NavItemProps } from "./NavItem"
import { Box } from "@chakra-ui/react"
import logo from "./logo.png"
import Image from "next/image"

export const NavBar: React.FC = () => {
	const navItems = Sections as NavItemProps[]

	return (
		<Flex
			position={"fixed"}
			h={"90%"}
			marginLeft={"10"}
			alignItems={"center"}
			flexDirection={"column"}
			justifyContent={"center"}
		>
			<Box boxSize={"150px"}>
				<Image src={logo} width={150} height={150} alt="Logo"></Image>
			</Box>
			<Center alignItems={"center"} flexDirection={"column"}>
				{navItems &&
					navItems.map((navItem, index) => {
						return <NavItem key={index} name={navItem.name} />
					})}
			</Center>
		</Flex>
	)
}

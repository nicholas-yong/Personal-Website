import { Box, Flex, useBreakpointValue } from "@chakra-ui/react"
import * as React from "react"
import { MainBar } from "../MainBar"
import { NavBar } from "../NavBar"

export const Page: React.FC = () => {
	const mainBarFlex = useBreakpointValue({
		base: "100%",
		md: "70%"
	})

	//This should hide the sidebar on mobile...
	const sideBarFlex = useBreakpointValue({
		base: "0%",
		md: "30%"
	})

	return (
		<Flex
			flexDirection={"row"}
			backgroundColor={"orange.100"}
			className="page-container"
			height={"100%"}
		>
			<Box className="main-bar-container" flexBasis={mainBarFlex}>
				<MainBar />
			</Box>
			<Box className="side-bar-container" flexBasis={sideBarFlex}>
				<NavBar />
			</Box>
		</Flex>
	)
}

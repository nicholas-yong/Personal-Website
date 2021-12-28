import { Grid, GridItem } from "@chakra-ui/react"
import React from "react"
import { NavBar } from "../NavBar"

export const Site: React.FC = () => {
	return (
		<Grid
			w={"100%"}
			h={"100%"}
			templateRows="repeat(10, 1fr)"
			templateColumns="repeat(10, 1fr)"
		>
			<GridItem>
				<MainBar />
			</GridItem>
			<GridItem colSpan={2} rowSpan={2}>
				<NavBar />
			</GridItem>
		</Grid>
	)
}

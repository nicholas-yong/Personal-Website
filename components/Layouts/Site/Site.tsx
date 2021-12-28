import { Grid, GridItem } from "@chakra-ui/react"
import React from "react"
import { NavBar } from "../NavBar"
import { MainBar } from '../MainBar'

export const Site: React.FC = () => {
	return (
		<Grid
			w={"100vw"}
			h={"100vh"}
			templateRows="repeat(10, 1fr)"
			templateColumns="repeat(10, 1fr)"
			backgroundColor={"gray.300"}
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

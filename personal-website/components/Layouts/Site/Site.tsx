import { Box } from "@chakra-ui/react"
import React from "react"
import { Page } from "../Page"

export const Site: React.FC = () => {
	return (
		<Box w={"100vw"} h={"100vh"} backgroundColor={"gray.300"}>
			<Box
				w={"60vw"}
				margin={"auto"}
				position={"relative"}
				top={"8vw"}
				className="site-page-container"
				h={"100vh"}
			>
				<Page />
			</Box>
		</Box>
	)
}

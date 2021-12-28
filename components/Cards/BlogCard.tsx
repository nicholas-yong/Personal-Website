import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { BlogItem } from "../../utils/types"
import Image from "next/image"
import Logo from "../NavBar/logo.png"
import { returnBlogTimeStamp } from "../../utils"

interface BlogCardProps {
	blogItem: BlogItem // To be added
}

export const BlogCard: React.FC<BlogCardProps> = ({ blogItem }) => {
	// The size of the image should be proportionate both based on the current viewport - as well as a possible multipler based on what type of card or collection it is currently in.
	const cardItem = blogItem

	return (
		<Flex
			alignItems={"center"}
			className="blog-item-container"
			flexDirection={"column"}
			gridGap={"8"}
		>
			<Flex
				alignItems={"center"}
				className="blog-kicker-container"
				flexDirection={"column"}
				gridGap={"4"}
			>
				<Text
					className="blog-timestamp"
					fontWeight={"light"}
					fontSize={"sm"}
					color={"gray"}
				>
					{returnBlogTimeStamp(cardItem.publicationDate)}
				</Text>
				<Text
					className="blog-title"
					fontWeight={"bold"}
					fontSize={"lg"}
					color={"black"}
				>
					{cardItem.title}
				</Text>
				<Flex />
				<Image src={cardItem.mainPicture} alt="Logo"></Image>
				<Flex
					flexDirection={"column"}
					gridGap={"4"}
					className="blog-text-container"
				>
					<Text className="blog-teaser">{cardItem.teaser}</Text>
				</Flex>
			</Flex>
		</Flex>
	)
}

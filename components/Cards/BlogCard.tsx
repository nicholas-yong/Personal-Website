import React from "react"
import { BlogItem } from "../../utils/types"

interface BlogCardProps {
	blogItem: BlogItem // To be added
}

const BlogCard: React.FC<BlogCardProps> = () => {
	// The size of the image should be proportionate both based on the current viewport - as well as a possible multipler based on what type of card or collection it is currently in.
	const exampleObject: BlogItem = {
		id: 1,
		title: "test",
		author: "test",
		mainPicture: "www.test.com", // url of the main picture to serve
		teaser: "HEY MA"
	}

	return (
		<div>
			<StyledBlogItem>
				<StyledKicker>
					<StyledTimestamp />
					<StyledTitle />
				</StyledKicker>
				<StyledImage />
				<StyledTextCollection>
					<StyledText />
					<StyledSocials />
				</StyledTextCollection>
			</StyledBlogItem>
		</div>
	)
}

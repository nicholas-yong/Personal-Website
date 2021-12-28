import React from "react"
import { BlogItem } from "../../../utils/types"
import { BlogCard } from "../../Cards/BlogCard"

export const MainBar: React.FC = () => {
	const testData: Array<BlogItem> = [
		{
			id: 1,
			title: "test",
			mainPicture: "/Quill.jpg", // url of the main picture to serve
			teaser: "HEY MA",
			publicationDate: 12312312312
		}
	]

	if (!testData) {
		return <p>HELP</p>
	}

	return (
		<>
			{testData &&
				testData.map((data, index) => (
					<BlogCard key={index} blogItem={data} />
				))}
		</>
	)
}

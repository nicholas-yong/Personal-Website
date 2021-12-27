import dayjs from "dayjs"

export const returnBlogTimeStamp = (timestamp: number) => {
	// The timestamp will be in unix  seconds
	const result = dayjs.unix(timestamp)
	return result.format("dddd D MMMM YYYY")
}

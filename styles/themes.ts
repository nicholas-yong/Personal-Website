import { extendTheme } from "@chakra-ui/react"

// Need to add the following defaults for conformity..
// Margin and padding breakpoints
// Colors

export const defaultTheme = extendTheme({
	components: {
		Link: {
			variants: {
				primary: ({ colorScheme = "black" }) => ({
					color: `${colorScheme}.500`,
					_hover: {
						color: `${colorScheme}.400`
					}
				})
			},
			defaultProps: {
				// you can name it whatever you want
				variant: "primary"
			}
		}
	},
	space: {
		xs: "0.25rem",
		sm: "0.5rem",
		md: "1rem",
		lg: "2rem",
		xl: "3rem"
	}
})

import "../styles/globals.css"
import { ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/dist/shared/lib/router/router"
import { defaultTheme } from "../styles/themes"
import { ThemeProvider } from "@emotion/react"

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={defaultTheme}>
			<ChakraProvider theme={defaultTheme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</ThemeProvider>
	)
}

export default MyApp

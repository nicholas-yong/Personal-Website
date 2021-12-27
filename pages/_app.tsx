import "../styles/globals.css"
import { ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/dist/shared/lib/router/router"
import { defaultTheme } from "../styles/themes"

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={defaultTheme}>
			<Component {...pageProps} />
		</ChakraProvider>
	)
}

export default MyApp

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { ChakraProvider } from '@chakra-ui/react'
import '@/styles/globals.css'


export default function App({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				disableTransitionOnChange
			>
				<Component {...pageProps} />
			</ThemeProvider>
		</ChakraProvider>
	)
}

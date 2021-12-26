import { extendTheme } from "@chakra-ui/react";

export const defaultTheme = extendTheme({
    components:
    {
        Link:
        {
            variants:
            {
                primary:({ colorScheme = "black" }) => ({
                    color: `${colorScheme}.500`,
                    _hover: {
                      color: `${colorScheme}.400`,
                    }
                })
            },
            defaultProps: {
                // you can name it whatever you want
                variant: "primary",
              },
        }
    }
})
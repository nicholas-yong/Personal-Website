import { Box, Link } from '@chakra-ui/layout'
import React from 'react'
import NextLink from 'next/link'

export interface NavItemProps{
    name: string
}

export const NavItem:React.FC<NavItemProps> = ({
    name
}: NavItemProps) =>
{
    return(
        <Box margin = '4'>
            <Link as={NextLink} href = {`/${name}`}>{name}</Link>
        </Box>
    )
}
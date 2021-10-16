import React from 'react'
import { Box, Center, Flex } from '@chakra-ui/layout'
import { Sections } from '../../utils/sections'
import { NavItem, NavItemProps } from './NavItem'
import { Image } from "@chakra-ui/react"

export const NavBar:React.FC = () =>
{
    const navItems = Sections as NavItemProps[]

    return(
        <Flex position = {'fixed'} h = {'100%'} marginLeft = {'8'} alignItems = {'center'} flexDirection = {'column'} justifyContent = {'center'}>
            <Box boxSize = {'150px'}>
                <Image src = '/logo.png'></Image>
            </Box>
            <Center alignItems = {'center'}  flexDirection = {'column'}>
                {navItems && navItems.map(navItem =>
                {
                    return <NavItem name = {navItem.name}/>
                })}
            </Center>
        </Flex>
    )
}
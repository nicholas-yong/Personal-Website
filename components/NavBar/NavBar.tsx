import React from 'react'
import { Center, Flex } from '@chakra-ui/layout'
import { Sections } from '../../utils/sections'
import { NavItem, NavItemProps } from './NavItem'

export const NavBar:React.FC = () =>
{
    const navItems = Sections as NavItemProps[]


    return(
<<<<<<< Updated upstream
        <Flex>
            <Center flexDirection = {'column'}>
                {navItems && navItems.map(navItem =>
=======
        <Flex position = {'fixed'} h = {'90%'} marginLeft = {'10'} alignItems = {'center'} 
            flexDirection = {'column'} justifyContent = {'center'}>
            <Box boxSize = {'150px'}>
                <Image src = '/logo.png' alt = 'Logo'></Image>
            </Box>
            <Center alignItems = {'center'}  flexDirection = {'column'}>
                {navItems && navItems.map((navItem, index) =>
>>>>>>> Stashed changes
                {
                    return <NavItem key = {index} name = {navItem.name}/>
                })}
            </Center>
        </Flex>
    )
}
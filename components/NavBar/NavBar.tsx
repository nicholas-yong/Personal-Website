import React from 'react'
import { Center, Flex } from '@chakra-ui/layout'
import { Sections } from '../../utils/sections'
import { NavItem, NavItemProps } from './NavItem'

export const NavBar:React.FC = () =>
{
    const navItems = Sections as NavItemProps[]


    return(
        <Flex>
            <Center flexDirection = {'column'}>
                {navItems && navItems.map(navItem =>
                {
                    return <NavItem name = {navItem.name}/>
                })}
            </Center>
        </Flex>
    )
}
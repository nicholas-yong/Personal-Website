import { Box, Flex } from '@chakra-ui/react';
import * as React from 'react';
import { MainBar } from '../MainBar';
import { NavBar } from '../NavBar';

const Page: React.FC = () =>
{
    return (
        <Flex
            flexDirection={"row"}
            className='page-container'
        >
        <Box
            className='main-bar-container'
            flexBasis={"70%"}
        >
            <MainBar/>
        </Box>
        <Box
            className='side-bar-container'
        >
            <NavBar/>
        </Box>
        </Flex>
    )
}
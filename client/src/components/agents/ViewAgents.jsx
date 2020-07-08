import React from 'react';
import { Box, UserIcon, UserName } from '../styled-components';

export const Agents = props => {

  return (
    <Box { ...props } >
      <UserIcon src={process.env.PUBLIC_URL + '/img/user.png'} height='60' />
      <UserName>vineet@handle.com <br /> <span style={{ fontSize: 15, fontWeight: '400'}}>password</span></UserName>
    </Box>
  )
}

export const ViewAgents = props => {
  return (
    <>
    <Agents />
    <Agents />
    <Agents />
    <Agents />
    <Agents />
    <Agents />
    <Agents />
    <Agents />
    <Agents />
    </>
  )
}
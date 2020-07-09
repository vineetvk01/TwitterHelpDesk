import React, { useEffect, useState } from 'react';
import { fetchAllAgent } from '../../services';
import { Box, UserIcon, UserName } from '../styled-components';

export const Agent = props => {

  return (
    <Box { ...props } >
      <UserIcon src={process.env.PUBLIC_URL + '/img/user.png'} height='60' />
      <UserName>{props.agent.email} <br /> 
      <span style={{ fontSize: 15, fontWeight: '400'}}>
        {props.agent.password ? props.agent.password: 'Admin Account'}
      </span>
      </UserName>
    </Box>
  )
}

export const ViewAgents = props => {

  const [agents, setAgents] = useState([]);

  useEffect(() =>{
    fetchAllAgent().then((data)=>{
      setAgents(data);
    })
  }, []);

  return (
    <>
    {agents.map(agent =>(
      <Agent key={agent._id} agent={agent} />
    ))}
    </>
  )
}
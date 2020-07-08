import React from 'react';
import styled from 'styled-components';

const AgentsForm = styled.div`
  padding: 30px 10px;
`;

const Credentials = styled.input`
 width: 60%;
 padding: 10px;
 margin: 10px auto;
 border: 1px solid #d3d3d3;
 border-radius: 5px;

 &:focus {
   outline: none;
 }
`;

const AddButton = styled.button`
  width: 50%;
  padding: 10px;
  margin: 10px auto;
  border: 1px solid #d3d3d3;
  border-radius: 5px;
`;

const Subtitle = styled.p`
 color: #666;
`;

export const AddAgents = () => {
  return (
    <AgentsForm>
      <Subtitle>You can add an agent which can take care of the twitter handle on your behalf.</Subtitle>
      <Credentials type="text" placeholder="Enter a username" />
      <Credentials type="password" placeholder="Enter a password" />
      <AddButton> Add Agent</AddButton>
    </AgentsForm>)
}
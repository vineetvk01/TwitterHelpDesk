import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { addNewAgent } from '../../services';

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

const Message = styled.p`
 color: green;
 border: 1px solid #d3d3d3;
 border-radius: 10px;
 padding: 10px;
 width: 400px;
`;

export const AddAgents = ({ isAdmin }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if(!isAdmin) return;
    const data = await addNewAgent(username, password);
    if (data.id) {
      setSuccess(true)
      setTimeout(() => { setSuccess(false) }, 2000);
    }
  }


  return (
    <AgentsForm>
      <Subtitle>You can add an agent which can take care of the twitter handle on your behalf.</Subtitle>
      {success ? <Message>Successfully added agent</Message> : ''}
      {!isAdmin ? <Message style={{ color: 'red' }}>Only Admin can add agents</Message> : ''}
      <Credentials type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter a username" />
      <Credentials type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a password" />
      <AddButton onClick={handleRegister}> Add Agent</AddButton>
    </AgentsForm>)
}
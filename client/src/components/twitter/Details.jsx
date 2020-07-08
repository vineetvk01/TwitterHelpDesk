import React from 'react';
import styled from 'styled-components';
import { UserIcon, UserName } from '../styled-components';

const Header = styled.div`
  padding: 15px;
  text-align: center;
`;

const Reply = styled.div`
  position: absolute;
  bottom: 20px;
  width: 90%;
`;

const ReplyInput = styled.textarea`
  width: 86%;
  float: right;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  height: 60px;
  padding: 10px;
  outline: none !important;
`

export const Details = props => {
  return (
    <Header >
      <UserIcon src={process.env.PUBLIC_URL + '/img/user.png'} height='30' />
      <UserName>Vineet Srivastav</UserName>
      <Reply>
        <UserIcon src={process.env.PUBLIC_URL + '/img/user.png'} height='30' />
        <ReplyInput />
      </Reply>
    </Header>
  )
}
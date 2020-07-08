import React from 'react';
import styled from 'styled-components';
import { AiOutlineTwitter } from 'react-icons/ai';
import { FaUserCog } from 'react-icons/fa';

const Background = styled.div`
  width: 100%;
  height: 100vh;
  background: #42275a;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #734b6d, #42275a);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #734b6d, #42275a); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */  
`;

const LoginBox = styled.div`
  background-color: rgba(0,0,0,0.4);
  width: 30%;
  min-height: 50vh;
  margin: auto;
  padding: 20px 0;
  border: 1px hidden #fff;
  border-radius: 10px;
  margin-top: 90px;
  text-align: center;
`;

const Title = styled.p`
  font-size: 20px;
  color: #fff;
  padding: 0;
  margin: 0;
`;

const TwitterButton = styled.button`
  padding: 5px 20px;
  font-size: 18px;
  margin: 20px auto;
  background-color: #55ACEE;
  border: 1px hidden #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 0px #fff;
  color: #fff;
  cursor: pointer;

  &:hover{
    box-shadow: 0px 2px 20px #fff;
  }

  &:focus{
    outline: 0;
  }
`
const UserCredentials = styled.input`
  width: 65%;
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 10px;
  &:focus{
    outline: 0;
  }
`;

const LoginButton = styled.button`
  padding: 5px 20px;
  font-size: 18px;
  margin: auto;
  margin-top: 20px;
  background-color: #55ACEE;
  border: 1px hidden #fff;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;

  &:focus{
    outline: 0;
  }
`

export const Login = () => {

  return (
    <Background>
      <LoginBox>
        <img src={process.env.PUBLIC_URL + '/img/diamond.svg'} width='40' />
        <Title>HELP DESK</Title>
        <TwitterButton outline='none'>
          <AiOutlineTwitter size='36' style={{ float: 'left', marginTop: 10 }} />
          <p style={{ float: 'left' }}> | Connect with Twitter</p>
        </TwitterButton>
        <br />
        <UserCredentials placeholder="Agent Username" type="text"/>
        <UserCredentials placeholder="Agent Password" type="password"/>
        <LoginButton><FaUserCog size='18' /> Login as Agent</LoginButton>

      </LoginBox>
    </Background>
  )

}
import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineTwitter } from 'react-icons/ai';
import { FaUserCog } from 'react-icons/fa';
import { connect } from 'react-redux';
import { fetchCurrentUser } from '../redux/reducers/auth'
import { buildTwitterOauthURL, loginAgent, activateListener } from '../services';

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

const _Login = ({fetchCurrentUser}) => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthentication = async (e) => {
    const authenticationURL = await buildTwitterOauthURL();
    const opened = window.open(authenticationURL, "Ratting", "width=550,height=670,left=150,top=200,toolbar=0,status=0,");
    let timer = setInterval(function () {
      if (opened.closed) {
        clearInterval(timer);
        activateListener();
        fetchCurrentUser();
      }
    }, 1000);
  }

  const handleAgentLogin = async () => {
    await loginAgent(username, password);
    fetchCurrentUser();
  }

  return (
    <Background>
      <LoginBox>
        <img src={process.env.PUBLIC_URL + '/img/diamond.svg'} width='40' />
        <Title>HELP DESK</Title>
        <TwitterButton outline='none' onClick={handleAuthentication}>
          <AiOutlineTwitter size='36' style={{ float: 'left', marginTop: 10 }} />
          <p style={{ float: 'left' }}> | Connect with Twitter</p>
        </TwitterButton>
        <br />
        <UserCredentials value={username} placeholder="Agent Username" type="text" onChange={(e)=>{setUsername(e.target.value)}} />
        <UserCredentials value={password} placeholder="Agent Password" type="password" onChange={(e)=>{setPassword(e.target.value)}} />
        <LoginButton onClick={handleAgentLogin}><FaUserCog size='18' /> Login as Agent</LoginButton>
      </LoginBox>
    </Background>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
  }
}

export const Login = connect(mapStateToProps,mapDispatchToProps)(_Login);
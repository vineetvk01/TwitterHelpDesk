import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  background-color: '#fff'; 
  padding: 10px;
  border: 1px solid #EAECEF;
  border-radius: 10px;
  overflow: hidden;
  width: 90%;
  text-align: center;
  height: 90vh
`;

const UserImage = styled.img`
  border-radius: 50px;
  margin: 0 20px;
  margin-top: 25px;
`;

const UserName = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  padding: 0;
`;

const Handle = styled.p`
  font-size: 12px;
  font-weight: 700;
  margin: 0;
  padding: 0;
`;

export const UserInfo = ({open}) => {

  if(open == null || Object.keys(open).length === 0) {
    return <p>Loading...</p>
  }

  const { user } = open.tweet;
  const { name = '', profile_image_url_https = process.env.PUBLIC_URL + '/img/user.png', screen_name } = user;
  return (
  <Box>
    <UserImage src={profile_image_url_https} height='90' />
    <UserName>{name}</UserName>
    <Handle>@{screen_name}</Handle>
  </Box>)
}
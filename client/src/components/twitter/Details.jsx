import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';
import { UserIcon, UserName } from '../styled-components';
import { replyToTweet } from '../../services';

const Header = styled.div`
  padding: 15px;
  text-align: center;
`;

const Text = styled.p`
  clear: both;
  text-align: left;
  padding: 20px;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  color: #666;
`;

const Reply = styled.div`
  position: absolute;
  bottom: 20px;
  width: 90%;
`;

const ReplyInput = styled.textarea`
  width: 80%;
  float: right;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  height: 60px;
  padding: 10px;
  outline: none !important;
`;

const Button = styled.button`
  position: absolute;
  right: 15px;
  bottom: -15px;
  width: 90px;
  height: 30px;
  font-size: 16px;
  color: #333;
  border: 1px solid #999;
  border-radius: 5px;
  cursor: pointer;

  &:focus{
    outline: none;
  }
`

export const Details = ({ open = { tweet: {} }, userImage }) => {

  const [reply, setReply] = useState('');

  if (Object.keys(open).length === 0) {
    return <Text>Loading...</Text>
  }

  const { id, text = '', user = {} } = open.tweet;
  const { name = '', profile_image_url_https = process.env.PUBLIC_URL + '/img/user.png', screen_name } = user;

  const handleSend = (e) => {
    replyToTweet(id, reply).then(()=>{
      setReply('');
    });
  }

  return (
    <Header >
      <UserIcon src={profile_image_url_https} height='30' />
      <UserName>{name}</UserName>
      <Text>{text}</Text>
      <Reply>
        <UserIcon src={userImage} height='50' />
        <ReplyInput value={reply} onChange={(e)=>{setReply(e.currentTarget.value)}} />
        <Button onClick={handleSend}><FiSend /> Send</Button>
      </Reply>
    </Header>
  )
}
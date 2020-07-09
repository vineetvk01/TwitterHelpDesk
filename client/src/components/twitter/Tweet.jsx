import React from 'react';
import { Box, UserIcon, UserName, Text } from '../styled-components';

export const Tweet = props => {

  const tweet = props.tweet;

  return (
    <Box {...props} >
      <UserIcon src={tweet.user.profile_image_url_https} height='30' />
      <UserName>{tweet.user.name}</UserName>
      <Text {...props}>{tweet.text}</Text>
    </Box>
  )
}
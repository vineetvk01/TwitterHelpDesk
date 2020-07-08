import React from 'react';
import { Box, UserIcon, UserName, Text } from '../styled-components';

export const Tweet = props => {

  return (
    <Box { ...props } >
      <UserIcon src={process.env.PUBLIC_URL + '/img/user.png'} height='30' />
      <UserName>Vineet</UserName>
      <Text { ...props }>sdhdfhdsufhdsuhsfhsfhfhsfh dshfsdjfhsdjfhsdfjsdf sdfhdsjfhsdjf</Text>
    </Box>
  )
}
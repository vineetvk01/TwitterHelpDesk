import React from 'react';
import styled from 'styled-components';
import { Tweet, Details, UserInfo } from './twitter';
import { Container, Content, Title } from './styled-components';

const Search = styled.input`
  position: absolute;
  padding: 5px;
  margin: 5px 30px;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  width: 200px;
  transition: width 0.5s;
  &:hover {
    border: 1px solid #333;
  }
  &:focus {
    border: 1px solid #999;
    width: 250px;
    outline: none;
  }
`;

export const Tweets = () => {

  return (
    <>
      <div className="container">
        <Content className="column" style={{flex: 1}}>
          <Tweet />
          <Tweet active/>
          <Tweet />
          <Tweet />
          <Tweet />
          <Tweet />
        </Content>
        <Content className="column" style={{flex: 2, position: 'relative'}}>
          <Details />
        </Content>
        <Content className="column" style={{flex: 1}}>
          <UserInfo />
        </Content>
      </div>
    </>)
}


export const TweetsBox = () => {

  return (
    <div id="right" className="column" style={{ width: '100%' }}>
      <div className="bottom">
        <Container>
          <div className="mini-header">
            <Title>Conversations</Title>
            <Search placeholder="Quick search" />
          </div>
          <Tweets />

        </Container>
      </div>
    </div>
  )

}
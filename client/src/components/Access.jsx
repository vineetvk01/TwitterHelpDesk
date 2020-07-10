import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { AddAgents, ViewAgents } from './agents';
import { Container, Content, Title } from './styled-components';

const AccessLayout = ({ isAdmin }) => (
  <>
    <div className="container">
      <Content className="column" style={{ flex: 2 }}>
        <AddAgents isAdmin={isAdmin} />
      </Content>
      <Content className="column" style={{ flex: 1 }}>
        <ViewAgents />
      </Content>
    </div>
  </>
)

const _AccessBox = ({ auth }) => {
  
  if(!auth.isLoggedIn){
    console.log('User Not Logged In');
    return <Redirect to={'/login'} />
  }

  const isAdmin = auth.user.user.email === auth.user.twitterUserOauth.email;

  return (
    <div id="right" className="column" style={{ width: '100%' }}>
      <div className="bottom">
        <Container>
          <div className="mini-header">
            <Title>Agents {!isAdmin ? '( you are not an admin )' : ''}</Title>
          </div>
          <AccessLayout isAdmin={isAdmin} />
        </Container>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}

export const AccessBox = connect(mapStateToProps, () => { })(_AccessBox);
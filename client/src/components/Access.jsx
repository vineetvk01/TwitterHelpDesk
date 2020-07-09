import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
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
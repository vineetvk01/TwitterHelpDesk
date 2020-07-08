import React from 'react';
import styled from 'styled-components';
import { AddAgents, ViewAgents } from './agents';
import { Container, Content, Title } from './styled-components';

const AccessLayout = () => (
  <>
    <div className="container">
      <Content className="column" style={{ flex: 2 }}>
        <AddAgents />
      </Content>
      <Content className="column" style={{ flex: 1 }}>
        <ViewAgents />
      </Content>
    </div>
  </>
)

export const AccessBox = () => {
  return (
    <div id="right" className="column" style={{ width: '100%' }}>
      <div className="bottom">
        <Container>
          <div className="mini-header">
            <Title>Agents</Title>
          </div>
          <AccessLayout />
        </Container>
      </div>
    </div>
  )
}
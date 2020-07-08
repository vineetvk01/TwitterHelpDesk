import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { routeConfig } from './routeConfig';

const Main = styled.main`
  padding: 0;
  margin: 0;
`

const App = () => {
  return (
    <Router>
      <Main>
        <Switch>
          {Object.keys(routeConfig).map((routeKey, index) => {
            const Component = routeConfig[routeKey].component;
            const { exact, route, props } = routeConfig[routeKey];

            return <Route exact={exact} path={route} key={index} render={nProps => {
              const updatedProps = {
                ...nProps,
                ...props
              };
              return <Component {...updatedProps} />;
            }}
            />
          })}
        </Switch>
      </Main>
    </Router>
  )
}

export default App;
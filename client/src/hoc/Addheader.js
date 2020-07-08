import React from 'react';
import { LeftHeader } from '../components/Header';

export const AddHeaderHOC = (Component) => (props) => {
  const { history: { location: { pathname } } } = props;
  
  return (
    <div className='container' >
      <LeftHeader pathname={pathname} />
      <Component {...props} />
    </div>
  )
}
import React, { useEffect, useState } from 'react';
import { AddHeaderHOC } from '../hoc/Addheader';
import { TweetsBox } from '../components/Dashboard';

const _DashBoard = () => {

  return (
    <TweetsBox />  
  )
}

export const DashBoard = AddHeaderHOC(_DashBoard);
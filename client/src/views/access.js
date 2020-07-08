import React, { useEffect, useState } from 'react';
import { AddHeaderHOC } from '../hoc/Addheader';
import { AccessBox } from '../components/Access';

const _Access = () => {

  return (
    <AccessBox />
  )

}

export const Access = AddHeaderHOC(_Access);
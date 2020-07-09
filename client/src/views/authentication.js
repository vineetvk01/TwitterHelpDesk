import React, { useEffect, useState } from 'react';
import { Login } from '../components/Login';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

const _Authentication = ({ auth }) => {

  if(auth.isLoggedIn){
    console.log('User Logged In');
    return <Redirect to={'/'} />
  }

  return(
  <div className='container'>
    <Login />
  </div>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}

export const Authentication = connect(mapStateToProps, ()=>{})(_Authentication);


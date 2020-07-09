import React, { useEffect } from 'react';
import { AddHeaderHOC } from '../hoc/Addheader';
import { TweetsBox } from '../components/Dashboard';
import { connect } from 'react-redux';
import { authRequestAction } from '../redux/reducers/auth';
import { Redirect } from 'react-router-dom';
import { activateListener } from '../services'

const _DashBoard = ({auth}) => {

  useEffect(()=>{
    activateListener();
  })

  if(!auth.isLoggedIn){
    console.log('User Not Logged In');
    return <Redirect to={'/login'} />
  }



  return (
    <TweetsBox />  
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authRequest: (user) => dispatch(authRequestAction(user)),
  }
}

export const DashBoard = connect(mapStateToProps,mapDispatchToProps)(AddHeaderHOC(_DashBoard));
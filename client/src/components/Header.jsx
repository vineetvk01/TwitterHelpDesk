import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiHome, FiHelpCircle } from 'react-icons/fi';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { logoutRequestAction } from '../redux/reducers/auth';
import { Redirect } from 'react-router-dom';

const Icons = styled.div`
  padding: 12px 15px;
  margin: 0 5px;
  background-color: ${props => props.active ? "#d3d3d3" : "inherit"};
  cursor: pointer;

  &:hover {
    background-color: #EAECEF;
  }
`;

const Image = styled.img`
  padding: 15px;
`;

const Bottom = styled.div`
  position: absolute;
  bottom: 0;
`;

const UserIcon = styled.img`
  border: 1px solid #fff;
  border-radius: 30px;
  padding: 12px;
  cursor: pointer;
`;

const MenuBox = styled.div`
  position: absolute;
  background: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  bottom: 40px;
  left: 30px;
  width: 100px;
  min-height: 100px;
`;

const MenuItem = styled.p`
  margin: 0;
  padding: 10px 20px;
  font-size: 14px;
  cursor: ${props => props.link ? 'pointer': ''};
  font-weight: ${props => props.link ? '500': '600'};

  &:hover {
    background: ${props => props.link ? '#d3d3d3': ''};
  }
`

const Menu = ({logoutUser}) => {
  return (
    <MenuBox>
      <MenuItem>Hi, Vineet</MenuItem>
      <MenuItem link>Home</MenuItem>
      <MenuItem link onClick={logoutUser}>Log out</MenuItem>
    </MenuBox>)
};

const _LeftHeader = ({ pathname, auth, logoutUser }) => {

  const [menuOpen, setMenuOpen] = useState(false);

  if(!auth.isLoggedIn){
    console.log('User Not Logged In');
    return <Redirect to={'/login'} />
  }

  const imageURL = auth.user.twitterUserOauth.profile_image_url;

  return (
    <div id="left" className="column">
      <div className="top-left">
        <Image src={process.env.PUBLIC_URL + '/img/diamond.svg'} height='30' />
      </div>
      <div className="bottom">
        <Link to="/">
          <Icons active={pathname === '/'}>
            <FiHome color='#555' size='1.2em' />
          </Icons>
        </Link>
        <Link to="/access">
          <Icons active={pathname === '/access'}>
            <FiUsers color='#555' size='1.2em' />
          </Icons>
        </Link>
        <Bottom>
          <Icons>
            <FiHelpCircle color='#555' size='1.2em' />
          </Icons>
          {menuOpen ? <Menu logoutUser={logoutUser} />: ''}
          <UserIcon src={imageURL} height='30' onClick={(e) => setMenuOpen(!menuOpen)} />
        </Bottom>
      </div>
    </div>)
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}

const mapActionToProps = (dispatch) => {
  return {
    logoutUser: () => dispatch(logoutRequestAction()),
  }
}

export const LeftHeader = connect(mapStateToProps, mapActionToProps)(_LeftHeader);
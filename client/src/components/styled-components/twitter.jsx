import styled from 'styled-components';

export const Box = styled.div`
  background-color: ${props => props.active ? '#EAECEF' : '#fff'}; 
  padding: 10px;
  margin: 5px;
  border: 1px solid #EAECEF;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  min-height: 60px;
  box-shadow: ${props => props.active ? '0px 1px 4px #222' : ''};
`;

export const UserIcon = styled.img`
  border: 1px solid #fff;
  border-radius: 30px;
  cursor: pointer;
  float: left;
`;

export const UserName = styled.p`
  font-size: 15px;
  font-weight: 600;
  height: 40px;
  float: left;
  margin: 0px 10px;
  margin-top: 5px;
`;

export const Text = styled.p`
  font-size: 12px;
  font-weight: 300;
  clear: both;
  color: ${props => props.active ? '#000' : '#999'}; 
`
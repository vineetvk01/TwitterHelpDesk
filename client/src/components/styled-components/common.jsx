import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 auto;
  width: 90%;
`;

export const Content = styled.div`
  height: 80vh;
  overflow-y: scroll;
  margin: 10px 0;

  &::-webkit-scrollbar-track {
    border: 1px solid #fff;
    padding: 2px 0;
    background-color: #fff;
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #fff;
    border: 1px solid #fff;
  }
`;

export const Title = styled.span`
padding: 0;
margin: 0;
font-weight: 600;
font-size: 1.6em;
`;
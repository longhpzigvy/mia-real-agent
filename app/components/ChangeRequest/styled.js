import styled, { css, keyframes } from 'styled-components';

export const ChangeRequestWrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('../../assets/images/bg-login.jpg');
  background-position: left center;
  background-size: cover;
  background-repeat: no-repeat;
`;

export const ChangeRequestItem = styled.div`
  width: 50.250em;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0px 0px 17px -3px #2a3a516e;
  padding: 2em;
  color: #6e6c83fa;
  position: relative;
  z-index: 1;
  ${({ register }) => register && css`
    width: 640px;
  `};
  .applicationText {
    text-align: center;
    font-size: 18px;
    margin-bottom: 40px;
    display: inline-block;
    color: #6e6c83fa;
    width: 100%;
  }
`;

export const ChangeRequestLogo = styled.div`
  text-align: center;
  font-size: 2em;
  width: 6.125em;
  height: 2.063em;
  margin: 0 auto 2em;
  color: ${props => props.theme.textColor};
  img{
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

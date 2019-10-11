import styled, { keyframes } from 'styled-components';

export const PageLoadingStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 240px - 105px);
`;

export const SpinnerOverlayWrapperStyled = styled.div`
  position: fixed;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0000002b;
`;

const Spin = keyframes`
  0% {
		transform:rotate(0deg);
	}
	100% { 
		transform:rotate(360deg); 
	}
`;

export const SpinnerWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 44%;
  right: 50%;
  .main-circle {
    background-color: rgba(0, 0, 0, 0);
    border: 2px solid #f3f3f3;
    opacity: 0.9;
    border-top: 2px solid #717171;
    border-left: 2px solid #717171;
    border-radius: 50px;
    width: 30px;
    height: 30px;
    animation: ${Spin} 800ms infinite linear;
  }
  .sub-circle {
    background-color: rgba(0, 0, 0, 0);
    border: 2px solid #f3f3f3;
    opacity: 0.9;
    border-top: 2px solid #717171;
    border-left: 2px solid #717171;
    border-radius: 50px;
    width: 20px;
    height: 20px;
    position: relative;
    top: -25px;
    left: 5px;
    animation: ${Spin} 800ms infinite reverse linear;
  }
`;

export const SpinnerItemStyled = styled.div`
  margin-top: 20px;
`;

export const LoadingStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

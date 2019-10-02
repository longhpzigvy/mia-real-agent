import styled, { css } from 'styled-components';
import { Button, Form, Input } from 'antd';

export const InputGroupPrepend = styled.div`
  padding: 0 15px;
  border: 1px solid var(--zigvy-col-border);
  border-right: none;
  height: 100%;
  display: flex;
  align-items: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  color: var(--zigvy-col-extra-light-grey);
`;

export const Break = styled.div`
  flex-basis: 100%;
  width: 0px;
  height: 0px;
  overflow: hidden;
`;
export const Label = styled.span`
  margin-left: 30px;
`;

export const CheckMark = styled.span`
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: ${props => props.theme.colorStyled.ColorWhite};
    border: 1px solid var(--zigvy-col-border);
    border-radius: 4px;
`;

export const CheckBoxWrapper = styled.label`
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  align-items: center;
  height: 20px;
  
  input[type=checkbox] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 0;
    height: 0;
  }
  
  input:checked ~ ${CheckMark} {
    display: flex;
    justify-content: center;
    align-items: center;
    
    span {
      display: block;
      width: 12px;
      height: 12px;
      background-color: var(--zigvy-col-blue);
      border-radius: 3px;
    }
  }
  
  &:hover {
    ${CheckMark} {
      
    }
  }
`;

export const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    display: block;
  }
  
  .react-datepicker__input-container {
    display: block;
  }
`;

export const AddParamButton = styled(Button).attrs({
  className: 'add-param-button',
})`
  right: 35px !important;
`;

export const FormItemStyled = styled(Form.Item).attrs({
  className: 'ant-form-item__richEditor',
})``;

export const InputWrapper = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 30px;
`;

export const InputStyled = styled(Input)`
  width: 100% !important;
  height: 36px !important;
  padding: 8px !important;
  outline: 0 none !important;
  transition: border-color .2s linear !important;
  -webkit-font-smoothing: antialiased !important;
  border-radius: 3px !important;
  background: transparent !important;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  color: #000 !important;
  font-size: 15px!important;
  font-weight: 600;
  &.vienpn-input{
    border: none;
    border-bottom: 1px solid #d2d2d2;
  }
  &:focus {
    box-shadow: none !important;
  }
  &:hover {
    transition: all 300ms ease;
    background-color: #ddd;
  }
  ${({ login }) => login && css`
    border: 0 !important;
    border-bottom: 1px solid #d2d2d2 !important;
    border-radius: 0 !important;
  `};
`;

export const InputWrapperStyled = styled(Form.Item)`
  color: ${props => props.theme.colorStyled.ColorBlack};
  margin-bottom: 10px!important;
  .ant-form-explain{
    margin-top: .5em;
  }
  .ant-select-selection__choice__content{
    font-weight: 600;
  }
  label{
    float: left;
    color: ${props => props.theme.colorStyled.ColorBlack}!important;
    ::after{
      content: '' !important;
    }
  }
  .vienpn{
    .ant-select-selection{}
  }
  .ant-select-selection {
    width: 100% !important;
    position: relative;
    top: -5px;
    padding: 2px !important;
    outline: 0 none !important;
    background-color: transparent;
    border-radius: 3px !important;
    border: none!important;
    border-bottom: 1px solid #d2d2d2!important;
    &:focus {
      box-shadow: none;
      /* border-radius: 3px !important;
      border: 1px solid #000 !important; */
    }
    &:hover {
      border-color: ${props => props.theme.colorStyled.ColorBlack};
    }
    .anticon-down {
      color: ${props => props.theme.colorStyled.ColorBlack};
    }
  }
  .ant-select-open .ant-select-selection {
    border-radius: 3px !important;
    box-shadow: none;
  }
  .ant-select-selection__rendered {
    outline: none;
    margin-bottom: 8px!important;
    height: 26px!important;
    line-height: 26px;
    margin-top: 3px;
  }
  .ant-select-selection-selected-value {
    ${props => props.mode === 'multiple' && {
    backgroundColor: '#fafafa',
  }}
  }
  .ant-slider-track {
    background-color: #ec976e !important;
  }
  .ant-slider-dot-active {
    border-color: #ec976e !important;
  }
  .ant-slider-handle {
    border: solid 2px #ec976e !important;
    &:focus {
      box-shadow: 0 0 0 5px #ffb01833 !important;
    }
  }
  ${({ login }) => login && css`
    .ant-select-selection {
      border-radius: 0px !important;
      &:focus {
        box-shadow: none;
        /* border-radius: 3px !important;
        border: 1px solid #000 !important; */
      }
    }
  `}
`;

export const RateWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const UploadWrapper = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed grey;
  p {
    margin-bottom: 0;
  }
`;

export const UploadHolder = styled.aside`
  p {
    margin-bottom: 0;
    font-weight: 600;
    height: 25px;
  }
  ul {
    margin-bottom: 0;
  }
`;

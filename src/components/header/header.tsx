import * as React from 'react';
import './header.css';
import { ProtectPopup } from "./protect-poppup";
import {useDispatch, useSelector} from "react-redux";
import { setPopupState } from "@store";
import {IAppState} from "@types";


export const Header = () => {
  const { popup } = useSelector((state: IAppState) => state);

  const dispatch = useDispatch();
  const showPopup = () => dispatch(setPopupState());

  return <header className='header'>
    <h1 className="header__title">COVID-19 Dashboard</h1>
    <span className={`header__btn-popup ${popup ? 'visually-hidden' : null}`} onClick={showPopup}>How to protect?</span>
    {popup ?
      <ProtectPopup />
      : null}
  </header>
}

import * as React from 'react';
import './footer.css';
import githubIcon from './image/github-icon.svg'
import RSSIcon from './image/rs_school_js.svg'

export const Footer = () => {
  return <footer className='footer'>
    <div className="footer__row">

      <a href="https://github.com/ryabykhms" className="footer__link-git footer__link">
        <p className="footer__text">Ryabykhms</p>
        <img src={githubIcon} alt="github icon" width="30" />
      </a>

      <a href="https://rs.school/js/" className="footer__link-rss footer__link">
        <img src={RSSIcon} alt="rs school" width="75" />
      </a>

      <a href="https://github.com/SonKn1ght" className="footer__link-git footer__link">
        <img src={githubIcon} alt="github icon" width="30" />
        <p className="footer__text">SonKn1ght</p>
      </a>

    </div>
    <p className="footer__text footer__date">2020</p>
  </footer>
}

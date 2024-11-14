import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const Sidebar = (): JSX.Element => {
  const location = useLocation();
  const [isToggled, setIsToggled] = useState(window.innerWidth < 600);

  return (
    <div className={`${styles.sidebar} ${isToggled ? styles.collapsed : ''}`}>
      <div
        className={styles.toggler}
        onClick={() => {
          setIsToggled((toggled) => !toggled);
        }}
      ></div>
      <img className={styles.logoImage} src="/logo.svg" alt="Baseline" />
      <div className={styles.spacer} />

      <div className={styles.links}>
        <Link
          to="/chat"
          className={`${styles.link} ${
            location.pathname === '/chat' ? styles.active : ''
          }`}
        >
          <img
            src="/icons/chat-menu.svg"
            alt="Home"
            style={{ fill: '#FD7E14', color: '#FD7E14' }}
          />
          <span>Chat</span>
        </Link>
      </div>
      <div className={styles.linksBottom}>
        <Link
          to="/subscription"
          className={`${styles.link} ${
            location.pathname === '/subscription' ? styles.active : ''
          }`}
          style={{ pointerEvents: 'none', opacity: 0.5 }}
        >
          <img src="/icons/users-menu.svg" alt="Subscription" />
          <span>Subscription</span>
        </Link>
        <Link
          to="/settings"
          className={`${styles.link} ${
            location.pathname === '/settings' ? styles.active : ''
          }`}
        >
          <img src="/icons/settings.svg" alt="Settings" />
          <span>Account Settings</span>
        </Link>

        <div
          className={styles.spacer}
          style={{ borderBottom: 'solid 1px', borderColor: '#EAEAEA' }}
        />

        <div className={styles.externalLinks}>
          <a
            href="https://discord.gg/beCj9VDeMm"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/icons/discord-orange.svg" alt="Discord" />
          </a>
          <a
            href="https://github.com/Baseline-JS/core"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/icons/github-orange.svg" alt="GitHub" />
          </a>
          <a
            href="https://www.youtube.com/@Baseline-JS"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/icons/youtube-orange.svg" alt="YouTube" />
          </a>
          <a
            href="https://www.linkedin.com/company/baselinejs/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/icons/linkedin-orange.svg" alt="LinkedIn" />
          </a>
          <a href="https://baselinejs.com" target="_blank" rel="noreferrer">
            <img src="/icons/website-orange.svg" alt="BaselineJS" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

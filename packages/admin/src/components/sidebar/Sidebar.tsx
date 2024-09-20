import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const Sidebar = (): JSX.Element => {
  const location = useLocation();
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 400) {
      setIsToggled(true);
    }
  }, []);

  return (
    <div className={`${styles.sidebar} ${isToggled ? styles.collapsed : ''}`}>
      <div
        className={styles.toggler}
        onClick={() => {
          setIsToggled((toggled) => !toggled);
        }}
      ></div>
      <img src="/logo.svg" alt="Baseline" />
      <div className={styles.spacer} />

      <div className={styles.links}>
        <Link
          to="/chat"
          className={`${styles.link} ${
            location.pathname === '/chat' ? styles.active : ''
          }`}
        >
          <img src="/icons/home.svg" alt="Home" />
          <span>Chat</span>
        </Link>

        <div className={styles.spacer} />

        <div className={styles.spacer} />

        <Link
          to="/subscription"
          className={`${styles.link} ${
            location.pathname === '/subscription' ? styles.active : ''
          }`}
        >
          <img src="/icons/users.svg" alt="Subscription" />
          <span>Subscription</span>
        </Link>

        <Link
          to="/settings"
          className={`${styles.link} ${
            location.pathname === '/settings' ? styles.active : ''
          }`}
        >
          <img src="/icons/gear.svg" alt="Settings" />
          <span>Account Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

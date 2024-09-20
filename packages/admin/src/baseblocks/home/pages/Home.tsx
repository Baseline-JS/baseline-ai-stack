import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.scss';

function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <img src="/logo.svg" alt="Baseline" />
        <Link to="/chat">Login</Link>
      </div>
    </div>
  );
}
export default Home;

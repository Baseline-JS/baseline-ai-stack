import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import styles from './Login.module.scss';

function Login() {
  return (
    <div className={styles.login}>
      <div className={styles.content}>
        <img src="/logo.svg" alt="Baseline" className={styles.logo} />
        <Authenticator />
      </div>
    </div>
  );
}
export default Login;

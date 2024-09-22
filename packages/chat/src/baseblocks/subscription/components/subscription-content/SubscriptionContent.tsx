import React from 'react';
import styles from './SubscriptionContent.module.scss';

const SubscriptionContent = (): JSX.Element => {
  return (
    <div className={styles.subscriptionContent}>
      <div className={styles.list}>
        <div className={styles.header}>
          <div className={styles.userCount}></div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionContent;

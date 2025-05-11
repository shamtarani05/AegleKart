import React from 'react';
import { RefreshCw } from 'lucide-react';
import styles from '../../styles/commonComponents.module.css';

const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <div className={styles.loadingContainer}>
      <RefreshCw className={styles.loadingIcon} size={40} />
      <p>{message}</p>
    </div>
  );
};

export default LoadingState;

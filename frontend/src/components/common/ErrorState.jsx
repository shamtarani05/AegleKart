import React from 'react';
import { RefreshCw } from 'lucide-react';
import styles from '../../styles/commonComponents.module.css';

const ErrorState = ({ error = 'Something went wrong', onRetry }) => {
  return (
    <div className={styles.errorContainer}>
      <h2>Something went wrong</h2>
      <p>{error}</p>
      {onRetry && (
        <button className={styles.refreshButton} onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;

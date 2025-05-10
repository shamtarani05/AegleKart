import React from 'react';
import { TrendingUp } from 'lucide-react';
import styles from '../../styles/adminDashboard.module.css';

const StatCard = ({ icon, title, value, trend, iconClassName }) => {
  return (
    <div className={styles.statCard}>
      <div className={`${styles.statIconWrapper} ${iconClassName || ''}`}>
        {icon}
      </div>
      <div className={styles.statContent}>
        <h3>{title}</h3>
        <p className={styles.statValue}>{value}</p>
        {trend && (
          <p className={styles.statTrend}>
            {trend.icon || <TrendingUp size={16} className={styles.trendUpIcon} />}
            <span>{trend.text}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;

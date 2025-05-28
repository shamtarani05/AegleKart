import React, { useEffect, useState } from 'react';
import styles from '../../styles/adminDashboard.module.css';

const SalesChart = ({ data }) => {
  // State to control the animation of each bar
  const [animatedBars, setAnimatedBars] = useState(data.map(() => false));
  
  // Find the maximum revenue for proper scaling
  const maxRevenue = Math.max(...data.map(item => item.revenue));
  
  useEffect(() => {
    // Trigger animation for each bar with slight delay between them
    const animationTimers = [];
    
    data.forEach((_, index) => {
      const timer = setTimeout(() => {
        setAnimatedBars(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, 100 * index);
      
      animationTimers.push(timer);
    });
    
    return () => {
      // Clean up timers
      animationTimers.forEach(timer => clearTimeout(timer));
    };
  }, [data]);

  return (
    <div className={`${styles.chartCard} ${styles.salesChart}`}>
      <h3>Monthly Sales Revenue</h3>
      <div className={styles.chartContainer}>
        {/* Y-axis labels */}
        <div className={styles.yAxis}>
          {[4, 3, 2, 1, 0].map((i) => (
            <div key={i} className={styles.yAxisLabel}>
              PKR {Math.round((maxRevenue * i) / 4).toLocaleString()}
            </div>
          ))}
        </div>
        
        {/* Chart area with grid lines */}
        <div className={styles.chartArea}>
          {/* Grid lines */}
          <div className={styles.gridLines}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.gridLine}></div>
            ))}
          </div>
          
          {/* Bar groups */}
          <div className={styles.barGroups}>
            {data.map((item, index) => {
              // Calculate height percentage based on the value
              const heightPercent = (item.revenue / maxRevenue) * 100;
              
              return (
                <div key={index} className={styles.barGroup}>
                  {/* Value label */}
                  <div className={styles.valueLabel}>
                    {item.revenue.toLocaleString()}
                  </div>
                  
                  {/* Bar */}
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.bar}
                      style={{
                        height: animatedBars[index] ? `${heightPercent}%` : '0%',
                        backgroundColor: '#4e6af3'
                      }}
                    ></div>
                  </div>
                  
                  {/* Month label */}
                  <div className={styles.barLabel}>{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;

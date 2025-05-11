import React, { useState, useEffect } from 'react';
import styles from '../../styles/adminDashboard.module.css';

const ProductPieChart = ({ data }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  // Ensure we have properly structured data with all required fields
  const processCategories = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      // Default fallback data if none provided
      return [
        { name: 'Painkillers', color: '#4e6af3', value: 40 },
        { name: 'Antibiotics', color: '#10ca93', value: 25 },
        { name: 'Vitamins', color: '#f39c12', value: 20 },
        { name: 'Others', color: '#9b59b6', value: 15 }
      ];
    }
    
    // Normalize data to ensure values add up to 100%
    const totalValue = data.reduce((sum, category) => sum + (category.value || 0), 0);
    
    return data.map((category, index) => ({
      name: category.name || `Category ${index + 1}`,
      color: category.color || getDefaultColor(index),
      value: totalValue > 0 ? Math.round((category.value / totalValue) * 100) : 0
    }));
  };
  
  // Default colors if not provided in the data
  const getDefaultColor = (index) => {
    const colors = ['#4e6af3', '#10ca93', '#f39c12', '#9b59b6', '#e74c3c', '#3498db'];
    return colors[index % colors.length];
  };
  
  const categories = processCategories();
  
  // Define circumference at component level so it's available everywhere
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Add slight delay before animation starts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate the stroke-dasharray and stroke-dashoffset for each segment
  const calculateSegmentStyles = (startPercent, endPercent) => {
    // Calculate the segment length as a percentage of the circumference
    const segmentLength = ((endPercent - startPercent) / 100) * circumference;
    
    // Calculate the dasharray and dashoffset
    const dashArray = `${segmentLength} ${circumference - segmentLength}`;
    const dashOffset = -(startPercent / 100) * circumference;
    
    return { dashArray, dashOffset };
  };

  return (
    <div className={`${styles.chartCard} ${styles.productChart}`}>
      <h3>Top Selling Categories</h3>
      {categories.length === 0 ? (
        <div className={styles.noDataMessage}>No category data available</div>
      ) : (
        <div className={styles.pieChartContainer}>
          <div className={styles.pieChartWrapper}>
            <div className={styles.svgContainer}>
              <svg viewBox="0 0 200 200" className={styles.pieChartSvg}>
                {/* Background circle */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  fill="transparent" 
                  stroke="#f0f0f0" 
                  strokeWidth="30" 
                />
                
                {/* Calculate running total for segments */}
                {categories.map((category, index) => {
                  const startPercent = categories
                    .slice(0, index)
                    .reduce((acc, cat) => acc + cat.value, 0);
                  const endPercent = startPercent + category.value;
                  
                  const { dashArray, dashOffset } = calculateSegmentStyles(startPercent, endPercent);
                  
                  return (
                    <circle 
                      key={index}
                      cx="100" 
                      cy="100" 
                      r="80" 
                      fill="transparent" 
                      stroke={category.color} 
                      strokeWidth="30" 
                      strokeDasharray={dashArray}
                      strokeDashoffset={isAnimated ? dashOffset : circumference}
                      className={styles.pieSegment}
                      style={{
                        transition: `stroke-dashoffset 1s ease-in-out ${index * 0.2}s`
                      }}
                    />
                  );
                })}
                
                {/* Center circle for donut effect */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r="50" 
                  fill="white" 
                />
              </svg>
            </div>
          </div>
          
          <div className={styles.pieLegend}>
            {categories.map((category, index) => (
              <div key={index} className={`${styles.legendItem} ${isAnimated ? styles.fadeIn : ''}`}
                  style={{ animationDelay: `${0.5 + index * 0.15}s` }}>
                <span 
                  className={styles.legendColorBox} 
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className={styles.legendText}>
                  {category.name} ({category.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPieChart;

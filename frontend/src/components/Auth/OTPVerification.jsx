import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/auth.module.css';

const OTPVerification = ({ email, phone, onBackClick, onVerificationComplete }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  
  // Setup references for OTP inputs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);
  
  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (timer > 0 && resendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, resendDisabled]);
  
  // Handle OTP input changes
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow single digit
    if (value && !/^\d{1}$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle backspace key
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Handle paste for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 4 digit number
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus last input
      inputRefs.current[3].focus();
    }
  };
  
  // Handle OTP resend
  const handleResendOTP = () => {
    // Reset timer and disable button
    setTimer(30);
    setResendDisabled(true);
    
    // Here you would implement actual API call to resend OTP
    console.log('Resending OTP to:', email || phone);
    
    // Clear any previous errors
    setError('');
  };
  
  // Handle OTP verification
  const handleVerify = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      setError('Please enter the complete 4-digit OTP');
      return;
    }
    
    setIsVerifying(true);
    
    // Here you would implement actual API call to verify OTP
    console.log('Verifying OTP:', otpValue);
    
    // Mock successful verification
    setTimeout(() => {
      setIsVerifying(false);
      onVerificationComplete();
    }, 1000);
  };
  
  const contactMethod = email ? email : phone;
  const contactType = email ? 'email' : 'phone';

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authContent}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Verify Your Account</h2>
            <p className={styles.formSubtitle}>
              Enter the 4-digit code sent to your {contactType}:
              <br />
              <strong>{contactMethod}</strong>
            </p>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => inputRefs.current[index] = ref}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : null}
                  className={styles.otpInput}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            {/* Only this button is centered */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button 
                onClick={handleVerify} 
                className={styles.submitButton}
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>
            
            <div className={styles.resendContainer}>
              {resendDisabled ? (
                <p className={styles.timerText}>Resend code in {timer}s</p>
              ) : (
                <button onClick={handleResendOTP} className={styles.resendBtn}>
                  Resend Code
                </button>
              )}
            </div>
            
            <button 
              onClick={onBackClick} 
              className={styles.secondaryButton}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
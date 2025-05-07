import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/auth.module.css';
import useAuthStore from '../../stores/auth-store';

const OTPVerification = ({ onBackClick, onVerificationComplete }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  const user = useAuthStore((state) => state.user);
  const clearuser = useAuthStore((state) => state.clearUser);

  const contactMethod = user?.email;
  const contactType = user?.email ? 'email' : 'phone';

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0 && resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, resendDisabled]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setError('');
    console.log('Verifying OTP:', otpValue, contactMethod);

    try {
      const response = await fetch('http://localhost:3000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpValue, contact: contactMethod }),
      });

      const result = await response.json();

      if (response.ok) {
        onVerificationComplete();
        clearuser();
        console.log('OTP verified successfully:', result);
      } else {
        setError(result.message || 'Verification failed.');
        setResendDisabled(false);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setResendDisabled(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {

    setTimer(300); // Reset to 5 minutes
    setResendDisabled(true);
    setError('');

    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact: contactMethod }), // make sure this matches your backend
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Resend OTP request sent successfully:', result);
      setOtp(['', '', '', '', '', '']);
      setResendDisabled(true);
      return;
    }
    setError(result.message || 'Failed to resend OTP.');
    setResendDisabled(false);

  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authContent}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Verify Your Account</h2>
            <p className={styles.formSubtitle}>
              Enter the 6-digit code sent to your {contactType}: <br />
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
                <p className={styles.timerText}>Resend code in {formatTime(timer)}</p>
              ) : (
                <button onClick={handleResendOTP} className={styles.resendBtn}>
                  Resend Code
                </button>
              )}
            </div>

            <button onClick={onBackClick} className={styles.secondaryButton}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;

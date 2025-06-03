import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
}

const OTP: React.FC<OTPInputProps> = ({ length = 6, onComplete, disabled = false }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value; 
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newOtp.every(digit => digit !== '')) {
      onComplete?.(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, length);
    if (!/^[0-9]+$/.test(pasted)) return;
    const newOtp = pasted.split('');
    setOtp([...newOtp, ...Array(length - newOtp.length).fill('')]);
    if (newOtp.length === length) {
      onComplete?.(newOtp.join(''));
    }
    inputRefs.current[Math.min(newOtp.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center mb-2">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={el => inputRefs.current[idx] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(idx, e.target.value)}
          onKeyDown={e => handleKeyDown(idx, e)}
          onPaste={idx === 0 ? handlePaste : undefined}
          className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg
            focus:border-bizblue-500 focus:ring-2 focus:ring-bizblue-200
            transition-colors duration-200 outline-none"
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default OTP;

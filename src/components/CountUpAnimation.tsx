import { useState, useEffect } from 'react';

interface CountUpAnimationProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  formatAs?: 'number' | 'currency' | 'thousands' | 'lakhs';
}

const CountUpAnimation: React.FC<CountUpAnimationProps> = ({
  end,
  duration = 3000,
  suffix = '',
  prefix = '',
  className = '',
  formatAs = 'number'
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  const formatNumber = (num: number): string => {
    switch (formatAs) {
      case 'currency':
        return num.toLocaleString('en-IN');
      case 'thousands':
        return (num / 1000).toLocaleString();
      case 'lakhs':
        return (num / 100000).toLocaleString();
      default:
        return num.toLocaleString();
    }
  };

  return (
    <span className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default CountUpAnimation;

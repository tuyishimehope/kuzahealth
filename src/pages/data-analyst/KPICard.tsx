import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Avatar,
  Chip,
  Fade,
  Grow,
  useTheme,
  alpha,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { keyframes } from '@mui/system';

// Define color mapping for better type safety and consistency
const colorMap = {
  primary: '#7c3aed',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// Animation keyframes
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4);
  }
  70% {
    transform: scale(1.02);
    box-shadow: 0 0 0 10px rgba(124, 58, 237, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const counterAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Animated Counter Component
const AnimatedCounter: React.FC<{
  value: string | number;
  duration?: number;
}> = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState<string | number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    
    // Handle numeric values for animation
    if (typeof value === 'number') {
      const start = 0;
      const end = value;
      const startTime = Date.now();
      
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        setDisplayValue(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      animate();
    } else {
      // For string values, just set directly with delay
      setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 300);
    }
  }, [value, duration]);

  return (
    <Box
      sx={{
        animation: isAnimating ? `${counterAnimation} 0.3s ease-out` : 'none',
      }}
    >
      {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
    </Box>
  );
};

interface KPICardProps {
  title: string;
  value: string | number;
  change?: { 
    value: number; 
    isUp: boolean;
    period?: string; // e.g., "vs last month"
  };
  icon: React.ReactNode;
  color?: keyof typeof colorMap;
  loading?: boolean;
  subtitle?: string;
  onClick?: () => void;
  'aria-label'?: string;
  'data-testid'?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'primary',
  loading = false,
  subtitle,
  onClick,
  'aria-label': ariaLabel,
  'data-testid': testId,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const cardColor = colorMap[color];
  const cardColorAlpha = alpha(cardColor, 0.1);
  const cardColorAlpha20 = alpha(cardColor, 0.2);

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Grow
      in={isLoaded}
      timeout={500}
      style={{ transformOrigin: 'center bottom' }}
    >
      <Card
        elevation={0}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : -1}
        role={onClick ? 'button' : 'article'}
        aria-label={ariaLabel || `${title}: ${value}`}
        data-testid={testId}
        sx={{
          height: '100%',
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          border: `1px solid ${alpha(cardColor, 0.2)}`,
          background: `linear-gradient(135deg, ${cardColorAlpha} 0%, ${alpha(cardColor, 0.05)} 100%)`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: isHovered
            ? `0 12px 40px ${alpha(cardColor, 0.25)}, 0 0 0 1px ${alpha(cardColor, 0.3)}`
            : `0 2px 12px ${alpha(cardColor, 0.08)}`,
          animation: loading ? `${pulseAnimation} 2s infinite` : 'none',
          '&:focus-visible': {
            outline: `2px solid ${cardColor}`,
            outlineOffset: '2px',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${cardColor}, ${alpha(cardColor, 0.7)})`,
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0.3)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: `radial-gradient(circle at 80% 20%, ${alpha(cardColor, 0.1)} 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          },
        }}
      >
        <CardContent
          sx={{
            p: 3,
            pb: '24px !important',
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header with Icon */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Box flex={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  mb: 0.5,
                }}
                component="h3"
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    opacity: 0.7,
                    animation: `${slideUp} 0.5s ease 0.2s both`,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: cardColor,
                transform: isHovered ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isHovered
                  ? `0 8px 25px ${alpha(cardColor, 0.4)}`
                  : `0 4px 12px ${alpha(cardColor, 0.2)}`,
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem',
                  color: 'white',
                },
              }}
            >
              {icon}
            </Avatar>
          </Stack>

          {/* Value */}
          <Box mb={2} flex={1}>
            <Typography
              variant="h3"
              component="p"
              sx={{
                fontWeight: 800,
                color: cardColor,
                lineHeight: 1,
                fontFamily: '"Inter", "Roboto", sans-serif',
                animation: `${slideUp} 0.6s ease 0.1s both`,
              }}
            >
              <AnimatedCounter value={value} />
            </Typography>
          </Box>

          {/* Change Indicator */}
          {change && (
            <Fade in timeout={800}>
              <Box>
                <Chip
                  icon={
                    change.isUp ? (
                      <TrendingUpIcon fontSize="small" />
                    ) : (
                      <TrendingDownIcon fontSize="small" />
                    )
                  }
                  label={
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography variant="body2" fontWeight="bold">
                        {change.value.toFixed(1)}%
                      </Typography>
                      {change.period && (
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {change.period}
                        </Typography>
                      )}
                    </Stack>
                  }
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: change.isUp
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.error.main, 0.1),
                    borderColor: change.isUp
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    color: change.isUp
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: 'inherit',
                    },
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Box>
            </Fade>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent, ${cardColorAlpha20}, transparent)`,
                animation: `${pulseAnimation} 1.5s infinite`,
              }}
            />
          )}
        </CardContent>
      </Card>
    </Grow>
  );
};

export default KPICard;
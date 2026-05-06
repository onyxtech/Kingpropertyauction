const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const getTimestamp = () => {
  return new Date().toISOString();
};

export const logger = {
  info: (message) => {
    console.log(`${colors.cyan}[${getTimestamp()}] ℹ️  INFO:${colors.reset} ${message}`);
  },
  success: (message) => {
    console.log(`${colors.green}[${getTimestamp()}] ✅ SUCCESS:${colors.reset} ${message}`);
  },
  warn: (message) => {
    console.log(`${colors.yellow}[${getTimestamp()}] ⚠️  WARN:${colors.reset} ${message}`);
  },
  error: (message) => {
    console.error(`${colors.red}[${getTimestamp()}] ❌ ERROR:${colors.reset} ${message}`);
  },
};

// Request logger middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? colors.red : res.statusCode >= 300 ? colors.yellow : colors.green;

    console.log(
      `${colors.magenta}[${getTimestamp()}]${colors.reset} ` +
        `${statusColor}${res.statusCode}${colors.reset} ` +
        `${colors.blue}${req.method}${colors.reset} ` +
        `${req.originalUrl} ` +
        `${colors.cyan}${duration}ms${colors.reset}`
    );
  });

  next();
};
/**
 * Logger Utility
 * Handles all logging operations with color coding and timestamp
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor() {
    this.logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  }

  /**
   * Get formatted timestamp
   */
  getTimestamp() {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  /**
   * Write to log file
   */
  writeToFile(level, message) {
    const timestamp = this.getTimestamp();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    try {
      fs.appendFileSync(this.logFile, logMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Log info message
   */
  info(message) {
    const timestamp = this.getTimestamp();
    console.log(chalk.blue(`[${timestamp}] [INFO] ${message}`));
    this.writeToFile('INFO', message);
  }

  /**
   * Log success message
   */
  success(message) {
    const timestamp = this.getTimestamp();
    console.log(chalk.green(`[${timestamp}] [SUCCESS] ${message}`));
    this.writeToFile('SUCCESS', message);
  }

  /**
   * Log warning message
   */
  warn(message) {
    const timestamp = this.getTimestamp();
    console.warn(chalk.yellow(`[${timestamp}] [WARN] ${message}`));
    this.writeToFile('WARN', message);
  }

  /**
   * Log error message
   */
  error(message) {
    const timestamp = this.getTimestamp();
    console.error(chalk.red(`[${timestamp}] [ERROR] ${message}`));
    this.writeToFile('ERROR', message);
  }

  /**
   * Log debug message (only in development)
   */
  debug(message) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = this.getTimestamp();
      console.log(chalk.magenta(`[${timestamp}] [DEBUG] ${message}`));
      this.writeToFile('DEBUG', message);
    }
  }

  /**
   * Log command execution
   */
  command(userId, username, command, status = 'executed') {
    const message = `Command: ${command} | User: ${username} (${userId}) | Status: ${status}`;
    console.log(chalk.cyan(`[${this.getTimestamp()}] [COMMAND] ${message}`));
    this.writeToFile('COMMAND', message);
  }

  /**
   * Log interaction
   */
  interaction(userId, type, name, status = 'processed') {
    const message = `Interaction: ${type} | Name: ${name} | User: ${userId} | Status: ${status}`;
    this.info(message);
  }
}

export default Logger;

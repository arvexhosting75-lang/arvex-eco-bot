/**
 * Database Connection Manager
 * Handles MongoDB connection and pool management
 */

import mongoose from 'mongoose';
import Logger from './Logger.js';

const logger = new Logger();

class Database {
  /**
   * Connect to MongoDB with retry logic
   */
  static async connect(retries = 5) {
    try {
      if (mongoose.connection.readyState === 1) {
        logger.info('MongoDB already connected');
        return mongoose.connection;
      }

      const options = {
        maxPoolSize: 10,
        minPoolSize: 5,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        w: 'majority',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      await mongoose.connect(process.env.MONGODB_URI, options);
      logger.success('✅ MongoDB connected successfully');

      // Set up event listeners
      mongoose.connection.on('error', (error) => {
        logger.error(`MongoDB connection error: ${error.message}`);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      return mongoose.connection;
    } catch (error) {
      if (retries > 0) {
        logger.warn(`MongoDB connection failed, retrying... (${6 - retries}/5)`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.connect(retries - 1);
      }

      logger.error(`Failed to connect to MongoDB: ${error.message}`);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  static async disconnect() {
    try {
      if (mongoose.connection.readyState === 0) {
        logger.info('MongoDB already disconnected');
        return;
      }

      await mongoose.disconnect();
      logger.success('✅ MongoDB disconnected successfully');
    } catch (error) {
      logger.error(`Failed to disconnect from MongoDB: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get connection status
   */
  static getStatus() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    return states[mongoose.connection.readyState] || 'unknown';
  }

  /**
   * Get connection info
   */
  static getInfo() {
    return {
      status: this.getStatus(),
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      database: mongoose.connection.name,
    };
  }
}

export default Database;

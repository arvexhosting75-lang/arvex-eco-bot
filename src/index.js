/**
 * ArveX Eco Bot - Main Entry Point
 * Enterprise-grade Discord bot for ArveX Hosting™
 * @author ArveX Development Team
 * @version 1.0.0
 */

import { Client, GatewayIntentBits, ChannelType, Collection } from 'discord.js';
import dotenv from 'dotenv';
import chalk from 'chalk';
import Logger from './utils/Logger.js';
import Database from './utils/Database.js';
import CommandHandler from './utils/CommandHandler.js';
import EventHandler from './utils/EventHandler.js';
import ErrorHandler from './utils/ErrorHandler.js';

// Load environment variables
dotenv.config();

// Initialize logger
const logger = new Logger();

// Validate required environment variables
const requiredEnvs = ['BOT_TOKEN', 'MONGODB_URI', 'CLIENT_ID'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

if (missingEnvs.length > 0) {
  logger.error(`Missing environment variables: ${missingEnvs.join(', ')}`);
  process.exit(1);
}

// Initialize Discord Client with optimized intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.VoiceStates,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildModeration,
  ],
  allowedMentions: { parse: ['users', 'roles'] },
  sweepers: {
    messages: {
      interval: 3600,
      lifetime: 1800,
    },
  },
});

// Initialize Collections for storing commands and cooldowns
client.commands = new Collection();
client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

// Global error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  ErrorHandler.logError('UNHANDLED_REJECTION', reason);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  ErrorHandler.logError('UNCAUGHT_EXCEPTION', error);
  process.exit(1);
});

// Initialize bot
async function initialize() {
  try {
    logger.info('🚀 ArveX Bot initializing...');

    // Connect to MongoDB
    logger.info('📡 Connecting to MongoDB...');
    await Database.connect();
    logger.success('✅ MongoDB connected');

    // Load command handlers
    logger.info('📂 Loading command handlers...');
    await CommandHandler.loadCommands(client);
    logger.success(`✅ Loaded ${client.prefixCommands.size} prefix commands and ${client.slashCommands.size} slash commands`);

    // Load event handlers
    logger.info('📂 Loading event handlers...');
    await EventHandler.loadEvents(client);
    logger.success('✅ Event handlers loaded');

    // Login to Discord
    logger.info('🔐 Logging into Discord...');
    await client.login(process.env.BOT_TOKEN);
    logger.success('✅ Successfully logged into Discord');
  } catch (error) {
    logger.error(`Failed to initialize bot: ${error.message}`);
    ErrorHandler.logError('BOT_INIT_ERROR', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.warn('⏸️  Received SIGINT, gracefully shutting down...');
  try {
    await Database.disconnect();
    await client.destroy();
    logger.success('✅ Bot shut down successfully');
    process.exit(0);
  } catch (error) {
    logger.error(`Error during shutdown: ${error.message}`);
    process.exit(1);
  }
});

// Start the bot
initialize();

export default client;

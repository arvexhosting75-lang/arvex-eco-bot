/**
 * Command Handler
 * Loads and manages all prefix and slash commands
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from './Logger.js';

const logger = new Logger();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CommandHandler {
  /**
   * Load all commands from directories
   */
  static async loadCommands(client) {
    try {
      const commandsPath = path.join(__dirname, '../commands');

      // Load prefix commands
      await this.loadPrefixCommands(client, commandsPath);

      // Load slash commands
      await this.loadSlashCommands(client, commandsPath);

      return {
        prefixCommands: client.prefixCommands.size,
        slashCommands: client.slashCommands.size,
      };
    } catch (error) {
      logger.error(`Error loading commands: ${error.message}`);
      throw error;
    }
  }

  /**
   * Load prefix commands
   */
  static async loadPrefixCommands(client, commandsPath) {
    try {
      const prefixPath = path.join(commandsPath, 'prefix');

      if (!fs.existsSync(prefixPath)) {
        logger.warn('Prefix commands directory not found');
        return;
      }

      const categories = fs.readdirSync(prefixPath);

      for (const category of categories) {
        const categoryPath = path.join(prefixPath, category);
        const stat = fs.statSync(categoryPath);

        if (!stat.isDirectory()) continue;

        const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

        for (const file of files) {
          try {
            const filePath = path.join(categoryPath, file);
            const command = await import(`file://${filePath}`);
            const commandData = command.default || command;

            if (!commandData.name) {
              logger.warn(`Command file ${file} has no name property`);
              continue;
            }

            client.prefixCommands.set(commandData.name, commandData);

            // Add aliases
            if (commandData.aliases && Array.isArray(commandData.aliases)) {
              commandData.aliases.forEach(alias => {
                client.prefixCommands.set(alias, commandData);
              });
            }
          } catch (error) {
            logger.error(`Error loading prefix command ${file}: ${error.message}`);
          }
        }
      }

      logger.info(`✅ Loaded ${client.prefixCommands.size} prefix commands`);
    } catch (error) {
      logger.error(`Error loading prefix commands: ${error.message}`);
    }
  }

  /**
   * Load slash commands
   */
  static async loadSlashCommands(client, commandsPath) {
    try {
      const slashPath = path.join(commandsPath, 'slash');

      if (!fs.existsSync(slashPath)) {
        logger.warn('Slash commands directory not found');
        return;
      }

      const categories = fs.readdirSync(slashPath);
      const slashCommandsArray = [];

      for (const category of categories) {
        const categoryPath = path.join(slashPath, category);
        const stat = fs.statSync(categoryPath);

        if (!stat.isDirectory()) continue;

        const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

        for (const file of files) {
          try {
            const filePath = path.join(categoryPath, file);
            const command = await import(`file://${filePath}`);
            const commandData = command.default || command;

            if (!commandData.data || !commandData.data.name) {
              logger.warn(`Slash command file ${file} has invalid data property`);
              continue;
            }

            client.slashCommands.set(commandData.data.name, commandData);
            slashCommandsArray.push(commandData.data.toJSON());
          } catch (error) {
            logger.error(`Error loading slash command ${file}: ${error.message}`);
          }
        }
      }

      logger.info(`✅ Loaded ${client.slashCommands.size} slash commands`);

      // Register slash commands
      if (client.application && slashCommandsArray.length > 0) {
        await this.registerSlashCommands(client, slashCommandsArray);
      }
    } catch (error) {
      logger.error(`Error loading slash commands: ${error.message}`);
    }
  }

  /**
   * Register slash commands with Discord
   */
  static async registerSlashCommands(client, commands) {
    try {
      if (!client.user || !client.application) {
        logger.warn('Client not fully ready for command registration');
        return;
      }

      const guildId = process.env.GUILD_ID;

      if (guildId) {
        // Register to specific guild (faster for development)
        const guild = await client.guilds.fetch(guildId);
        await guild.commands.set(commands);
        logger.success(`✅ Registered ${commands.length} slash commands to guild`);
      } else {
        // Register globally (takes up to 1 hour)
        await client.application.commands.set(commands);
        logger.success(`✅ Registered ${commands.length} slash commands globally`);
      }
    } catch (error) {
      logger.error(`Error registering slash commands: ${error.message}`);
    }
  }
}

export default CommandHandler;

/**
 * Error Handler
 * Centralized error handling and logging
 */

import axios from 'axios';
import Logger from './Logger.js';

const logger = new Logger();

class ErrorHandler {
  /**
   * Log error to webhook and file
   */
  static async logError(errorType, error, context = {}) {
    try {
      const errorData = {
        type: errorType,
        message: error?.message || String(error),
        stack: error?.stack || null,
        timestamp: new Date().toISOString(),
        context,
      };

      // Log to file
      logger.error(`${errorType}: ${error?.message || String(error)}`);

      // Log to webhook if configured
      if (process.env.LOG_WEBHOOK) {
        await this.sendWebhook(errorData);
      }

      return errorData;
    } catch (err) {
      logger.error(`Failed to log error: ${err.message}`);
    }
  }

  /**
   * Send error to Discord webhook
   */
  static async sendWebhook(errorData) {
    try {
      if (!process.env.LOG_WEBHOOK) return;

      const embed = {
        color: 0xff0000,
        title: `🚨 ${errorData.type}`,
        description: `\`\`\`\n${errorData.message}\n\`\`\``,
        fields: [
          {
            name: 'Timestamp',
            value: errorData.timestamp,
            inline: true,
          },
          {
            name: 'Environment',
            value: process.env.NODE_ENV || 'unknown',
            inline: true,
          },
        ],
        footer: {
          text: 'ArveX Bot Error Logger',
          icon_url: 'https://www.arvexhosting.com/logo.png',
        },
      };

      if (errorData.stack) {
        const stackTruncated = errorData.stack.substring(0, 1024);
        embed.fields.push({
          name: 'Stack Trace',
          value: `\`\`\`${stackTruncated}\`\`\``,
        });
      }

      await axios.post(process.env.LOG_WEBHOOK, {
        embeds: [embed],
      });
    } catch (error) {
      logger.warn(`Failed to send webhook: ${error.message}`);
    }
  }

  /**
   * Handle command error
   */
  static async handleCommandError(error, interaction, command) {
    try {
      await this.logError('COMMAND_ERROR', error, {
        command: command?.name,
        userId: interaction?.user?.id,
        guildId: interaction?.guild?.id,
      });

      const errorMessage = 'An error occurred while executing this command. The error has been reported.';

      if (interaction.isRepliable()) {
        if (interaction.replied) {
          await interaction.followUp({
            content: errorMessage,
            ephemeral: true,
          }).catch(() => {});
        } else {
          await interaction.reply({
            content: errorMessage,
            ephemeral: true,
          }).catch(() => {});
        }
      }
    } catch (err) {
      logger.error(`Failed to handle command error: ${err.message}`);
    }
  }
}

export default ErrorHandler;

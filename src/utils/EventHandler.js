/**
 * Event Handler
 * Loads and manages all event listeners
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from './Logger.js';

const logger = new Logger();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EventHandler {
  /**
   * Load all events from directories
   */
  static async loadEvents(client) {
    try {
      const eventsPath = path.join(__dirname, '../events');

      if (!fs.existsSync(eventsPath)) {
        logger.warn('Events directory not found');
        return;
      }

      const categories = fs.readdirSync(eventsPath);
      let eventCount = 0;

      for (const category of categories) {
        const categoryPath = path.join(eventsPath, category);
        const stat = fs.statSync(categoryPath);

        if (!stat.isDirectory()) continue;

        const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

        for (const file of files) {
          try {
            const filePath = path.join(categoryPath, file);
            const event = await import(`file://${filePath}`);
            const eventData = event.default || event;

            if (!eventData.name) {
              logger.warn(`Event file ${file} has no name property`);
              continue;
            }

            if (eventData.once) {
              client.once(eventData.name, (...args) => eventData.execute(...args, client));
            } else {
              client.on(eventData.name, (...args) => eventData.execute(...args, client));
            }

            eventCount++;
          } catch (error) {
            logger.error(`Error loading event ${file}: ${error.message}`);
          }
        }
      }

      logger.success(`✅ Loaded ${eventCount} events`);
      return eventCount;
    } catch (error) {
      logger.error(`Error loading events: ${error.message}`);
      throw error;
    }
  }
}

export default EventHandler;

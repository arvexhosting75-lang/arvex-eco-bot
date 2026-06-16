/**
 * Professional Embed Builder
 * Creates consistent, professional embeds across the bot
 */

import { EmbedBuilder } from 'discord.js';

class ProfessionalEmbedBuilder {
  /**
   * Create a success embed
   */
  static success(title, description, data = {}) {
    return new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle(`✅ ${title}`)
      .setDescription(description)
      .setFooter({ text: 'ArveX Bot', iconURL: 'https://www.arvexhosting.com/logo.png' })
      .setTimestamp()
      .setFields(
        Object.entries(data).map(([name, value]) => ({
          name,
          value: String(value),
          inline: true,
        }))
      );
  }

  /**
   * Create an error embed
   */
  static error(title, description, data = {}) {
    return new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle(`❌ ${title}`)
      .setDescription(description)
      .setFooter({ text: 'ArveX Bot', iconURL: 'https://www.arvexhosting.com/logo.png' })
      .setTimestamp()
      .setFields(
        Object.entries(data).map(([name, value]) => ({
          name,
          value: String(value),
          inline: true,
        }))
      );
  }

  /**
   * Create an info embed
   */
  static info(title, description, data = {}) {
    return new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`ℹ️ ${title}`)
      .setDescription(description)
      .setFooter({ text: 'ArveX Bot', iconURL: 'https://www.arvexhosting.com/logo.png' })
      .setTimestamp()
      .setFields(
        Object.entries(data).map(([name, value]) => ({
          name,
          value: String(value),
          inline: true,
        }))
      );
  }

  /**
   * Create a warning embed
   */
  static warn(title, description, data = {}) {
    return new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle(`⚠️ ${title}`)
      .setDescription(description)
      .setFooter({ text: 'ArveX Bot', iconURL: 'https://www.arvexhosting.com/logo.png' })
      .setTimestamp()
      .setFields(
        Object.entries(data).map(([name, value]) => ({
          name,
          value: String(value),
          inline: true,
        }))
      );
  }

  /**
   * Create a leaderboard embed
   */
  static leaderboard(title, entries, options = {}) {
    const description = entries
      .map((entry, index) => `**${index + 1}.** ${entry.user} - ${entry.value}`)
      .join('\n');

    return new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle(`🏆 ${title}`)
      .setDescription(description || 'No entries yet')
      .setFooter({ text: 'ArveX Bot', iconURL: 'https://www.arvexhosting.com/logo.png' })
      .setTimestamp();
  }

  /**
   * Create a profile embed
   */
  static profile(user, fields = {}) {
    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setAuthor({ name: user.username || user.name, iconURL: user.avatarURL?.() || user.avatar })
      .setThumbnail(user.avatarURL?.() || user.avatar)
      .setFooter({ text: 'ArveX Bot', iconURL: 'https://www.arvexhosting.com/logo.png' })
      .setTimestamp();

    Object.entries(fields).forEach(([name, value]) => {
      embed.addFields({ name, value: String(value), inline: true });
    });

    return embed;
  }

  /**
   * Create a balance embed
   */
  static balance(user, walletCoins, bankCoins) {
    const totalCoins = walletCoins + bankCoins;

    return new EmbedBuilder()
      .setColor(0xf1c40f)
      .setAuthor({ name: `${user.username}'s Wallet`, iconURL: user.avatarURL() })
      .addFields(
        { name: '💰 Wallet', value: `${walletCoins.toLocaleString()} ArveX Coins`, inline: true },
        { name: '🏦 Bank', value: `${bankCoins.toLocaleString()} ArveX Coins`, inline: true },
        { name: '💎 Total', value: `${totalCoins.toLocaleString()} ArveX Coins`, inline: true }
      )
      .setFooter({ text: 'ArveX Bot', iconURL: 'https://www.arvexhosting.com/logo.png' })
      .setTimestamp();
  }
}

export default ProfessionalEmbedBuilder;

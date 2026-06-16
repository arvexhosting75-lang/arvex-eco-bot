/**
 * Leaderboard Command - View top richest users
 * Prefix: ax!leaderboard [economy|level|hosting]
 * Slash: /leaderboard <type>
 */

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';
import ProfessionalEmbedBuilder from '../../utils/EmbedBuilder.js';
import ErrorHandler from '../../utils/ErrorHandler.js';

export const prefixCommand = {
  name: 'leaderboard',
  aliases: ['lb', 'top', 'rankings'],
  description: 'View top users by coins, level, or hosting coins',
  category: 'economy',
  usage: 'ax!leaderboard [economy|level|hosting]',
  cooldown: 5000,

  async execute(message, args, client) {
    try {
      const type = (args[0] || 'economy').toLowerCase();
      const guildId = message.guildId;
      const validTypes = ['economy', 'level', 'hosting'];

      if (!validTypes.includes(type)) {
        const embed = ProfessionalEmbedBuilder.error(
          'Invalid Type',
          `Please use: \`${validTypes.join('`, `')}\``
        );
        return await message.reply({ embeds: [embed] });
      }

      let leaderboardData = [];
      let sort = {};
      let title = '';
      let description = '';

      switch (type) {
        case 'economy':
          sort = { wallet: -1 };
          title = '💰 Economy Leaderboard';
          description = 'Top richest users by wallet coins';
          leaderboardData = await User.find({ guildId })
            .sort(sort)
            .limit(10)
            .select('username wallet');
          break;

        case 'level':
          sort = { level: -1, xp: -1 };
          title = '📊 Level Leaderboard';
          description = 'Top users by level';
          leaderboardData = await User.find({ guildId })
            .sort(sort)
            .limit(10)
            .select('username level xp');
          break;

        case 'hosting':
          sort = { hostingCoins: -1 };
          title = '🖥️ Hosting Coins Leaderboard';
          description = 'Top users by hosting coins';
          leaderboardData = await User.find({ guildId })
            .sort(sort)
            .limit(10)
            .select('username hostingCoins');
          break;
      }

      if (leaderboardData.length === 0) {
        const embed = ProfessionalEmbedBuilder.info(
          title,
          'No users found yet!'
        );
        return await message.reply({ embeds: [embed] });
      }

      let description_text = '';
      leaderboardData.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        let value = '';

        if (type === 'economy') {
          value = `${user.wallet.toLocaleString()} coins`;
        } else if (type === 'level') {
          value = `Level ${user.level} (${user.xp.toLocaleString()} XP)`;
        } else if (type === 'hosting') {
          value = `${user.hostingCoins.toLocaleString()} coins`;
        }

        description_text += `${medal} **${user.username}** - ${value}\n`;
      });

      const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setTitle(title)
        .setDescription(description_text)
        .setFooter({ text: `Updated at: ${new Date().toLocaleTimeString()}` })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } catch (error) {
      await ErrorHandler.handleCommandError(error, message, prefixCommand);
    }
  },
};

export const slashCommand = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View top users by coins, level, or hosting coins')
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('The type of leaderboard to view')
        .setRequired(false)
        .addChoices(
          { name: 'Economy', value: 'economy' },
          { name: 'Level', value: 'level' },
          { name: 'Hosting', value: 'hosting' }
        )
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const type = interaction.options.getString('type') || 'economy';
      const guildId = interaction.guildId;

      let leaderboardData = [];
      let sort = {};
      let title = '';

      switch (type) {
        case 'economy':
          sort = { wallet: -1 };
          title = '💰 Economy Leaderboard';
          leaderboardData = await User.find({ guildId })
            .sort(sort)
            .limit(10)
            .select('username wallet');
          break;

        case 'level':
          sort = { level: -1, xp: -1 };
          title = '📊 Level Leaderboard';
          leaderboardData = await User.find({ guildId })
            .sort(sort)
            .limit(10)
            .select('username level xp');
          break;

        case 'hosting':
          sort = { hostingCoins: -1 };
          title = '🖥️ Hosting Coins Leaderboard';
          leaderboardData = await User.find({ guildId })
            .sort(sort)
            .limit(10)
            .select('username hostingCoins');
          break;
      }

      if (leaderboardData.length === 0) {
        const embed = ProfessionalEmbedBuilder.info(
          title,
          'No users found yet!'
        );
        return await interaction.editReply({ embeds: [embed] });
      }

      let description_text = '';
      leaderboardData.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        let value = '';

        if (type === 'economy') {
          value = `${user.wallet.toLocaleString()} coins`;
        } else if (type === 'level') {
          value = `Level ${user.level} (${user.xp.toLocaleString()} XP)`;
        } else if (type === 'hosting') {
          value = `${user.hostingCoins.toLocaleString()} coins`;
        }

        description_text += `${medal} **${user.username}** - ${value}\n`;
      });

      const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setTitle(title)
        .setDescription(description_text)
        .setFooter({ text: `Updated at: ${new Date().toLocaleTimeString()}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await ErrorHandler.handleCommandError(error, interaction, slashCommand);
    }
  },
};

export default {
  prefixCommand,
  slashCommand,
};

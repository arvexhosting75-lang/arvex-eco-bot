/**
 * Balance Command - Check user's balance
 * Prefix: ax!balance [@user]
 * Slash: /balance [@user]
 */

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../../models/User.js';
import ProfessionalEmbedBuilder from '../../utils/EmbedBuilder.js';
import ErrorHandler from '../../utils/ErrorHandler.js';

// Prefix Command
export const prefixCommand = {
  name: 'balance',
  aliases: ['bal', 'wallet', 'money'],
  description: 'Check your balance or another user\'s balance',
  category: 'economy',
  usage: 'ax!balance [@user]',
  cooldown: 3000,

  async execute(message, args, client) {
    try {
      const targetUser = message.mentions.first() || message.author;
      const guildId = message.guildId;

      // Fetch or create user document
      let userData = await User.findOne({ userId: targetUser.id, guildId });

      if (!userData) {
        userData = new User({
          userId: targetUser.id,
          guildId,
          username: targetUser.username,
          avatar: targetUser.displayAvatarURL(),
        });
        await userData.save();
      }

      const totalCoins = userData.wallet + userData.bank;
      const embed = ProfessionalEmbedBuilder.balance(
        targetUser,
        userData.wallet,
        userData.bank
      );

      // Add bank capacity info
      embed.addFields({
        name: '🏦 Bank Capacity',
        value: `${userData.bank.toLocaleString()} / ${userData.bankCapacity.toLocaleString()}`,
        inline: false,
      });

      await message.reply({ embeds: [embed] });
    } catch (error) {
      await ErrorHandler.handleCommandError(error, message, prefixCommand);
    }
  },
};

// Slash Command
export const slashCommand = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance or another user\'s balance')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to check balance for')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const targetUser = interaction.options.getUser('user') || interaction.user;
      const guildId = interaction.guildId;

      let userData = await User.findOne({ userId: targetUser.id, guildId });

      if (!userData) {
        userData = new User({
          userId: targetUser.id,
          guildId,
          username: targetUser.username,
          avatar: targetUser.displayAvatarURL(),
        });
        await userData.save();
      }

      const embed = ProfessionalEmbedBuilder.balance(
        targetUser,
        userData.wallet,
        userData.bank
      );

      embed.addFields({
        name: '🏦 Bank Capacity',
        value: `${userData.bank.toLocaleString()} / ${userData.bankCapacity.toLocaleString()}`,
        inline: false,
      });

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

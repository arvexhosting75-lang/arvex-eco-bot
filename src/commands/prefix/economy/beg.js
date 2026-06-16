/**
 * Beg Command - Beg for coins (low earnings)
 * Prefix: ax!beg
 * Slash: /beg
 */

import { SlashCommandBuilder } from 'discord.js';
import User from '../../models/User.js';
import ProfessionalEmbedBuilder from '../../utils/EmbedBuilder.js';
import CooldownManager from '../../utils/Cooldown.js';
import ErrorHandler from '../../utils/ErrorHandler.js';

const cooldownManager = new CooldownManager(600000); // 10 minutes cooldown

const responses = [
  '💔 A kind soul gave you {coins} coins out of pity.',
  '🙏 Someone felt bad for you and gave you {coins} coins.',
  '😢 A generous person gave you {coins} coins.',
  '🤲 You begged and got {coins} coins!',
  '💸 A random person threw {coins} coins at you!',
  '🎁 You found {coins} coins on the ground!',
];

export const prefixCommand = {
  name: 'beg',
  aliases: ['panhandle', 'beg4coins'],
  description: 'Beg for coins (low earnings)',
  category: 'economy',
  usage: 'ax!beg',
  cooldown: 600000, // 10 minutes

  async execute(message, args, client) {
    try {
      const userId = message.author.id;
      const guildId = message.guildId;

      // Check cooldown
      if (cooldownManager.isOnCooldown(userId, 'beg')) {
        const remaining = cooldownManager.getRemainingTime(userId, 'beg');
        const embed = ProfessionalEmbedBuilder.warn(
          'On Cooldown',
          `You can beg again in ${CooldownManager.formatTime(remaining)}`
        );
        return await message.reply({ embeds: [embed] });
      }

      let userData = await User.findOne({ userId, guildId });

      if (!userData) {
        userData = new User({
          userId,
          guildId,
          username: message.author.username,
          avatar: message.author.displayAvatarURL(),
        });
      }

      // Random coins (50-150)
      const earnedCoins = Math.floor(Math.random() * 100) + 50;

      userData.wallet += earnedCoins;
      userData.stats.begCount += 1;
      userData.stats.commandsUsed += 1;
      await userData.save();

      cooldownManager.setCooldown(userId, 'beg', 600000);

      const response = responses[Math.floor(Math.random() * responses.length)];
      const embed = new EmbedBuilder()
        .setColor(0xffb347)
        .setTitle('🙏 Begging Results')
        .setDescription(response.replace('{coins}', earnedCoins))
        .addFields(
          { name: '💰 Earned', value: `+${earnedCoins} ArveX Coins`, inline: true },
          { name: '💵 New Balance', value: userData.wallet.toLocaleString(), inline: true }
        )
        .setFooter({ text: 'ArveX Bot' })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } catch (error) {
      await ErrorHandler.handleCommandError(error, message, prefixCommand);
    }
  },
};

export const slashCommand = {
  data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg for coins (low earnings)'),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const userId = interaction.user.id;
      const guildId = interaction.guildId;

      if (cooldownManager.isOnCooldown(userId, 'beg')) {
        const remaining = cooldownManager.getRemainingTime(userId, 'beg');
        const embed = ProfessionalEmbedBuilder.warn(
          'On Cooldown',
          `You can beg again in ${CooldownManager.formatTime(remaining)}`
        );
        return await interaction.editReply({ embeds: [embed] });
      }

      let userData = await User.findOne({ userId, guildId });

      if (!userData) {
        userData = new User({
          userId,
          guildId,
          username: interaction.user.username,
          avatar: interaction.user.displayAvatarURL(),
        });
      }

      const earnedCoins = Math.floor(Math.random() * 100) + 50;

      userData.wallet += earnedCoins;
      userData.stats.begCount += 1;
      userData.stats.commandsUsed += 1;
      await userData.save();

      cooldownManager.setCooldown(userId, 'beg', 600000);

      const response = responses[Math.floor(Math.random() * responses.length)];
      const embed = new EmbedBuilder()
        .setColor(0xffb347)
        .setTitle('🙏 Begging Results')
        .setDescription(response.replace('{coins}', earnedCoins))
        .addFields(
          { name: '💰 Earned', value: `+${earnedCoins} ArveX Coins`, inline: true },
          { name: '💵 New Balance', value: userData.wallet.toLocaleString(), inline: true }
        )
        .setFooter({ text: 'ArveX Bot' })
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

import { EmbedBuilder } from 'discord.js';

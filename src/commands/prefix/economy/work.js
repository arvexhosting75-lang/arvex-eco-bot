/**
 * Work Command - Earn coins by working
 * Prefix: ax!work
 * Slash: /work
 */

import { SlashCommandBuilder } from 'discord.js';
import User from '../../models/User.js';
import ProfessionalEmbedBuilder from '../../utils/EmbedBuilder.js';
import CooldownManager from '../../utils/Cooldown.js';
import ErrorHandler from '../../utils/ErrorHandler.js';

const cooldownManager = new CooldownManager(3600000); // 1 hour cooldown

const workActivities = [
  { name: 'Coded a website', coins: 250 },
  { name: 'Completed a freelance project', coins: 350 },
  { name: 'Managed a server', coins: 300 },
  { name: 'Provided technical support', coins: 200 },
  { name: 'Created a bot', coins: 400 },
  { name: 'Optimized a database', coins: 320 },
  { name: 'Designed graphics', coins: 280 },
  { name: 'Consulted for a company', coins: 450 },
];

export const prefixCommand = {
  name: 'work',
  aliases: ['job', 'earn', 'grind'],
  description: 'Work to earn ArveX Coins',
  category: 'economy',
  usage: 'ax!work',
  cooldown: 3600000, // 1 hour

  async execute(message, args, client) {
    try {
      const userId = message.author.id;
      const guildId = message.guildId;

      // Check cooldown
      if (cooldownManager.isOnCooldown(userId, 'work')) {
        const remaining = cooldownManager.getRemainingTime(userId, 'work');
        const embed = ProfessionalEmbedBuilder.warn(
          'On Cooldown',
          `You can work again in ${CooldownManager.formatTime(remaining)}`
        );
        return await message.reply({ embeds: [embed] });
      }

      // Fetch user
      let userData = await User.findOne({ userId, guildId });

      if (!userData) {
        userData = new User({
          userId,
          guildId,
          username: message.author.username,
          avatar: message.author.displayAvatarURL(),
        });
      }

      // Random work activity and coins
      const activity = workActivities[Math.floor(Math.random() * workActivities.length)];
      const coinBonus = Math.floor(Math.random() * 100) - 50; // -50 to +50
      const earnedCoins = activity.coins + coinBonus;

      // Add coins and stats
      userData.wallet += earnedCoins;
      userData.stats.workCount += 1;
      userData.stats.commandsUsed += 1;
      await userData.save();

      // Set cooldown
      cooldownManager.setCooldown(userId, 'work', 3600000);

      const embed = ProfessionalEmbedBuilder.success(
        'Work Completed!',
        `You ${activity.name.toLowerCase()}`
      );

      embed.addFields(
        { name: '💰 Earned', value: `+${earnedCoins} ArveX Coins`, inline: true },
        { name: '💼 Work Count', value: userData.stats.workCount.toString(), inline: true },
        { name: '💵 New Balance', value: userData.wallet.toLocaleString(), inline: true }
      );

      await message.reply({ embeds: [embed] });
    } catch (error) {
      await ErrorHandler.handleCommandError(error, message, prefixCommand);
    }
  },
};

export const slashCommand = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work to earn ArveX Coins'),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const userId = interaction.user.id;
      const guildId = interaction.guildId;

      // Check cooldown
      if (cooldownManager.isOnCooldown(userId, 'work')) {
        const remaining = cooldownManager.getRemainingTime(userId, 'work');
        const embed = ProfessionalEmbedBuilder.warn(
          'On Cooldown',
          `You can work again in ${CooldownManager.formatTime(remaining)}`
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

      const activity = workActivities[Math.floor(Math.random() * workActivities.length)];
      const coinBonus = Math.floor(Math.random() * 100) - 50;
      const earnedCoins = activity.coins + coinBonus;

      userData.wallet += earnedCoins;
      userData.stats.workCount += 1;
      userData.stats.commandsUsed += 1;
      await userData.save();

      cooldownManager.setCooldown(userId, 'work', 3600000);

      const embed = ProfessionalEmbedBuilder.success(
        'Work Completed!',
        `You ${activity.name.toLowerCase()}`
      );

      embed.addFields(
        { name: '💰 Earned', value: `+${earnedCoins} ArveX Coins`, inline: true },
        { name: '💼 Work Count', value: userData.stats.workCount.toString(), inline: true },
        { name: '💵 New Balance', value: userData.wallet.toLocaleString(), inline: true }
      );

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

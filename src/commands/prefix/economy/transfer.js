/**
 * Transfer Command - Transfer coins to another user
 * Prefix: ax!transfer <@user> <amount>
 * Slash: /transfer <user> <amount>
 */

import { SlashCommandBuilder } from 'discord.js';
import User from '../../models/User.js';
import ProfessionalEmbedBuilder from '../../utils/EmbedBuilder.js';
import ErrorHandler from '../../utils/ErrorHandler.js';

export const prefixCommand = {
  name: 'transfer',
  aliases: ['send', 'give', 'pay'],
  description: 'Transfer coins to another user',
  category: 'economy',
  usage: 'ax!transfer <@user> <amount>',
  cooldown: 3000,

  async execute(message, args, client) {
    try {
      // Validation
      if (args.length < 2) {
        const embed = ProfessionalEmbedBuilder.error(
          'Invalid Usage',
          'Please provide a user and amount: `ax!transfer <@user> <amount>`'
        );
        return await message.reply({ embeds: [embed] });
      }

      const recipientUser = message.mentions.first();
      const amount = parseInt(args[1]);

      if (!recipientUser) {
        const embed = ProfessionalEmbedBuilder.error(
          'User Not Found',
          'Please mention a valid user to transfer coins to'
        );
        return await message.reply({ embeds: [embed] });
      }

      if (recipientUser.id === message.author.id) {
        const embed = ProfessionalEmbedBuilder.warn(
          'Invalid Transfer',
          'You cannot transfer coins to yourself!'
        );
        return await message.reply({ embeds: [embed] });
      }

      if (isNaN(amount) || amount <= 0) {
        const embed = ProfessionalEmbedBuilder.error(
          'Invalid Amount',
          'Please provide a valid positive amount'
        );
        return await message.reply({ embeds: [embed] });
      }

      const guildId = message.guildId;

      // Fetch sender
      let senderData = await User.findOne({ userId: message.author.id, guildId });
      if (!senderData) {
        senderData = new User({
          userId: message.author.id,
          guildId,
          username: message.author.username,
          avatar: message.author.displayAvatarURL(),
        });
      }

      // Check sender balance
      if (senderData.wallet < amount) {
        const embed = ProfessionalEmbedBuilder.error(
          'Insufficient Balance',
          `You only have ${senderData.wallet.toLocaleString()} coins`
        );
        return await message.reply({ embeds: [embed] });
      }

      // Fetch recipient
      let recipientData = await User.findOne({ userId: recipientUser.id, guildId });
      if (!recipientData) {
        recipientData = new User({
          userId: recipientUser.id,
          guildId,
          username: recipientUser.username,
          avatar: recipientUser.displayAvatarURL(),
        });
      }

      // Process transfer
      senderData.wallet -= amount;
      recipientData.wallet += amount;

      await senderData.save();
      await recipientData.save();

      const embed = ProfessionalEmbedBuilder.success(
        'Transfer Successful',
        `You transferred **${amount.toLocaleString()}** coins to **${recipientUser.username}**`
      );

      embed.addFields(
        { name: 'Your New Balance', value: senderData.wallet.toLocaleString(), inline: true },
        { name: "Recipient's New Balance", value: recipientData.wallet.toLocaleString(), inline: true }
      );

      await message.reply({ embeds: [embed] });
    } catch (error) {
      await ErrorHandler.handleCommandError(error, message, prefixCommand);
    }
  },
};

export const slashCommand = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer coins to another user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to transfer coins to')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('The amount of coins to transfer')
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const recipientUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');
      const guildId = interaction.guildId;

      if (recipientUser.id === interaction.user.id) {
        const embed = ProfessionalEmbedBuilder.warn(
          'Invalid Transfer',
          'You cannot transfer coins to yourself!'
        );
        return await interaction.editReply({ embeds: [embed] });
      }

      let senderData = await User.findOne({ userId: interaction.user.id, guildId });
      if (!senderData) {
        senderData = new User({
          userId: interaction.user.id,
          guildId,
          username: interaction.user.username,
          avatar: interaction.user.displayAvatarURL(),
        });
      }

      if (senderData.wallet < amount) {
        const embed = ProfessionalEmbedBuilder.error(
          'Insufficient Balance',
          `You only have ${senderData.wallet.toLocaleString()} coins`
        );
        return await interaction.editReply({ embeds: [embed] });
      }

      let recipientData = await User.findOne({ userId: recipientUser.id, guildId });
      if (!recipientData) {
        recipientData = new User({
          userId: recipientUser.id,
          guildId,
          username: recipientUser.username,
          avatar: recipientUser.displayAvatarURL(),
        });
      }

      senderData.wallet -= amount;
      recipientData.wallet += amount;

      await senderData.save();
      await recipientData.save();

      const embed = ProfessionalEmbedBuilder.success(
        'Transfer Successful',
        `You transferred **${amount.toLocaleString()}** coins to **${recipientUser.username}**`
      );

      embed.addFields(
        { name: 'Your New Balance', value: senderData.wallet.toLocaleString(), inline: true },
        { name: "Recipient's New Balance", value: recipientData.wallet.toLocaleString(), inline: true }
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

/**
 * Cooldown Manager
 * Handles command and action cooldowns
 */

class CooldownManager {
  constructor(defaultDuration = 3000) {
    this.cooldowns = new Map();
    this.defaultDuration = defaultDuration;
  }

  /**
   * Set cooldown for user
   */
  setCooldown(userId, action, duration = this.defaultDuration) {
    const key = `${userId}-${action}`;
    this.cooldowns.set(key, Date.now() + duration);

    // Auto-delete after cooldown expires
    setTimeout(() => this.cooldowns.delete(key), duration);
  }

  /**
   * Check if user is on cooldown
   */
  isOnCooldown(userId, action) {
    const key = `${userId}-${action}`;
    const cooldownEnd = this.cooldowns.get(key);

    if (!cooldownEnd) return false;
    if (Date.now() > cooldownEnd) {
      this.cooldowns.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get remaining cooldown time in milliseconds
   */
  getRemainingTime(userId, action) {
    const key = `${userId}-${action}`;
    const cooldownEnd = this.cooldowns.get(key);

    if (!cooldownEnd) return 0;
    const remaining = cooldownEnd - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Clear cooldown
   */
  clearCooldown(userId, action) {
    const key = `${userId}-${action}`;
    return this.cooldowns.delete(key);
  }

  /**
   * Clear all cooldowns for user
   */
  clearAllUserCooldowns(userId) {
    let cleared = 0;
    for (const [key] of this.cooldowns) {
      if (key.startsWith(`${userId}-`)) {
        this.cooldowns.delete(key);
        cleared++;
      }
    }
    return cleared;
  }

  /**
   * Format remaining time
   */
  static formatTime(milliseconds) {
    const seconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
}

export default CooldownManager;

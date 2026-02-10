const Lead = require("../models/Lead");
const { emailQueue } = require("../queues/email.queue");
const { EMAIL_JOB_TYPES } = require("../emails/email.types");

/**
 * This job checks for leads whose follow-up date has passed
 * and sends reminder emails to the assigned user.
 */
const followUpReminderJob = async () => {
  try {
    // Find leads with followUpDate <= now and not yet notified
    const leads = await Lead.find({
      followUpDate: { $lte: new Date() },
      followUpNotified: false,
    });

    for (const lead of leads) {
      // Skip leads not assigned to anyone
      if (!lead.assignedTo) continue;

      // Add follow-up email job to the queue
      await emailQueue.add(EMAIL_JOB_TYPES.FOLLOW_UP_DUE, {
        userId: lead.assignedTo.toString(),
        leadName: lead.customerName || lead.leadNumber,
      });

      // Mark lead as notified so we don't spam
      lead.followUpNotified = true;
      await lead.save();
    }

    console.log(`[FollowUpReminderJob] Processed ${leads.length} leads`);
  } catch (error) {
    console.error("[FollowUpReminderJob] Error:", error);
  }
};

module.exports = { followUpReminderJob };

const { Telegraf } = require('telegraf');
const User = require('./models/User');

const token = process.env.TELEGRAM_BOT_TOKEN || '8758188839:AAGzhlcHpe4qGbWhxE6jhHdN_Z2IHEzsgFw';
const bot = new Telegraf(token);

bot.start(async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const username = ctx.from.username || ctx.from.first_name || 'User';
  
  // payload is whatever comes after `/start ` (e.g. `ref_12345`)
  const payload = ctx.payload;
  const referredBy = payload && payload.startsWith('ref_') ? payload.split('_')[1] : null;

  try {
    let user = await User.findOne({ telegramId });
    
    if (!user) {
      // New user registration
      user = new User({ 
        telegramId, 
        username,
        referredBy: (referredBy && referredBy !== telegramId) ? referredBy : null 
      });
      await user.save();

      // Notify admins
      try {
        const admins = await User.find({ isAdmin: true });
        for (const admin of admins) {
          bot.telegram.sendMessage(
            admin.telegramId,
            `🔔 *New User Joined!*\n\n*Name:* ${username}\n*UID:* \`${telegramId}\`\n*Referred By:* ${user.referredBy || 'None'}`,
            { parse_mode: 'Markdown' }
          ).catch(err => console.log('Could not send msg to admin', err.message));
        }
      } catch (adminErr) {
        console.error('Admin notification error:', adminErr.message);
      }

      // If referred, notify the referrer
      if (user.referredBy) {
        const referrer = await User.findOne({ telegramId: user.referredBy });
        if (referrer) {
          referrer.referrals += 1;
          await referrer.save();

          ctx.telegram.sendMessage(
            referrer.telegramId, 
            `🎉 *Congratulations!* \nনতুন একজন আপনার রেফারে জয়েন করেছে। \nইউজারের নাম: *${username}* \nএটি আপনার *${referrer.referrals}* তম রেফার!`,
            { parse_mode: 'Markdown' }
          ).catch(err => console.log('Could not send msg to referrer', err));
        }
      }
    }

    // Send Welcome Message with Mini App Launch Button
    const welcomeMsg = `🎉 *স্বাগতম Power Star Work - এ, ${username}!* 🌟

আমাদের প্ল্যাটফর্মে আপনাকে স্বাগতম। এখান থেকে আপনি খুব সহজেই ছোট ছোট কাজ করে এবং কয়েন বিক্রি করে ইনকাম করতে পারবেন! 💸

*আপনি এখানে কী কী করতে পারবেন:*
✅ *Task Complete:* সহজ কাজ (যেমন: TikTok, VK) করে ইনকাম।
💰 *Sell Coins:* আপনার জমানো কয়েন (Niva, TopFollow ইত্যাদি) সরাসরি আমাদের কাছে বিক্রি করে বিকাশ/নগদে টাকা নিতে পারবেন।
🎁 *Refer & Earn:* বন্ধুদের ইনভাইট করে রেফারেন্স বোনাস জিতে নিন!
⚡ *Fast Withdraw:* ইনকাম করা টাকা খুব দ্রুত আপনার একাউন্টে পেয়ে যাবেন।

👇 *নিচের বাটনটিতে ক্লিক করে এখনই অ্যাপটি ওপেন করুন এবং ইনকাম শুরু করুন!*`;
    
    ctx.reply(welcomeMsg, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Open App (Mini App)",
              web_app: { url: "https://power-star-work.onrender.com" } // Replace with your Render URL
            }
          ],
          [
            { text: "📢 Telegram Channel", url: "https://t.me/your_channel" }, // Optional
            { text: "📞 Support", url: "https://t.me/your_support" } // Optional
          ]
        ]
      }
    });

  } catch (err) {
    console.error(err);
    ctx.reply("Sorry, an error occurred while registering your account.");
  }
});

// Export bot so server.js can handle Webhook or Long Polling
module.exports = bot;

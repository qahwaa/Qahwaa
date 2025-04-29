const { Telegraf } = require("telegraf");

const BOT_TOKEN = "8018297376:AAFfMQKUgCxxC_iMjtCjEGktvw4dga37GSw"; // استبدل هذا بالتوكن من @BotFather
const FORWARD_CHAT_ID = "206169006"; // ضع ID المجموعة أو الشخص الذي تريد إعادة التوجيه إليه

const bot = new Telegraf(BOT_TOKEN);

// استقبال أي رسالة وإعادة توجيهها
bot.on("message", (ctx) => {
    const messageId = ctx.message.message_id;
    const fromChatId = ctx.message.chat.id;

    ctx.telegram.forwardMessage(FORWARD_CHAT_ID, fromChatId, messageId)
        .then(() => console.log("✅ Order forwarded successfully!"))
        .catch(err => console.error("❌ Error forwarding order:", err));
});

bot.launch();

console.log("🚀 البوت يعمل الآن...");

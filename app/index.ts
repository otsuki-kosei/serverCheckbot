import { Client, GatewayIntentBits } from "discord.js";
import { status } from "minecraft-server-util";
import dotenv from "dotenv";

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
const CHANNEL_ID = process.env.CHANNEL_ID!;
const MC_SERVER_IP = process.env.MC_SERVER_IP!;
const MC_SERVER_PORT = parseInt(process.env.MC_SERVER_PORT || "25565", 10);
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL || "60000", 10);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function checkServerStatus() {
  try {
    const response = await status(MC_SERVER_IP, MC_SERVER_PORT);
    return `✅ サーバーはオンラインです！\nプレイヤー: ${response.players.online}/${response.players.max}`;
  } catch (error) {
    return `❌ サーバーはオフラインです。`;
  }
}

async function notifyServerStatus() {
  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel || !channel.isTextBased()) {
    console.error("指定したチャンネルが見つからないか、テキストチャンネルではありません。");
    return;
  }

  const statusMessage = await checkServerStatus();
  (channel as any).send(statusMessage); // 型が合わない場合の対処
}

async function notifyServerRecovery() {
  try {
    const response = await status(MC_SERVER_IP, MC_SERVER_PORT);
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
      console.error("指定したチャンネルが見つからないか、テキストチャンネルではありません。");
      return;
    }
    const recoveryMessage = `✅ サーバーが復帰しました！\n現在のプレイヤー数: ${response.players.online}/${response.players.max}`;
    (channel as any).send(recoveryMessage);
  } catch (error) {
    console.log("サーバーはオフラインの状態です。");
  }
}

client.once("ready", async () => {
  console.log(`Botがログインしました: ${client.user?.tag}`);
  await notifyServerRecovery(); // 起動時にサーバー復帰の通知を送信
  setInterval(notifyServerStatus, CHECK_INTERVAL);
});

client.login(DISCORD_TOKEN).catch(console.error);

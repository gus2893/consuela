const dotenv = require("dotenv");
const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

// app.post(
//   "/interactions",
//   verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY),
//   async function (req, res) {
//     const { type, data, guild_id, application_id, channel_id } = req.body;

//     if (type === InteractionType.PING) {
//       return res.send({ type: InteractionResponseType.PONG });
//     }

//     if (type === InteractionType.APPLICATION_COMMAND) {
//       const { name } = data;

//       if (name === "add-playlist") {
//         const playlist = await getPlaylist(data.options[0].value);

//         playlist.forEach((song) => {
//           const body = Groovybody({
//             guild_id,
//             application_id,
//             channel_id,
//             value: song,
//           });
//           res.send({
//             type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//             data: {
//               content: body.data,
//             },
//           });
//         });
//       }

//       console.error(`unknown command: ${name}`);
//       return res.status(400).json({ error: "unknown command" });
//     }

//     console.error("unknown interaction type", type);
//     return res.status(400).json({ error: "unknown interaction type" });
//   }
// );

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

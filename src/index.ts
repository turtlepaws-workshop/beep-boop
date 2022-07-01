import { CommandManager } from "./handler/commandManager";
import { InteractionManager } from "./handler/interactionManager";
import { Console } from "./utils/Logger";
import { Client, IntentsBitField, Partials } from "discord.js";
import { token } from "./config/secrets.json";
const Intents = IntentsBitField.Flags;

const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildScheduledEvents,
        Intents.GuildBans
    ],
    partials: [
        Partials.Channel,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.GuildMember
    ]
});

client.on("ready", async () => {
    await CommandManager.use(client);
    await InteractionManager.use(client);

    Console.Debug(`Client: Ready... Commands: Registered... Guilds: ${client.guilds.cache.size}...`);
    Console.Debug("Client connected and ready...")
});

client.login(token);

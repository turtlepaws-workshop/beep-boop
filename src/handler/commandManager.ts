import { Client, GuildMember } from "discord.js";
import klawSync from "klaw-sync";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import Command from "../lib/SlashCommand";
import { Id, token, guildId } from "../config/secrets.json";
import { PermissionString } from "src/@types";

export const rest = new REST({ version: '9' }).setToken(token);

export const utils = {
    loadAll: function (dir: string = "./dist/commands") {
        return klawSync(dir, {
            nodir: true,
            traverseAll: true,
            filter: f => f.path.endsWith('.js')
        });
    },
    registerCommands: function (commands: Command[], dev: boolean){
        const JSON_Commands = commands.map(e => e.builder.toJSON());

        if(dev){
            return rest.put(
                Routes.applicationGuildCommands(Id,  guildId),
                { body: JSON_Commands },
            );
        } else {
            return rest.put(
                Routes.applicationCommands(Id),
                { body: JSON_Commands },
            );
        }
    }
}

export class CommandManager {
    static async use(client: Client) {
        const commands = utils.loadAll();
        const commandsLoad: {
            private: Command[],
            public: Command[]
        } = {
            private: [],
            public: []
        };

        for(const command of commands){
            const commandModule = require(command.path);
            const commandClass = new commandModule.default(client);
            if(commandClass?.dev){
                commandsLoad.private.push(commandClass);
            } else {
                commandsLoad.public.push(commandClass);
            }
        }

        client.commands = {
            private: commandsLoad.private,
            public: commandsLoad.public,
            all: commandsLoad.private.concat(commandsLoad.public)
        };

        //Register all commands
        await utils.registerCommands(commandsLoad.public, false);
        await utils.registerCommands(commandsLoad.private, true);

        return client.commands;
    }
}
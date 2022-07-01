import { EmbedBuilder } from "../utils/EmbedBuilder";
import { ChatInputCommandInteraction, Client, ContextMenuCommandInteraction, Formatters, GuildMember, PermissionsBitField, PermissionsString } from "discord.js";
import Command from "../lib/SlashCommand";

export const utils = {
    checkPermissions: function (member: GuildMember, permissions: PermissionsString[], mode: "Any" | "All") {
        if (mode == "All") {
            return member.permissions.has(permissions);
        } else if (mode == "Any") {
            return member.permissions.any(permissions);
        }
    },
    throwError: function (error: any) {
        return {
            content: "An error occured while executing this command.",
            embeds: new EmbedBuilder()
                .setDescription(Formatters.codeBlock(error.toString()))
                .build(),
            ephemeral: true
        }
    },
    isReplied: function(interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction){
        return interaction.replied || interaction?.deferred
    },
    requiredChecks: function(command: Command, interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction){
        if(!(
            //@ts-expect-error
            utils.checkPermissions(interaction.member, command.requiredPermissions, "All") ||
            //@ts-expect-error
            utils.checkPermissions(interaction.member, command.somePermissions, "Any")
        )){
            const permissions: PermissionsString[] = interaction.member.permissions instanceof PermissionsBitField ?
                interaction.member.permissions.toArray() : ([interaction.member.permissions] as PermissionsString[]);

            return {
                content: "You do not have the required permissions to execute this command.",
                embeds: new EmbedBuilder()
                .setDescription(
                    permissions.map(e => Formatters.inlineCode(e)).join(", ")
                )
                .build(),
                ephemeral: true
            }
        } else if(
            (command.serverOnly == null ? true : command.serverOnly) &&
            interaction.guild == null
        ){
            return {
                content: "This command can only be executed in a server.",
                ephemeral: true
            }
        } else {
            return {
                noErrors: true
            }
        }
    }
};

export class InteractionManager {
    static async use(client: Client) {
        client.on("interactionCreate", async interaction => {
            if (interaction.isChatInputCommand()) {
                const command = client.commands.all.find(e => e.name == interaction.commandName);
                const checks = utils.requiredChecks(command, interaction);

                if(checks?.noErrors == null) {
                    (utils.isReplied(interaction) ? interaction.editReply : interaction.reply)(checks);
                    return;
                }

                try {
                    await command.execute(interaction, client);
                } catch (error) {
                    console.log(error);
                    await (utils.isReplied(interaction) ? interaction.editReply : interaction.reply)(
                        utils.throwError(error)
                    );
                }
            } else if (interaction.isContextMenuCommand()) {
                const command = client.commands.all.find(e => e.name == interaction.commandName);
                const checks = utils.requiredChecks(command, interaction);
                
                if(checks?.noErrors == null) {
                    (utils.isReplied(interaction) ? interaction.editReply : interaction.reply)(checks);
                    return;
                }

                try {
                    await command.execute(interaction, client);
                } catch (error) {
                    console.log(error);
                    await (utils.isReplied(interaction) ? interaction.editReply : interaction.reply)(
                        utils.throwError(error)
                    );
                }
            }
        });
    }
}
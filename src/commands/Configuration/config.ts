import HorizonSlashCommandBuilder from "../../lib/SlashCommandBuilder";
import Command from "../../lib/SlashCommand";
import { ActionRowBuilder, AnyComponentBuilder, APIActionRowComponent, APIMessageActionRowComponent, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, Component, ComponentBuilder, ComponentType, InteractionType, ModalBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputStyle, UnsafeSelectMenuOptionBuilder } from "discord.js";
import { generateCustomId, generateId } from "../../lib/Id";
import { createActionRow, EmbedBuilder, formatButtons } from "../../utils";
import { defaultConfigurationWelcomeMessageComponents, Emojis } from "../../utils/Constants";

export default class Configuration extends Command {
    constructor() {
        super({
            commandBuilder: new HorizonSlashCommandBuilder()
                .setName("configuration")
                .setDescription("Configure your server."),
            requiredPermissions: ["Administrator"],
            runPermissions: [],
            somePermissions: [],
            serverOnly: true,
            dev: true,
            category: "Configuration"
        })
    }

    async execute(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        const Ids = {
            WelcomeMessageOption: generateCustomId("welcomeMessage"),
            ManageMenu: generateCustomId("manageMenu"),
            AddButton: generateCustomId("AddButton"),
            ButtonLabel: generateCustomId("ButtonLabelModal"),
            ButtonURL: generateCustomId("ButtonURLModal"),
            ButtonStyle: generateCustomId("ButtonStyleModal"),
            ButtonEmoji: generateCustomId("ButtonEmojiModal"),
            ButtonModal: generateCustomId("ButtonModal"),
        }

        const ConfigurationComponents = {
            ManageMenu: new SelectMenuBuilder()
                .setOptions([{
                    emoji: {
                        name: "👋"
                    },
                    description: "The server's rules, getting started, and more.",
                    value: Ids.WelcomeMessageOption,
                    label: "Welcome Info"
                }])
                .setCustomId(Ids.ManageMenu),
            ButtonModal: new ModalBuilder()
                .setTitle("Editing a button"),
            createModalComponents: (button: ButtonBuilder) => {
                return [
                    new ActionRowBuilder<TextInputBuilder>()
                    .setComponents(
                        new TextInputBuilder()
                            //basic
                            .setLabel("Button Label")
                            .setStyle(TextInputStyle.Short)
                            .setCustomId(Ids.ButtonLabel)
                            //optional
                            .setRequired(true)
                            .setValue(button.data.label)
                            //length
                            .setMaxLength(80)
                            .setMinLength(2),
                    ),
                    new ActionRowBuilder<TextInputBuilder>()
                    .setComponents(
                        new TextInputBuilder()
                            //basic
                            .setLabel("Button Style")
                            .setStyle(TextInputStyle.Short)
                            .setCustomId(Ids.ButtonStyle)
                            //optional
                            .setPlaceholder("Primary, Secondary, Danger, Success, or Link")
                            .setValue(ButtonStyle[button.data.style])
                            .setRequired(true)
                            //length
                            .setMaxLength(9)
                            .setMinLength(4),
                    ),
                    new ActionRowBuilder<TextInputBuilder>()
                    .setComponents(
                        new TextInputBuilder()
                            //basic
                            .setLabel("Button URL")
                            .setStyle(TextInputStyle.Short)
                            .setCustomId(Ids.ButtonURL)
                            //optional
                            .setPlaceholder("If the button is a link, enter the URL here."),
                    ),
                    new ActionRowBuilder<TextInputBuilder>()
                    .setComponents(
                        new TextInputBuilder()
                            //basic
                            .setLabel("Button Emoji")
                            .setStyle(TextInputStyle.Short)
                            .setCustomId(Ids.ButtonEmoji)
                            //optional
                            .setValue(
                                button.data.emoji != null ?
                                `<${button.data.emoji.animated ? "a" : ""}:${button.data.emoji.name}:${button.data.emoji.id}>` :
                                null
                            )
                            .setPlaceholder("<:wave:954487334882136094>")
                    )
                ]
            }
        };

        await interaction.editReply({
            components: createActionRow(ConfigurationComponents.ManageMenu),
            embeds: new EmbedBuilder()
                .setTitle("🛠️ Configuration")
                .setDescription("Select an option below to start configuring your server.")
                .build()
        });

        const collector = message.createMessageComponentCollector({
            time: 0,
            filter: i => i.user.id == interaction.user.id
        });

        function getButtons() {
            return [
                ...defaultConfigurationWelcomeMessageComponents
                    .map(e => e.setCustomId(generateId())),
                new ButtonBuilder()
                    .setLabel("Create")
                    .setEmoji(Emojis.Horizon.AddCircle.API())
                    .setCustomId(Ids.AddButton)
                    .setStyle(ButtonStyle.Success)
            ]
        }
        collector.on("collect", async i => {
            if (i.isSelectMenu()) {
                const value = i.values[0];
                if (value == Ids.WelcomeMessageOption) {
                    const buttons = getButtons();
                    const components = formatButtons(
                        ...buttons
                    );

                    await i.update({
                        components,
                        embeds: new EmbedBuilder()
                            .setTitle("🛠️ Configuration")
                            .setDescription("Click a button below to start editing it.")
                            .build()
                    })
                }
            } else if (i.isButton()) {
                //@ts-expect-error
                const modalComponents = ConfigurationComponents.createModalComponents(i.component);
                const modal = new ModalBuilder(ConfigurationComponents.ButtonModal)
                    .setCustomId(Ids.ButtonModal)
                    .setTitle("Editing a button")
                    .setComponents(
                        modalComponents
                    );

                console.log(modalComponents)
                await i.showModal(modal);

                const modalInteraction = await i.awaitModalSubmit({
                    time: 0
                });

                const Label = modalInteraction.fields.getTextInputValue(Ids.ButtonLabel);
                const Style: ButtonStyle = ButtonStyle[modalInteraction.fields.getTextInputValue(Ids.ButtonStyle)];
                const URL = modalInteraction.fields.getTextInputValue(Ids.ButtonURL);
                const Emoji = modalInteraction.fields.getTextInputValue(Ids.ButtonEmoji);

                const Button = new ButtonBuilder()
                Button.setLabel(Label || i.component.label);
                Button.setStyle(Style || i.component.style);
                if(URL != null) Button.setURL(URL);
                else Button.setCustomId(generateId())
                Button.setEmoji(Emoji || i.component.emoji);

                const buttons = getButtons();
                const components = formatButtons(
                    ...buttons,
                    Button
                );
                console.log(components, buttons)
                await modalInteraction.reply({
                    components,
                    embeds: new EmbedBuilder()
                        .setTitle("🛠️ Configuration")
                        .setDescription("Click a button below to start editing it.")
                        .build()
                })
            }
        });
    }
}
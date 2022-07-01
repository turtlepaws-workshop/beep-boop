import { ButtonBuilder, ButtonStyle } from "discord.js";
import { CustomEmoji } from "../lib/CustomEmoji";

export const Emojis = {
    CommunityArchitects: {
        Book: new CustomEmoji("<:ca_book:988274936542003211>"),
        Edit: new CustomEmoji("<:ca_edit:988274938861461565>"),
        School: new CustomEmoji("<:ca_school:988274937934528512>"),
    },
    Horizon: {
        AddCircle: new CustomEmoji("<:add_circle:992099893931950150>"),
        Add: new CustomEmoji("<:plain_add:992099767385591898>"),
    }
}

export const defaultConfigurationWelcomeMessageComponents = [
    //Based off https://discord.gg/communityarchitects
    new ButtonBuilder()
    .setLabel("View Rules")
    .setStyle(ButtonStyle.Primary)
    .setEmoji(Emojis.CommunityArchitects.Book.API()),
    new ButtonBuilder()
    .setLabel("Get Started")
    .setStyle(ButtonStyle.Success)
    .setEmoji(Emojis.CommunityArchitects.School.API()),
    new ButtonBuilder()
    .setLabel("Select Roles")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(Emojis.CommunityArchitects.Edit.API())
];

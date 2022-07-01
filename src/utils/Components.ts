import { ActionRowBuilder, AnyComponentBuilder, APIActionRowComponent, APIMessageActionRowComponent, ButtonBuilder } from "discord.js";

export function createActionRow(...withComponents: AnyComponentBuilder[]): APIActionRowComponent<APIMessageActionRowComponent>[] {
    //@ts-expect-error
    return [new ActionRowBuilder()
        .setComponents(withComponents)];
}

export function formatButtons(...buttons: ButtonBuilder[]): APIActionRowComponent<APIMessageActionRowComponent>[] {
    //split buttons into 5 per row
    const rows: ActionRowBuilder[] = [];
    let row: ButtonBuilder[] = [];
    for (let i = 0; i < buttons.length; i++) {
        row.push(buttons[i]);
        if (row.length == 5) {
            rows.push(
                new ActionRowBuilder()
                    .setComponents(row)
            );
            row = [];
        }
    };

    if (rows.length == 0) rows.push(
        new ActionRowBuilder()
            .setComponents(row)
    );

    //@ts-expect-error
    return rows;
}

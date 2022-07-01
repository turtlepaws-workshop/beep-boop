import { APIMessageComponentEmoji, ButtonBuilder, Client } from "discord.js";

export class CustomEmoji {
    public name: string;
    public id: string;
    public full: string;
    public animated: boolean;

    constructor(fullEmoji: string){
        this.id = fullEmoji.split(":")[2].replace(">", "");
        this.full = fullEmoji;
        this.name = fullEmoji.split(":")[1];
        this.animated = fullEmoji.startsWith("<a:");
    }

    public API(): APIMessageComponentEmoji {
        return {
            name: this.name,
            id: this.id,
            animated: this.animated
        };
    }

    public Info(client: Client){
        return client.emojis.cache.get(this.id);
    }
    
    public toString(){
        return this.full;
    }
}
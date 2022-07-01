import { APIEmbed, APIEmbedField, EmbedBuilder as MessageEmbed, EmbedData } from "discord.js";
import { Color } from "../config/index";

export class EmbedBuilder extends MessageEmbed {
    constructor(data?: EmbedBuilder){
        if(data != null) super(data.toJSON());
        else super();

        this.setColor(Color);
    }

    addField(name: string, value: string, inline?: boolean) {
        this.addFields([{
            name,
            value,
            inline
        }]);
        return this;
    }

    build(){
        return [this];
    }
}
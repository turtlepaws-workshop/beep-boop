import { Client,
    ContextMenuCommandInteraction as ContextMenuInteraction,
    PermissionsString,
    ContextMenuCommandBuilder
} from "discord.js";
import { MenuOptions, PermissionString } from "../@types";

export default class Menu {
    public name: string;
    public dev: boolean;
    public runPermissions: PermissionsString[];
    public requiredPermissions: PermissionString[];
    public somePermissions: PermissionString[];
    public builder: ContextMenuCommandBuilder = new ContextMenuCommandBuilder();

    constructor(options: MenuOptions){
        this.builder = this.builder.setName(options.name)
        .setType(options.type);

        this.name = options.name;
        this.dev = options.dev;
        this.requiredPermissions = options.requiredPermissions;
        this.runPermissions = options.runPermissions;
        this.somePermissions = options.somePermissions;
    }

    async execute(
        interaction: ContextMenuInteraction,
        client: Client
    ): Promise<void> { }
}
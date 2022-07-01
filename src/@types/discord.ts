import 'discord.js';
import { Collection, Emoji } from 'discord.js';
import Command from '../lib/SlashCommand';

declare module 'discord.js' {
    interface Client {
        commands: {
            private: Command[],
            public: Command[],
            all: Command[]
        };
    }
}
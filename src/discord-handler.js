import { config } from 'dotenv';
import { REST, Routes, Client, IntentsBitField } from 'discord.js';

class DiscordHandler {
    constructor() {
        config();
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent
            ]
        });
        this.rest = new REST({version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);        
    }

    async startAsync() {
        this.client.login(process.env.DISCORD_BOT_TOKEN);

        const commands = [
            {
            name: 'helptest2',
            description: 'Some help please',
            },
        ];
    
        try{
            console.log('Started refreshing application (/) commands.');
            await this.rest.put(Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.GUILD_ID), {
                body: commands,
            });
        } catch (err) {}

        this.client.on('ready', () => {
            console.log(`${this.client.user.tag} has logged in!`);
        });

        this.client.on('messageCreate', (message) => {
            console.log(message.content);
        });
    }
}

export { DiscordHandler }; 
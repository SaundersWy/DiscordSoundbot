const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

const TOKEN = '';
const prefix = '!';
let dispatcher = '';

let soundbites = require('./soundbites').sounds;

// Executes when the bot is started
client.on('ready', (event) => {
    console.log('The bot is ready to go!!!!\n');
});

// Executes whenever a message is inputted
client.on('message', async msg => {
    let args = msg.content.substring(prefix.length).split(" ");

    switch (args[0]) {
        case 'play':
            if (msg.member.voice.channel) {
                // Bot joins the channel
                let connection = await msg.member.voice.channel.join();
                // Sound is played
                let soundPlayed = findSound(args[1]);
                console.log(soundPlayed);

                dispatcher = await connection.play('./audioFiles/' + soundPlayed['mp3']);
                // dispatcher = await connection.play(ytdl('https://www.youtube.com/watch?v=WNeLUngb-Xg'));
                if (soundPlayed.volume) {
                    dispatcher.setVolume(soundPlayed.volume);
                } else {
                    dispatcher.setVolume(0.20);
                }
                
                msg.channel.send(`Now playing: "${soundPlayed.desc}"`);

                // Triggers once the sound is finished playing
                dispatcher.on('finish', () => {
                    console.log('audio.mp3 has finished playing!\n');
                });
            }

            // Triggers if no one is in a channel
            else {
                msg.reply('You are not in a channel...\n');
            }

            break;
        
        case 'stop':
            dispatcher.destroy();
            console.log('Stopped playing sound...\n')
            break;

        case 'help':
            let helpText = '------ CURRENT COMMANDS ------\n\n' +
                           '***-play*** {sound}   : Plays inputted sound (Must be in a channel)\n' +
                           '***-stop***                   : Stops playing a sound\n' +
                           '***-sounds***              : Displays all sounds available\n' +
                           '***-disconnect***       : Disconnects bot from current channel\n' +
                           '***-help***                   : Displays all commands\n';


            msg.channel.send(helpText);
            break;

        case 'sounds':
            let display = 'SOUNDS LIST\n' +
                          '--------------------------\n' +
                          '***Use -play {sound}***   (Yes, the spacing is off I KNOW)\n\n' +
                          'Sound   -   ***Description***\n\n';   

            for(let i = 0; i < soundbites.length; i++) {
                for(let [key, value] of Object.entries(soundbites[i])) {

                    while(key.length < 15 ) {
                        key += ' ';
                    }

                    display += key + '- ' + '***' + value.desc + '***' + '\n';
                    // console.log(display);
                }
            }
            
            // console.log(display);
            msg.channel.send(display);
            break;
            
        // Disconnects bot from voice channel
        case 'disconnect':
            await msg.member.voice.channel.leave();
            console.log('Bot has left the channel...\n');
    }
});


client.login(TOKEN);



function findSound(sound) {
    for(let x = 0; x < soundbites.length; x ++) {
        if(soundbites[x][sound]) {
            return soundbites[x][sound];
        } 
    }

}

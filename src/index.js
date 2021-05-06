const Discord = require('discord.js');

const learnSkydome = require('./learnSkydome');
const getNumberOfCurrentPlayers = require('./getNumberOfCurrentPlayers');

const bot = new Discord.Client();

const token = 'ODMwMjg2MzY2ODIyNjI5Mzc2.YHEebw.MgBxxYSnvc2pfQbcwyyoWBID-Ks';

const channels = 
    [
        {
            name : 'geral', 
            id : '831622046449401867'
        },

        {
            name : 'anúncios',
            id : '831622727462158427'
        },

        {
            name : 'feedbacks',
            id : '834937377121107989'
        },

        {
            name : 'review-feedbacks',
            id : '836015183352168539'
        },

        {
            name : 'testes',
            id : '832312633797378058'
        }

    ]


bot.login(token)
bot.on('ready', async () => {
    console.log('Ready for use')    
})

bot.on('message', async () => {
    //console.log('Ready for use')
    bot.user.setActivity( `${await getNumberOfCurrentPlayers()}`, { type: 'PLAYING'});
    
})


bot.on('message', async (msg) => {

    const message_text = msg.content
 
    if (message_text.startsWith("!announce")){

        let command;
        let channel_name;
        let message_tosend;
        if (message_text.startsWith("!")){
            const splited_message = message_text.split('$')
            command = splited_message[0]
            channel_name = splited_message[1]
            message_tosend = splited_message[2]
        }

        if (msg.channel.name === 'adm'){

            const {id} = getChannelbyName(channel_name)
            const channel_tosendmsg = bot.channels.cache.find(channel => channel.id === id)
            channel_tosendmsg.send(message_tosend)

        }
    }

    if (msg.content === '!players'){
        const numberOfPlayersOnline = await getNumberOfCurrentPlayers();
        msg.reply(numberOfPlayersOnline + ' Players Online');
    }

    if(msg.channel.name === 'testes'){

        if (message_text.startsWith("!sugestão")){

            if (message_text.toLowerCase().includes('o que acontece') && message_text.toLowerCase().includes('por que isso tem que mudar')){

                const suggestion = message_text.split('!sugestão')[1]
                const {id} = getChannelbyName('feedbacks')
                const channel_tosendmsg = bot.channels.cache.find(channel => channel.id === id)
                const sent_message = await channel_tosendmsg.send("```"+"**Suggestion from "+msg.author.username+"** "+suggestion+"```")
                await sent_message.react('✅')
                await sent_message.react('🤷🏻')
                await sent_message.react('❌')

            }   

        }

        await msg.delete({ timeout: 1000 })

    }

    if(message_text.startsWith("!review")){

        let suggestions = [];
        let messages = [];
        let target_suggestions = [];
        let final_report = '';
        const {id} = getChannelbyName('feedbacks')
        const channel = bot.channels.cache.get(id);
        messages = await channel.messages.fetch({ limit: 100 }).then(messages => {
            return messages
        }) 
    
        messages.forEach(message => {
            const suggestion = {
                id: message.id,
                content: message.content,
                check: message.reactions.cache.get('✅').count - message.reactions.cache.get('❌').count,
                reactions: [
                    {up: message.reactions.cache.get('✅').count},
                    {middle: message.reactions.cache.get('🤷🏻').count},
                    {down: message.reactions.cache.get('❌').count},
                ]
            }
            suggestions.push(suggestion)
        })

        suggestions.sort((a, b) => parseFloat(b.check) - parseFloat(a.check));
        console.dir(suggestions,{depth:null})
        //const bestsuggestion = messages.filter(message => message.id === suggestions[0].id);
        const {id : idReview} = getChannelbyName('review-feedbacks')
        const channel_tosendmsg = bot.channels.cache.find(channel => channel.id === idReview)

        target_suggestions = suggestions.slice(0,5);


        target_suggestions.forEach(async(obj,index) => {          
            let content = obj.content;
            if(index==target_suggestions.length-1){
                content += `\n \n🔵 ${obj.check} ${obj.check>1?'points':'point'}!`
            }else{
                content += `\n \n🔵 ${obj.check} ${obj.check>1?'points':'point'}!`
                content += `\n  \n`
            }
            final_report += '```'+content.replace(/```/g, '')+'```'+'\n';
        });
        
      //  final_report = final_report.replace(/```/g, '')
      //  final_report = '```'+final_report+'```'
        await channel_tosendmsg.send(final_report);

    }

    

    learnSkydome(msg);

})

function getChannelbyName(channelname){
      const targetchannel = channels.find((channel)=>{
        if (channel.name === channelname){
            return channel.id
        }
    })
    return targetchannel
}
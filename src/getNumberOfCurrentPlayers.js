const axious = require('axios');

async function getNumberOfCurrentPlayers(){

  let currentPlayers = 0;
  const steamResponse = await axious.get('https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=708550');
  
  if (steamResponse.data.response.player_count){
    currentPlayers = steamResponse.data.response.player_count;
  }

  return currentPlayers;
  
}

module.exports = getNumberOfCurrentPlayers;
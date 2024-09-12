import "dotenv/config";
import axios from "axios";

export async function DiscordRequest({
  endpoint = "",
  options = {},
  version = "v10",
  Authorization = `Bot ${process.env.DISCORD_TOKEN}`,
}) {
  const url = `https://discord.com/api/${version}/${endpoint}`;

  if (options.body) options.body = JSON.stringify(options.body);
  const res = await fetch(url, {
    headers: {
      Authorization,
      "Content-Type": "application/json; charset=UTF-8",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  const endpoint = `applications/${appId}/commands`;

  try {
    await DiscordRequest({
      endpoint,
      options: { method: "PUT", body: commands },
    });
    console.log("Updated Commands");
  } catch (err) {
    console.error(err);
  }
}

const spotifyToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const requestBody = {
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  };

  try {
    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      requestBody,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return data.access_token;
  } catch (error) {
    console.log("ERROR GETTING TOKEN");
  }
};

export const getSpotifyInstance = async () => {
  const token = await spotifyToken();
  if (token) {
    return axios.create({
      baseURL: "https://api.spotify.com/v1",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
};

export const getPlaylist = async (playlistId) => {
  try {
    const spotifyInstance = await getSpotifyInstance();
    const { data } = await spotifyInstance(`/playlists/${playlistId}`);

    const forattedTracks = data.tracks.items.map(
      ({ track: { artists, name } }) => {
        const artistList = artists.map((artist) => artist.name).toString();
        return `${name} - ${artistList}`;
      }
    );

    return forattedTracks;
  } catch (error) {
    console.log("ERROR GETTING PLAYLIST");
  }
};

export const getCurrentTrack = async () => {
  const token = await spotifyToken();
  if (token) {
    try {
      const spotifyInstance = await getSpotifyInstance();
      const { data } = await spotifyInstance(`/me/player`);

      console.log("DATA", data);
      return data;
    } catch (error) {
      console.log("ERROR GETTING PLAYER", error.response);
    }
  }
};

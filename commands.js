import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";

const ADD_PLAYLIST = {
  name: "add-playlist",
  description: "adds playlist to Groovy",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [
    {
      name: "playlist-id",
      description: "id",
      type: 3,
    },
  ],
};

const ALL_COMMANDS = [ADD_PLAYLIST];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

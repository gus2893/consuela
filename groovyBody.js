export const Groovybody = ({
  application_id,
  guild_id,
  channel_id,
  value,
}) => ({
  type: 2,
  application_id,
  guild_id,
  channel_id,
  // session_id: "",
  data: {
    version: "1260283402549202999",
    id: "883304386212794448",
    name: "play",
    type: 1,
    options: [
      {
        type: 3,
        name: "query",
        value,
      },
    ],
    application_command: {
      id: "883304386212794448",
      type: 1,
      application_id,
      version: "1260283402549202999",
      name: "play",
      description:
        "Play a song in a voice channel from a link or a search query.",
      options: [
        {
          type: 3,
          name: "query",
          description: "Type music name, link, playlist, radio and media link.",
          required: true,
          autocomplete: true,
          description_localized:
            "Type music name, link, playlist, radio and media link.",
          name_localized: "query",
        },
        {
          type: 5,
          name: "insert-first",
          description: "Insert music at the head of the tail",
          required: false,
          description_localized: "Insert music at the head of the tail",
          name_localized: "insert-first",
        },
      ],
      dm_permission: false,
      contexts: [0],
      integration_types: [0],
      global_popularity_rank: 1,
      description_localized:
        "Play a song in a voice channel from a link or a search query.",
      name_localized: "play",
    },
    attachments: [],
  },
  // nonce: "1279653381710807040",
  analytics_location: "slash_ui",
});

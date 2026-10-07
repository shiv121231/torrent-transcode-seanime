$ui.register((ctx) => {
  const action = ctx.action.newEpisodeGridItemMenuItem({
    label: "Play Torrent in Web Player",
    type: "torrentstream",
  })

  action.onClick(async ({ episode }) => {
    try {
      const ep = episode as any

      const mediaId =
        ep?.baseAnime?.id ??
        ep?.mediaId ??
        ep?.animeId

      const episodeNumber =
        ep?.episodeNumber ??
        ep?.number ??
        ep?.episode

      const aniDbEpisode =
        ep?.aniDBEpisode ??
        ep?.anidbEpisode ??
        String(episodeNumber)

      if (!mediaId || episodeNumber === undefined) {
        ctx.toast.error("Could not determine anime/episode.")
        return
      }

      if (!ctx.torrentstream) {
        ctx.toast.error(
          "Torrent streaming API unavailable. Make sure the plugin has the playback permission."
        )
        return
      }

      if (!ctx.torrentstream.isEnabled()) {
        ctx.toast.error("Seanime torrent streaming is disabled.")
        return
      }

      await ctx.torrentstream.startStream({
        mediaId: Number(mediaId),
        episodeNumber: Number(episodeNumber),
        aniDbEpisode: String(aniDbEpisode),
        autoSelect: true,

        // "default" is the correct playback mode for the web client.
        // nativeplayer is specifically for Seanime's desktop native player.
        playbackType: "default",

        clientId: "",
      })

      ctx.toast.success("Torrent stream started.")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error)

      ctx.toast.error(`Torrent Web Player: ${message}`)
    }
  })

  action.mount()
})

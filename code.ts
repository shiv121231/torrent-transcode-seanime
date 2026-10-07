$ui.register((ctx) => {
  const action = ctx.action.newEpisodeGridItemMenuItem({
    label: "Play torrent in Web Player",
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

      if (!mediaId || episodeNumber === undefined) {
        ctx.toast.error(
          "Could not determine the anime/episode for this torrent."
        )
        return
      }

      const response = await ctx.fetch(
        "http://127.0.0.1:43211/api/v1/torrentstream/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mediaId: Number(mediaId),
            episode: Number(episodeNumber),
            playbackType: "mediastream",
          }),
        }
      )

      if (!response.ok) {
        throw new Error(
          `Torrent stream failed: ${response.status} ${response.statusText}`
        )
      }

      ctx.toast.success("Torrent stream started.")
      ctx.screen.reload()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error)

      ctx.toast.error(`Torrent Web Player: ${message}`)
    }
  })

  action.mount()
})$ui.register((ctx) => {
  const action = ctx.action.newEpisodeGridItemMenuItem({
    label: "Play torrent in Web Player",
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
        ep?.aniDbEpisode ??
        String(episodeNumber)

      if (!mediaId || episodeNumber === undefined) {
        ctx.toast.error(
          "Could not determine the anime/episode for this torrent."
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
        playbackType: "nativeplayer",
      })

      ctx.toast.success("Torrent stream started in Web Player.")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error)

      ctx.toast.error(`Torrent Web Player: ${message}`)
    }
  })

  action.mount()
})

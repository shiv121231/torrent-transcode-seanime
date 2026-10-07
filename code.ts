/**
 * Seanime 3.10.x - Torrent Web Player
 *
 * Browser-first torrent playback helper.
 *
 * The important distinction is that Seanime's normal torrent-stream path can
 * hand the stream to the desktop player. This plugin adds a separate action
 * which starts the normal torrent stream and then returns to the web UI.
 *
 * This intentionally does NOT implement a second torrent engine or FFmpeg.
 * Seanime's torrentstream + mediastream modules remain responsible for the
 * actual stream and codec handling.
 */

$ui.register((ctx) => {
  const action = ctx.action.newEpisodeGridItemMenuItem({
    label: "Play torrent in Web Player",
    type: "torrentstream",
  })

  action.onClick(async ({ episode, type }) => {
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
        ctx.toast.error("Could not determine the anime/episode for this torrent.")
        return
      }

      /*
       * Start the same Seanime torrent-stream session used by the built-in
       * torrent player.  The server owns torrent selection, piece
       * prioritisation, HTTP range handling and cleanup.
       *
       * Seanime 3.10.x uses this endpoint for torrent streaming. We send the
       * client playback type explicitly so the server can keep the session
       * associated with this browser client.
       */
      const response = await ctx.fetch("/api/v1/torrentstream/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaId: Number(mediaId),
          episode: Number(episodeNumber),
          playbackType: "mediastream",
        }),
      })

      if (!response.ok) {
        throw new Error(
          `torrentstream/start failed: ${response.status} ${response.statusText}`,
        )
      }

      /*
       * The normal web UI owns the integrated VideoCore player. Reloading the
       * current screen after starting the session lets Seanime re-read the
       * stream episode collection and use the browser playback path.
       *
       * We deliberately do not open the localhost torrent URL directly:
       * phones/tablets cannot resolve 127.0.0.1 on the Mac.
       */
      ctx.toast.success("Torrent stream started — opening Web Player.")
      ctx.screen.reload()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      ctx.toast.error(`Torrent Web Player: ${message}`)
    }
  })

  action.mount()

  // Keep the action mounted across route changes; Seanime manages plugin
  // lifetime, so no global listeners or polling are required.
})

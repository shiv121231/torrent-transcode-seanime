function init() {
  $ui.register((ctx) => {
    const action = ctx.action.newEpisodeGridItemMenuItem({
      label: "Play torrent in Web Player",
      type: "torrentstream",
    })

    action.mount()

    action.onClick(async ({ episode }) => {
      try {
        if ("number" in episode) {
          ctx.toast.error("This action only works with anime torrent episodes.")
          return
        }

        const anime = episode.baseAnime
        if (!anime) {
          ctx.toast.error("Could not determine the anime for this episode.")
          return
        }

        const previous = ctx.torrentstream.getPreviousStreamOptions()

        if (!previous) {
          ctx.toast.error(
            "No torrent selection was found. Open the torrent streaming selector, choose a torrent/file, then use this action.",
          )
          return
        }

        if (!ctx.torrentstream.isEnabled()) {
          ctx.toast.error("Torrent streaming is disabled in Seanime.")
          return
        }

        const clientIds = $app.getClientIds()

        const webClient = clientIds.find(
          (id) => $app.getClientPlatform(id) === "web",
        )

        if (!webClient) {
          ctx.toast.error(
            "No Seanime Web client is connected. Open Seanime in the browser on the device you want to watch on.",
          )
          return
        }

        action.setLoading(true)

        await ctx.torrentstream.startStream({
          ...previous,
          mediaId: anime.id,
          episodeNumber: episode.episodeNumber,
          aniDbEpisode: episode.aniDBEpisode ?? previous.aniDbEpisode,
          clientId: webClient,
          playbackType: "nativeplayer",
          autoSelect: false,
        })

        ctx.toast.success("Torrent sent to the Web Player.")
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error)

        ctx.toast.error(`Torrent Web Player: ${message}`)
      } finally {
        action.setLoading(false)
      }
    })
  })
}

init()

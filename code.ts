$app.onTorrentStreamSendStreamToMediaPlayer((event) => {
  event.preventDefault()

  void (async () => {
    try {
      // Remove an existing torrent player if one exists.
      const oldPlayer = await $ui.dom.queryOne("#torrent-web-player")
      if (oldPlayer) {
        oldPlayer.remove()
      }

      const oldContainer = await $ui.dom.queryOne("#torrent-web-player-container")
      if (oldContainer) {
        oldContainer.remove()
      }

      // Create the player container.
      const container = await $ui.dom.createElement("div")
      await container.setAttribute("id", "torrent-web-player-container")

      // Create the browser-native video element.
      const video = await $ui.dom.createElement("video")
      await video.setAttribute("id", "torrent-web-player")
      await video.setAttribute("controls", "true")
      await video.setAttribute("autoplay", "true")
      await video.setAttribute("playsinline", "true")
      await video.setAttribute("preload", "auto")

      // Use Seanime's already-authenticated torrent stream URL.
      await video.setAttribute("src", event.streamURL)

      await container.appendChild(video)

      // Put the player into the main Seanime page.
      const main = await $ui.dom.queryOne("main")

      if (main) {
        await main.appendChild(container)
      } else {
        const body = await $ui.dom.queryOne("body")

        if (!body) {
          throw new Error("Could not find Seanime page container.")
        }

        await body.appendChild(container)
      }

      $ui.toast.success("Playing torrent in Seanime Web Player.")

      // Try to start playback after the element is attached.
      await video.setProperty("muted", true)
      await video.setProperty("autoplay", true)

      try {
        await video.setProperty("muted", false)
      } catch (_) {
        // Browser autoplay restrictions can prevent unmuting.
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      $ui.toast.error(`Torrent Web Player: ${message}`)
    }
  })()
})

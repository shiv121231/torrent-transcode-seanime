$app.onTorrentStreamSendStreamToMediaPlayer((event) => {
  // Stop Seanime from launching the native/external media player.
  event.preventDefault()

  void (async () => {
    try {
      if (!event.streamURL) {
        throw new Error("Seanime did not provide a torrent stream URL.")
      }

      if (!event.media) {
        throw new Error("Seanime did not provide anime information.")
      }

      // Send the already-authenticated torrent stream directly
      // to Seanime's built-in Web Player.
      await $app.videoCore.playStream(
        event.streamURL,
        event.aniDbEpisode,
        event.media,
      )
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error)

      $ui.toast.error(`Torrent Web Player: ${message}`)
    }
  })()
})

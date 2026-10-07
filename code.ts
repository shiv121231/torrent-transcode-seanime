/**
 * Torrent Web Player for Seanime 3.10.x
 *
 * Redirects Seanime torrent playback from the external desktop player
 * to the client-side native/Web player.
 *
 * The existing torrent selection is preserved.
 */

$ui.register((ctx) => {
  const startNativePlayer = async () => {
    const previous = ctx.torrentstream?.getPreviousStreamOptions?.()

    if (!previous) {
      throw new Error(
        "Seanime did not expose the current torrent stream options.",
      )
    }

    const options = {
      ...previous,
      playbackType: "nativeplayer" as const,
    }

    // Normally the original stream already contains the client ID.
    // If it doesn't, select a connected web client.
    if (!options.clientId) {
      const clients = $app.getClientIds?.() ?? []

      const webClient = clients.find(
        (id) => $app.getClientPlatform?.(id) === "web",
      )

      options.clientId = webClient ?? clients[0]
    }

    if (!options.clientId) {
      throw new Error("No connected Seanime web client was found.")
    }

    await ctx.torrentstream.startStream(options)
  }

  $app.onTorrentStreamSendStreamToMediaPlayer((event) => {
    // Stop Seanime from launching VLC/IINA/the desktop player.
    event.preventDefault()

    void startNativePlayer().catch((error) => {
      const message =
        error instanceof Error ? error.message : String(error)

      ctx.toast.error(`Torrent Web Player: ${message}`)
    })
  })
})

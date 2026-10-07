$ui.register((ctx) => {
  const startWebTorrent = async () => {
    const previous = ctx.torrentstream.getPreviousStreamOptions()

    if (!previous) {
      throw new Error(
        "No previous torrent stream was found. Select a torrent and episode first.",
      )
    }

    const clients = $app.getClientIds()

    if (!clients || clients.length === 0) {
      throw new Error("No connected Seanime clients were found.")
    }

    // Prefer the browser/web client that initiated this plugin.
    const webClient = clients.find(
      (id) => $app.getClientPlatform(id) === "web",
    )

    const clientId = previous.clientId || webClient || clients[0]

    await ctx.torrentstream.startStream({
      ...previous,
      clientId,
      playbackType: "nativeplayer",
    })
  }

  ctx.toast.info(
    "Torrent Web Player loaded. Select a torrent and use the plugin's Web Player action.",
  )

  // Expose a small UI action rather than intercepting Seanime's
  // external-player hook.
  ctx.ui?.register?.({
    id: "torrent-web-player",
    label: "Play torrent in Web Player",
    onClick: () => {
      void startWebTorrent().catch((error) => {
        const message =
          error instanceof Error ? error.message : String(error)

        ctx.toast.error(`Torrent Web Player: ${message}`)
      })
    },
  })
})

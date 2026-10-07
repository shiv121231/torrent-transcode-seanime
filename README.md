# Seanime Torrent Web Player

Target: Seanime 3.10.x

This plugin adds **Play torrent in Web Player** to torrent-stream episode
menus. It uses Seanime's own torrentstream service rather than implementing a
torrent client.

## Important

Seanime's documented Transcoding / Direct Play subsystem is designed for
downloaded files, while torrent streaming is a separate subsystem. Therefore
this plugin is an integration experiment: it starts a torrent-stream session
with `playbackType: "mediastream"` and asks the existing web UI to reload.

If your 3.10.3 build does not accept `playbackType: "mediastream"` at the
torrentstream start endpoint, the plugin will report the HTTP error instead of
silently doing something else.

## Install for development

1. Edit `manifest.json` and replace `YOUR_USER` in `payloadURI`.
2. Host the folder from a raw GitHub repository, or use Seanime's development
   plugin loading facility.
3. Install/reload the plugin.
4. Open a torrent-stream episode's episode-grid menu.
5. Choose **Play torrent in Web Player**.

For a production-quality version, the next step is to wire the plugin to
Seanime's exact 3.10.3 VideoCore navigation/play method rather than relying
on the reload fallback.

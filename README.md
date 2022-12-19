# PearJuice

A stupidly simple client for Apple Music's web app.

Named because I had a dead fork of Cider called AppleJuice, so this is PearJuice.

You can use the PearJuice config window (located under the account context menu) to change your region
and to opt in to the AM beta client.

You should probably evaluate if https://cider.sh is a good solution for you too,
we're Cider fans here :p

## Advantages
 - works well consistently
 - lightweight
 - a couple of ui tweaks

[//]: # ( - additional caching for a snappy startup)

## Disadvantages
 - playback on slow connections can break more readily than Cider, note this is an issue with the AM webapp not pearjuice
 - no fancy features that Cider has (yet!)

## TODO

[//]: # ( - implement the whole caching thing )

 - Figure out a way to make IPC work on Firefox (or just scream @ Ducko)
 - Add theme choosing (`Emulation.setAutoDarkModeOverride`)
 - Add notifs
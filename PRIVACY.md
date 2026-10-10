# Privacy

Settled collects nothing.

There is no account, no sign-in, and no server. The app is a static site: once it has
loaded, it never contacts anything again. There is no analytics, no telemetry, no crash
reporting, no cookies, and no third-party code of any kind. The site's security policy
forbids network connections from the app itself.

## What is stored, and where

Everything you write stays in your browser's storage on this device:

- the decisions you have made, including drafts
- your theme preference (Day or Night)

Settled asks the browser to keep this data persistently. Nothing leaves the device unless
you choose to export it.

## Export

When you export, Settled produces a `.yaml` file and hands it to your downloads folder or
your clipboard. From that moment the delivery is entirely up to the app you chose, exactly
as with any other file. A decision file contains the question, your options, whatever you
wrote during the method walk, and the sentence you landed on, so anyone who can read the
file can read the decision.

## Backups

An export *is* the backup: the file contains everything the app holds, and importing such a
file merges it back in. Keep a copy somewhere you trust; anyone who can read it can read
your decisions.

## Removing your data

Settings → Erase all data removes every decision and setting from the device and returns
Settled to its first screen. It asks twice and offers an export first. There is no copy
anywhere else to delete.

## Hosting

settled.riverma.com is served by GitHub Pages, which, like any web host, sees the requests
that fetch the app itself. After the first load the app runs from its own service-worker
cache and makes no further requests. Settled sets no cookies and passes nothing to the host.

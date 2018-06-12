# Chrome Connectivity Diagnostics

This app is used when network connectivity is broken.

It is not normally directly accessible.
When the system is offline, the Chrome network pages will include a "Running
Connectivity Diagnostics" link.
Clicking that will run the [Connectivity Diagnostics Launcher] which in turn
will spawn this app.

It is bundled with the OS image directly so that it's usable in all situations:
guest mode, the system isn't configured yet, users don't have to visit CWS,
etc...

This project is also known as the Chrome Connectivity Debugger (CCD),
although it's not commonly used outside of the source.

## URLs

This is registered as `chrome-extension://kodldpbjkkmmnilagfdheibampofhaom/`.

Since it's a Chrome app, you won't be able to run it directly.
The [Connectivity Diagnostics Launcher] is needed to access it.

## Browser Integration

This app is registered directly in the Chromium source.
You can see references via code search:
https://cs.chromium.org/search/?q=connectivity_diagnostics&sq=package:chromium&type=cs

There is also a newer copy in the Chrome Web Store (CWS):
https://chrome.google.com/webstore/detail/eemlkeanncmjljgehlbplemhmdmalhdc

They are built from the same (internal) source tree, although the CWS version
tends to be more up-to-date as it's automatically upgraded.

## Source

This project is maintained in Google3 at
`//depot/google3/enterprise/deployments/cse/internal/ccd_v1/src/`.
Changes should be made there and synced back to this copy.

[Connectivity Diagnostics Launcher]: ../connectivity_diagnostics_launcher/

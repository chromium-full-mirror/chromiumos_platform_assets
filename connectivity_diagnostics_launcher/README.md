# Chrome Connectivity Diagnostics Launcher

This extension is used when network connectivity is broken.
It's a tiny launcher to open the main [Connectivity Diagnostics] application.

When the system is offline, the Chrome network pages will include a "Running
Connectivity Diagnostics" link.
That will run this launcher directly.

See the [Connectivity Diagnostics] source tree for more details.

## URLs

This is registered as `chrome-extension://idddmepepmjcgiedknnmlbadcokidhoa/`.

Visiting `chrome-extension://idddmepepmjcgiedknnmlbadcokidhoa/index.html`
directly will launch the [Connectivity Diagnostics] app.

## Browser Integration

This extension is registered directly in the Chromium source.
You can see references via code search:
https://cs.chromium.org/search/?q=connectivity_diagnostics_launcher&sq=package:chromium&type=cs

## Source

This project is mostly maintained in Google3 at
`//depot/google3/enterprise/deployments/cse/internal/ccd_v1/launcher_extensions/chrome_os/`.
Changes should be made there and synced back to this copy.

The `tests.html` and `tests.js` files are for autotest integration.
See the [desktopui_ConnectivityDiagnostics] test for more details.

[Connectivity Diagnostics]: ../connectivity_diagnostics/
[desktopui_ConnectivityDiagnostics]: https://chromium.googlesource.com/chromiumos/third_party/autotest/+/master/client/site_tests/desktopui_ConnectivityDiagnostics/

# MeshCentral-Agentname2Servername

Synchronize the agent name (--agentName) to the display name on the [MeshCentral](https://github.com/Ylianst/MeshCentral) server on each connection if it has changed.

Depends on [MeshCentral-PluginHookScheduler](https://github.com/bitctrl/MeshCentral-PluginHookScheduler) and `hook_afterCreateMeshAgent` to be enabled.

## Installation

See [Plugins - Installation & Usage](https://github.com/Ylianst/MeshCentral/blob/master/docs/docs/meshcentral/plugins.md)

To install, simply add the plugin configuration URL when prompted:
```
https://raw.githubusercontent.com/bitctrl/MeshCentral-Agentname2Servername/main/config.json
```

## Configuration

### `meshcentral-data/config.json`
```json
{
  "$schema": "https://raw.githubusercontent.com/Ylianst/MeshCentral/master/meshcentral-config-schema.json",
  "settings": {
    "plugins": {
      "enabled": true,
      "pluginSettings": {
        "agentname2servername": {
          "#_1": "an empty or undefined include list means, include all",
          "#_2": "if names are used instead of ids for nodes it must match the (new) agent name",
          "include": [
            "mesh//KbvW2V18kiZSNQ5zkT8Qk2s7aADf0MwS1cXUlc$WzqwbwEVYMTopJFR1uxxZzE79",
            "mesh//playground--connect",
            "node//Lv13LecdMtfydCiWwW00D17kidGBykQuieOk7zT20@HHsRAqalZRxrV$z1uZZ7f@"
          ],
          "exclude": [
            "node//VV@mK6GmoGTcOxycnmenyYkjYItMDNyoVD9jgVTS8SQlUfiX7twXgXU55QmZ$nK0",
            "node//meshagent64-playground--connect-004"
          ]
        }
      }
    }
  }
}

```

## Bugs

- Since this plugin is a bit hacky, using it leads to LOOSING THE INFORMATION about the real hostname/computernam/os name.
- When excluding nodes from an includes mesh, the excluded node might be renamed to its (real) computername when connecting at the same time as other not-excluded nodes.
- If you load the MeshCentral Web UI in a moment where devices are connecting, you might be unable to change device names - just reload.

## TODO

- Globbing or RegExp

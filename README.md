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
          "meshes" : [
            "KbvW2V18kiZSNQ5zkT8Qk2s7aADf0MwS1cXUlc$WzqwbwEVYMTopJFR1uxxZzE79",
            "playground--connect"
          ]
        }
      }
    }
  }
}

```


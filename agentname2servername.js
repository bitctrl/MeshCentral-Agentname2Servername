'use strict';
/**********************************************************************
 * Copyright (C) 2025 BitCtrl Systems GmbH
 * 
 * agentname2servername.js
 * 
 * @author  Daniel Hammerschmidt <daniel.hammerschmidt@bitctrl.de>
 * @author  Daniel Hammerschmidt <daniel@redneck-engineering.com>
 * @version 0.0.1
 *********************************************************************/

const { getPluginShortName, getPluginConfig, requirePluginHooks } = require('../pluginhookscheduler');

const PLUGIN_SHORT_NAME = getPluginShortName(__dirname);
const pluginConfig = getPluginConfig(PLUGIN_SHORT_NAME, () => ({ meshes: [] }));

requirePluginHooks('hook_afterCreateMeshAgent');

let meshserver, webserver;

const kUndo = Symbol(PLUGIN_SHORT_NAME + '/undo');

module.exports = {
  [PLUGIN_SHORT_NAME]: function (pluginHandler) {
    meshserver = pluginHandler.parent;
    return {
      server_startup: function () {
        webserver = meshserver.webserver;
      },
      hook_afterCreateMeshAgent(meshagent, parent, db, ws, req, args, domain) {
        ws.on('message', function listener(data) {
          const mesh = webserver.meshes[meshagent.dbMeshKey];
          if (mesh === undefined) { return; }
          if (meshagent.authenticated < 2) {
            if (!meshagent.agentName || (pluginConfig.meshes.indexOf(meshagent.meshid) === -1 && pluginConfig.meshes.indexOf(mesh.name) === -1)) {
              return void ws.off('message', listener);
            }  
            meshagent[kUndo] = { undo: true };
            mesh.flags |= 2;
            meshagent.agentInfo.computerName = meshagent.agentName;
          } else if (meshagent[kUndo]?.undo === true) {
            meshagent[kUndo].undo = false;
            delete meshagent[kUndo];
            mesh.flags &= ~2;
          }
          ws.off('message', listener);
        });
        return meshagent;
      },
    };
  },
};

'use strict';
/**********************************************************************
 * Copyright (C) 2025 BitCtrl Systems GmbH
 * 
 * agentname2servername.js
 * 
 * @author  Daniel Hammerschmidt <daniel.hammerschmidt@bitctrl.de>
 * @author  Daniel Hammerschmidt <daniel@redneck-engineering.com>
 * @version 0.0.2
 *********************************************************************/

const { getPluginShortName, getPluginConfig, requirePluginHooks } = require('../pluginhookscheduler');

const PLUGIN_SHORT_NAME = getPluginShortName(__dirname);
const pluginConfig = getPluginConfig(PLUGIN_SHORT_NAME, () => ({}));
pluginConfig.include = new Set(pluginConfig.include);
pluginConfig.exclude = new Set(pluginConfig.exclude);

requirePluginHooks('hook_afterCreateMeshAgent');

let meshserver, webserver;

const kReset = Symbol(PLUGIN_SHORT_NAME + '/reset');

module.exports = {
  [PLUGIN_SHORT_NAME]: function (pluginHandler) {
    meshserver = pluginHandler.parent;
    return {
      server_startup: function () {
        webserver = meshserver.webserver;
      },
      hook_afterCreateMeshAgent(meshagent, parent, db, ws, req, args, domain) {
        const { include, exclude } = pluginConfig;
        let busy = 0;
        // let ii = 0;
        ws.on('message', function listener(data) {
          const { authenticated, agentName, dbMeshKey, dbNodeKey } = meshagent;
          if (authenticated < 1) { return; }
          // console.log(++ii, busy, authenticated, [data[0],data[1],data[2],data[3]], meshagent.dbMeshKey, meshagent.dbNodeKey);
          if (this[kReset]?.mesh?.flags && !--busy) { this[kReset].mesh.flags &= ~2; }
          if (authenticated > 1) { return void ws.off('message', listener); }
          try {
            const mesh = webserver.meshes[dbMeshKey];
            const domain = dbMeshKey.split('/')[1];
            const keys = [dbMeshKey, dbNodeKey, 'mesh/' + domain + '/' + mesh.name, 'node/' + domain + '/' + agentName ];
            const white = include.size == 0 || keys.some((key)=>(include.has(key)));
            const black = keys.some((key)=>(exclude.has(key)));
            // console.log(keys);
            // console.log(include);
            // console.log(exclude);
            // console.log([white, black, white && !black]);
            if (white && !black) {
              ++busy;
              this[kReset] = { mesh };
              mesh.flags |= 2;
              meshagent.agentInfo.computerName = agentName;
            }
            void(0);
          } catch (_) {
            ws.off('message', listener);
          }
        });
        return meshagent;
      },
    };
  },
};

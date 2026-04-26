#!/usr/bin/env node

import app from "../app.js";
import http from "http";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const httpServer = http.createServer(app);
httpServer.listen(port);
httpServer.on('error', onError(port));
httpServer.on('listening', onListening(httpServer, 'HTTP'));

function normalizePort(val) {
    const p = parseInt(val, 10);
    if (isNaN(p)) return val;
    if (p >= 0) return p;
    return false;
}

function onError(boundPort) {
    return (error) => {
        if (error.syscall !== 'listen') throw error;
        const bind = typeof boundPort === 'string' ? 'Pipe ' + boundPort : 'Port ' + boundPort;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
}

function onListening(server, label) {
    return () => {
        const addr = server.address();
        const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        console.log(`${label} listening on ${bind}`);
    };
}

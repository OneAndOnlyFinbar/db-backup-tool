import { getSession } from 'next-auth/react';
import Server from '@/lib/db/server';
const net = require('net');

let serverCache = {};
const cacheTTL = 30_000;
let lastCacheHit = null;

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session)
    return res.status(401).json({ error: 'Unauthorized' });

  const servers = await Server.findAll()
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: 'Internal database error' });
    })
  let results = [];

  const connectToServer = (server) => {
    return new Promise((resolve) => {
      const client = new net.Socket();

      client.on('connect', () => {
        results.push({
          id: server.id,
          name: server.name,
          ip: server.ip,
          port: server.port,
          status: 1,
        });
        client.destroy();
        resolve();
      });

      client.on('error', (err) => {
        results.push({
          id: server.id,
          name: server.name,
          ip: server.ip,
          port: server.port,
          status: 0,
        });
        client.destroy();
        resolve();
      });

      client.connect({
        host: server.ip,
        port: server.port,
      });
    });
  };

  if(lastCacheHit && Date.now() - lastCacheHit < cacheTTL) {
    return res.status(200).json(serverCache);
  }

  await Promise.all(servers.map(connectToServer));

  lastCacheHit = Date.now();
  serverCache = results;

  return res.status(200).json(results);
}
import { getSession } from 'next-auth/react';
import Server from '@/lib/db/server';
const net = require('net');

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const servers = await Server.findAll();
  const results = [];

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

  await Promise.all(servers.map(connectToServer));

  return res.status(200).json(results);
}
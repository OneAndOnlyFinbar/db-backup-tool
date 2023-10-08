import { getSession } from 'next-auth/react';
import Server from '@/lib/db/server';
const { sshConnectionManager } = require('../../../lib/utils/SSHConnectionManager');

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

  if(!sshConnectionManager.initialized)
    await sshConnectionManager._init(servers);

  for(const server of servers){
    const connection = sshConnectionManager.connections[server.id];
    results.push({
      ...server.dataValues,
      active: connection ? connection.active : false,
    });
  }

  return res.status(200).json(results);
}
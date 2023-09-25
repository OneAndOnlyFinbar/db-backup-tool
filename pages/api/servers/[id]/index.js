import { Server, Database } from '@/lib/db';
import { getSession } from 'next-auth/react';

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session)
    return res.status(401).json({ error: 'Unauthorized' });

  let server = await Server.findOne({
    where: {
      id: req.query.id
    }
  });

  if(!server)
    return res.status(404).json({ error: 'Server not found' });

  switch(req.method) {
    case 'GET': {
      const databases = await Database.findAll({
        where: {
          serverId: server.id
        }
      });

      return res.status(200).json({ ...server, databases });
    }
    case 'PATCH': {
      const { tracked } = req.body;

      if (typeof tracked !== 'boolean')
        return res.status(400).json({ error: 'Invalid track value' });

      const updatedServer = await server.update({
        tracked
      })

      return res.status(200).json(updatedServer);
    }
  }
}
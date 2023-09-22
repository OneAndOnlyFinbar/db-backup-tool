import { Server, Database } from '@/lib/db';
import { getSession } from 'next-auth/react';

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session)
    return res.status(401).json({ error: 'Unauthorized' });

  let server = await Server.findOne({
    where: {
      id: req.query.id
    },
    include: [
      {
        model: Database,
        required: false,
        as: 'databases',
      }
    ]
  });

  if(!server)
    return res.status(404).json({ error: 'Server not found' });

  return res.status(200).json(server);
}
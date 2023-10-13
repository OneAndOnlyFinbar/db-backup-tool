import Backups from "@/lib/db/backups";
import { getSession } from "next-auth/react";

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session)
    return res.status(401).json({ error: 'Unauthorized' });

  const { serverId, databaseName } = req.body;


  if (!serverId && serverId !== 0)
    return res.status(400).json({ error: 'Missing serverId' });

  if (!databaseName)
    return res.status(400).json({ error: 'Missing databaseName' });

  const backups = await Backups.findAll({
    where: {
      serverId,
      db: databaseName
    },
    attributes: ['id', 'serverId', 'db', 'date', 'deleteAfter', 'size', 'status']
  });

  return res.status(200).json(backups);
}
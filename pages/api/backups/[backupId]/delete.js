import { getSession } from "next-auth/react";
import { Backup } from "@/lib/db";
import * as fs from 'fs';
import * as path from 'path';

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session)
    return res.status(401).json({ error: 'Unauthorized' });

  const { backupId } = req.query;

  if (!backupId)
    return res.status(400).json({ error: 'Missing backupId' });

  const backup = await Backup.findOne({
    where: {
      id: backupId
    },
    attributes: ['id']
  })

  if (!backup)
    return res.status(404).json({ error: 'Backup not found in database' });

  const filePath = path.join(process.env.LOCAL_STORAGE_DIRECTORY, `${backup.id}.sql`);

  if (fs.existsSync(filePath))
    fs.unlinkSync(filePath);

  await backup.destroy();

  return res.status(200).json({ success: true });
}
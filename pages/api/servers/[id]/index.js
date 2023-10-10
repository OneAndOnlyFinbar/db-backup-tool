import { Server, Database } from "@/lib/db";
import { getSession } from "next-auth/react";

const { sshConnectionManager } = require('@/lib/utils/SSHConnectionManager');

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session)
    return res.status(401).json({ error: "Unauthorized" });

  let server = await Server.findOne({
    where: {
      id: req.query.id
    }
  });

  if (!server)
    return res.status(404).json({ error: "Server not found" });

  switch (req.method) {
    case "GET": {
      if (!sshConnectionManager.initialized)
        await sshConnectionManager._init(await Server.findAll());

      const databases = await Database.findAll({
        where: {
          serverId: server.id
        }
      });

      const serverOnline = sshConnectionManager.connections[server.id] ? sshConnectionManager.connections[server.id].active : false;

      return res.status(200).json({ server, databases, active: serverOnline });
    }
    case "POST": {
      const { op, data } = JSON.parse(req.body);

      switch (op) {
        case "track": {
          const { tracked, databaseName } = data;

          if (typeof tracked !== "boolean")
            return res.status(400).json({ error: "Invalid track value" });

          if (!databaseName || typeof databaseName !== "string")
            return res.status(400).json({ error: "Invalid databaseName value" });

          const database = await Database.findOne({
            where: {
              serverId: server.id,
              name: databaseName
            }
          });

          if (!database)
            return res.status(404).json({ error: "Database not found" });

          if (database.serverId !== server.id)
            return res.status(400).json({ error: "Database does not belong to this server" });

          const updatedDatabase = await database.update({
            tracked
          });

          return res.status(200).json(updatedDatabase);
        }
        case "patch": {
          const { databaseName, retentionPeriod, retentionPeriodUnit, backupFrequency, backupFrequencyUnit } = data;

          if (typeof retentionPeriod !== "number" || retentionPeriod < 0)
            return res.status(400).json({ error: "Invalid retentionPeriod value" });

          if (typeof retentionPeriodUnit !== "string" || !["second", "minute", "hour", "day", "week", "month", "year"].includes(retentionPeriodUnit))
            return res.status(400).json({ error: "Invalid retentionPeriodUnit value" });

          if (typeof backupFrequency !== "number" || backupFrequency < 0)
            return res.status(400).json({ error: "Invalid backupFrequency value" });

          if (typeof backupFrequencyUnit !== "string" || !["second", "minute", "hour", "day", "week", "month", "year"].includes(backupFrequencyUnit))
            return res.status(400).json({ error: "Invalid backupFrequencyUnit value" });

          const database = await Database.findOne({
            where: {
              serverId: server.id,
              name: databaseName
            }
          });

          if (!database)
            return res.status(404).json({ error: "Database not found" });

          if (database.serverId !== server.id)
            return res.status(400).json({ error: "Database does not belong to this server" });

          const updatedDatabase = await database.update({
            retentionPeriod,
            retentionPeriodUnit,
            backupFrequency,
            backupFrequencyUnit
          });

          return res.status(200).json(updatedDatabase);
        }
        default: {
          return res.status(400).json({ error: "Invalid op value" });
        }
      }
    }
    default: {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }
}
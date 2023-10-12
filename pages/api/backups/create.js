import { sshConnectionManager } from "@/lib/utils/SSHConnectionManager";
import { Database, Server, Backup } from "@/lib/db";
import { v4 as uuid } from "uuid";
import * as fs from 'fs';

export default async (req, res) => {
  const { serverId, databaseName } = JSON.parse(req.body);

  const DBServer = await Server.findOne({
    where: {
      id: serverId
    }
  })

  if (!DBServer)
    return res.status(404).json({ error: "Server not found" });

  const DBDatabase = await Database.findOne({
    where: {
      serverId,
      name: databaseName
    }
  });

  if (!DBDatabase)
    return res.status(404).json({ error: "Database not found" });

  if(!DBDatabase.tracked)
    return res.status(400).json({ error: "Database is not being tracked" });

  if (!sshConnectionManager.initialized)
    await sshConnectionManager._init(await Server.findAll());

  const cachedServer = sshConnectionManager.connections[serverId];

  if (!cachedServer)
    return res.status(404).json({ error: "Server not found" });

  if (!cachedServer.active)
    return res.status(400).json({ error: "Server is offline/unavailable." });

  const { client } = cachedServer;

  try {
    await new Promise((resolve) => {
      client.exec(`mkdir -p ${process.env.REMOTE_CHECKOUT_DIRECTORY}`, (err, stream) => {
        if (err)
          throw new Error(err);

        stream.on('close', (code, signal) => {
          if (code !== 0)
            throw new Error(`Process exited with code ${code}`);

          resolve();
        }).on('data', (data) => {
          console.log(data.toString());
        }).stderr.on('data', (data) => {
          console.log(data.toString());
        });
      });
    })

    await new Promise((resolve) => {
      client.exec(`mysqldump -u ${DBServer.mysqlUsername} -p${DBServer.mysqlPassword} ${databaseName} > ${process.env.REMOTE_CHECKOUT_DIRECTORY}/${databaseName}.sql`, (err, stream) => {
        if (err)
          throw new Error(err);

        stream.on('close', (code, signal) => {
          if (code !== 0)
            throw new Error(`Process exited with code ${code}`);

          resolve();
        }).on('data', (data) => {
          console.log(data.toString());
        }).stderr.on('data', (data) => {
          console.log(data.toString());
        });
      })
    })

    let response = '';
    await new Promise((resolve) => {
      client.exec(`cat ${process.env.REMOTE_CHECKOUT_DIRECTORY}/${databaseName}.sql`, (err, stream) => {
        if (err)
          throw new Error(err);

        stream.on('close', (code, signal) => {
          if (code !== 0)
            throw new Error(`Process exited with code ${code}`);

          resolve();
        }).on('data', (data) => {
          response += data.toString();
        }).stderr.on('data', (data) => {
          console.log(data.toString());
        });
      })
    })

    if (!fs.existsSync(process.env.LOCAL_STORAGE_DIRECTORY))
      fs.mkdirSync(process.env.LOCAL_STORAGE_DIRECTORY);

    const id = uuid();

    await Backup.create({
      id,
      serverId,
      db: databaseName,
      date: new Date().toISOString(),
      deleteAfter: Date.now() + [1000, 60000, 3600000, 86400000, 604800000, 2592000000][['second', 'minute', 'hour', 'day', 'week', 'month'].indexOf(DBDatabase.retentionPeriodUnit)] * DBDatabase.retentionPeriod,
      size: response.length,
      status: 1
    })

    fs.writeFileSync(`${process.env.LOCAL_STORAGE_DIRECTORY}/${id}.sql`, response);

    return res.status(200).json({ success: true });
  } catch (error) {
    await Backup.create({
      id: uuid(),
      serverId,
      db: databaseName,
      date: new Date().toISOString(),
      deleteAfter: Date.now() + [1000, 60000, 3600000, 86400000, 604800000, 2592000000][['second', 'minute', 'hour', 'day', 'week', 'month'].indexOf(DBDatabase.retentionPeriodUnit)] * DBDatabase.retentionPeriod,
      size: 0,
      status: 0
    });

    return res.status(400).json({ error: error.message });
  }
}
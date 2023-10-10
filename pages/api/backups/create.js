import { sshConnectionManager } from "@/lib/utils/SSHConnectionManager";
import { Database, Server } from "@/lib/db";

export default async (req, res) => {
  const { serverId, databaseName } = req.body;

  const DBServer = await Server.findOne({
    where: {
      id: serverId
    }
  })

  if (!DBServer)
    return res.status(404).json({ error: "Server not found" });

  const DBDatabase = await Database.findOne({
    where: {
      serverId: DBServer.id,
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

  client.exec(`mysqldump -u ${DBServer.mysqlUsername} -p${DBServer.mysqlPassword} ${databaseName} > ${process.env.REMOTE_CHECKOUT_DIRECTORY}/${databaseName}.sql`, (err, stream) => {
    if (err)
      return res.status(400).json({ error: err });

    stream.on('close', (code, signal) => {
      if (code === 0)
        return res.status(200).json({ success: true });

      return res.status(400).json({ error: `Process exited with code ${code}` });
    }).on('data', (data) => {
      console.log(data.toString());
    }).stderr.on('data', (data) => {
      console.log(data.toString());
    });
  })
}
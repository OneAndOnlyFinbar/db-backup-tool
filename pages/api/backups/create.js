import { sshConnectionManager } from "@/lib/utils/SSHConnectionManager";
import { Server } from "@/lib/db";

export default async (req, res) => {
  const { serverId, databaseName } = req.body;

  if (!sshConnectionManager.initialized)
    await sshConnectionManager._init(await Server.findAll());

  const server = sshConnectionManager.connections[serverId];

  if (!server)
    return res.status(404).json({ error: "Server not found" });

  if (!server.active)
    return res.status(400).json({ error: "Server is offline/unavailable." });

  const DBServer = await Server.findOne({
    where: {
      id: serverId
    }
  })

  if (!DBServer)
    return res.status(404).json({ error: "Server not found" });

  const { client } = server;

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
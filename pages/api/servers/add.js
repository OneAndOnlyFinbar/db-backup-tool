import { Sequelize } from 'sequelize';
import { Client } from 'ssh2';
import { Server, Database } from '@/lib/db';

export default async (req, res) => {
  const { name, serverIp, serverUsername, serverPassword, mysqlUsername, mysqlPassword, mysqlPort } = JSON.parse(req.body);

  if (!serverIp || !serverUsername || !serverPassword || !mysqlUsername || !mysqlPort)
    return res.status(400).json({ error: 'Missing required fields' });

  let sshConnection = false;
  let mysqlConnection = false;
  let sequelize;

  await new Promise((resolve) => {
    try {
      const ssh = new Client();

      ssh.on('ready', () => {
        sshConnection = true;
        ssh.end();
        resolve();
      });

      ssh.on('error', () => {
        resolve();
      });

      ssh.connect({
        host: serverIp,
        username: serverUsername,
        password: serverPassword
      });
    } catch {
      resolve();
    }
  });

  if(!sshConnection)
    return res.status(400).json({ error: 'SSH connection failed' });

  await new Promise(async (resolve) => {
    try {
      sequelize = new Sequelize({
        dialect: 'mysql',
        host: serverIp,
        port: mysqlPort,
        username: mysqlUsername,
        password: mysqlPassword
      })

      await sequelize.authenticate();
      mysqlConnection = true;

      resolve();
    } catch {
      resolve();
    }
  })

  if(!mysqlConnection)
    return res.status(400).json({ error: 'MySQL connection failed' });

  const server = await Server.create({
    name,
    ip: serverIp,
    port: mysqlPort,
    sshUsername: serverUsername,
    sshPassword: serverPassword,
    mysqlUsername,
    mysqlPassword
  })

  const databases = await sequelize.query(`SELECT schema_name AS database_name, (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = schema_name) AS table_count FROM information_schema.schemata;`);
  await sequelize.close();

  await Promise.all(databases[0].map(async (database) => {
    await Database.create({
      name: database.database_name,
      serverId: server.id,
      tracked: 0,
      retentionPeriod: null,
      backupFrequency: null,
      lastBackup: null,
      tableCount: database.table_count
    })
  }));

  res.status(200).json({
    status: true
  })
}
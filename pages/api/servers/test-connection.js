import { Sequelize } from 'sequelize';
import { Client } from 'ssh2';

export default async (req, res) => {
  const { serverIp, serverUsername, serverPassword, mysqlUsername, mysqlPassword, mysqlPort } = JSON.parse(req.body);

  if (!serverIp || !serverUsername || !serverPassword || !mysqlUsername || !mysqlPassword || !mysqlPort)
    return res.status(400).json({ error: 'Missing required fields' });

  let sshConnection = false;
  let mysqlConnection = false;

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

  await new Promise(async (resolve) => {
    try {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: serverIp,
        port: mysqlPort,
        username: mysqlUsername,
        password: mysqlPassword
      })

      await sequelize.authenticate();
      mysqlConnection = true;

      await sequelize.close();

      resolve();
    } catch {
      resolve();
    }
  })

  res.status(200).json({
    sshConnection,
    mysqlConnection
  });
}
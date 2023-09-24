import { Sequelize } from 'sequelize';
import { Client } from 'ssh2';

export default async (req, res) => {
  const { serverIp, serverUsername, serverPassword, mysqlUsername, mysqlPassword, mysqlPort } = req.body;

  let sshConnection = false;
  let mysqlConnection = false;

  const ssh = new Client();

  await new Promise((resolve) => {
    ssh.on('ready', () => {
      sshConnection = true;
      ssh.end();
      resolve();
    }).connect({
      host: serverIp,
      username: serverUsername,
      password: serverPassword
    })
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
    } catch (error) {
      resolve();
    }
  })

  res.status(200).json({
    sshConnection,
    mysqlConnection
  });
}
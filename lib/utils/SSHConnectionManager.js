const net = require('net');

class SSHConnectionManager {
  initialized = false;
  connections = {};
  servers = [];

  constructor() {
  }

  async _init(servers) {
    if(this.initialized)
      return;

    this.servers = servers;
    for (const server of servers)
      await this.connect(server);

    this.initialized = true;

    setInterval(() => {
      this.attemptReconnect();
    }, 5000);
  }

  async connect(server) {
    const client = new net.Socket();
    client.setKeepAlive(true, 5000);
    client.setTimeout(5000);

    client.on('connect', () => {
      console.log('Connected to server', server.id);
      this.connections[server.id].active = true;
      this.connections[server.id].client = client;
    });

    client.on('close', () => {
      console.log('Closed connection to server', server.id)
      this.connections[server.id].active = false;
    });

    client.on('end', () => {
      console.log('Ended connection to server', server.id)
      this.connections[server.id].active = false;
    });

    client.on('error', (err) => {
      console.log('Error connecting to server', server.id)
      this.connections[server.id].active = false;
    });

    client.connect({
      host: server.ip,
      port: 22,
      username: server.sshUsername,
      password: server.sshPassword,
    });

    if(!this.initialized)
      this.connections[server.id] = {
        active: true,
        client,
      };
  }

  async attemptReconnect() {
    const servers = this.servers.filter((server) => !this.connections[server.id].active);

    for (const server of servers)
      await this.connect(server);
  }
}

module.exports = {
  SSHConnectionManager,
  sshConnectionManager: new SSHConnectionManager()
}
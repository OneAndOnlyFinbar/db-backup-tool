import { Client } from 'ssh2';

class SSHConnectionManager {
  initialized = false;
  connections = {};
  servers = [];
  reconnectInterval = null;
  reconnecting = false;

  constructor() {
  }

  async _init(servers) {
    if (this.initialized || !servers) {
      return;
    }

    this.servers = servers;
    for (const server of servers) {
      await this.connect(server);
    }

    this.initialized = true;

    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        if (!this.reconnecting) {
          this.attemptReconnect();
        }
      }, 5000);
    }
  }

  async connect(server) {
    const conn = new Client();
    conn.on('ready', () => {
      if (process.env.LOG_SSH_MANAGER) console.log('Connected to server', server.id);
      this.connections[server.id].active = true;
      this.connections[server.id].client = conn;
    });

    conn.on('close', () => {
      if (process.env.LOG_SSH_MANAGER) console.log('Closed connection to server', server.id);
      this.connections[server.id].active = false;
    });

    conn.on('end', () => {
      if (process.env.LOG_SSH_MANAGER) console.log('Ended connection to server', server.id);
      this.connections[server.id].active = false;
    });

    conn.on('error', (err) => {
      if (process.env.LOG_SSH_MANAGER) console.log('Error on connection to server', server.id, err);
      this.connections[server.id].active = false;
    });

    conn.connect({
      host: server.ip,
      port: 22,
      username: server.sshUsername,
      password: server.sshPassword,
    });

    if (!this.initialized) {
      this.connections[server.id] = {
        active: true,
        client: conn,
      };
    }
  }

  async attemptReconnect() {
    this.reconnecting = true;
    const servers = this.servers.filter((server) => !this.connections[server.id].active);

    for (const server of servers) {
      await this.connect(server);
    }

    this.reconnecting = false;
  }
}

module.exports = {
  SSHConnectionManager,
  sshConnectionManager: new SSHConnectionManager(),
};
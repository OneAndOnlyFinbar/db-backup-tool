import { getSession } from 'next-auth/react';
import { useState, useRef } from 'react';
import Layout from '@/components/Layout';

export default function Servers() {
  const addServerButtonRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const nameRef = useRef(null);
  const [nameError, setNameError] = useState(null);

  const ipRef = useRef(null);
  const [ipError, setIpError] = useState(null);

  const portRef = useRef(null);
  const [portError, setPortError] = useState(null);

  const sshUsernameRef = useRef(null);
  const [sshUsernameError, setSshUsernameError] = useState(null);

  const sshPasswordRef = useRef(null);
  const [sshPasswordError, setSshPasswordError] = useState(null);

  const mysqlUsernameRef = useRef(null);
  const [mysqlUsernameError, setMysqlUsernameError] = useState(null);

  const mysqlPasswordRef = useRef(null);

  const validateInputs = (attr) => {
    if ((nameRef.current.value.length === 0 || nameRef.current.value.length > 255) && attr === 'name')
      setNameError('Server name must be between 1 and 255 characters');
    else if (attr === 'name')
      setNameError(null);

    if ((parseInt(portRef.current.value) < 0 || parseInt(portRef.current.value) > 65536) && attr === 'port')
      setPortError('Server port must be between 0 and 65536');
    else if (attr === 'port')
      setPortError(null);

    if ((ipRef.current.value.length === 0 || ipRef.current.value.length > 255) && attr === 'ip')
      setIpError('Server IP must be between 1 and 255 characters');
    else if (ipRef.current.value.match(/\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/) === null && attr === 'ip')
      setIpError('Server IP must be a valid IPv4 address');
    else if (attr === 'ip')
      setIpError(null);

    if ((sshUsernameRef.current.value.length === 0 || sshUsernameRef.current.value.length > 255) && attr === 'sshUsername')
      setSshUsernameError('SSH username must be between 1 and 255 characters');
    else if (attr === 'sshUsername')
      setSshUsernameError(null);

    if ((sshPasswordRef.current.value.length === 0) && attr === 'sshPassword')
      setSshPasswordError('SSH password cannot be empty');
    else if (attr === 'sshPassword')
      setSshPasswordError(null);

    if ((mysqlUsernameRef.current.value.length === 0 || mysqlUsernameRef.current.value.length > 255) && attr === 'mysqlUsername')
      setMysqlUsernameError('MySQL username must be between 1 and 255 characters');
    else if (attr === 'mysqlUsername')
      setMysqlUsernameError(null);

    const isFormValid =
      [nameError, ipError, portError, sshUsernameError, sshPasswordError, mysqlUsernameError].every((error) => error === null) &&
      [nameRef, ipRef, portRef, sshUsernameRef, sshPasswordRef, mysqlUsernameRef, mysqlPasswordRef].every((ref) => ref.current.value.length > 0);

    addServerButtonRef.current.disabled = !isFormValid;
  }

  const testConnection = () => {
    setConnectionStatus('Testing connection...');
    fetch('/api/servers/test-connection', {
      method: 'POST',
      body: JSON.stringify({
        serverIp: ipRef.current.value,
        serverUsername: sshUsernameRef.current.value,
        serverPassword: sshPasswordRef.current.value,
        mysqlUsername: mysqlUsernameRef.current.value,
        mysqlPassword: mysqlPasswordRef.current.value || null,
        mysqlPort: portRef.current.value
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setConnectionStatus(data.error ? data.error : `SSH Connection: ${data.sshConnection ? 'Success' : 'Failed'} | MySQL Connection: ${data.mysqlConnection ? 'Success' : 'Failed'}`);
      })
  }

  return (
    <Layout>
      <title>Add Database Server</title>
      <div className="flex flex-col w-[1000px] mt-8 mx-auto pb-12">
        <h1 className="text-2xl font-light select-none">Add Database Server</h1>
        <div className="flex flex-col gap-y-1">
          <p className="text-gray-700 text-lg font-semibold mt-2">Server Name</p>
          <input type="text" className="py-2 px-4 outline-0" placeholder="Server Name" ref={nameRef} onChange={() => validateInputs('name')}/>
          {nameError && <p className="text-red-500 text-sm">{nameError}</p>}

          <p className="text-gray-700 text-lg font-semibold mt-2">Server IP</p>
          <input type="text" className="py-2 px-4 outline-0" placeholder="Server IP" ref={ipRef} onChange={() => validateInputs('ip')}/>
          {ipError && <p className="text-red-500 text-sm">{ipError}</p>}

          <p className="text-gray-700 text-lg font-semibold mt-2">Server Port</p>
          <input type="number" className="py-2 px-4 outline-0" placeholder="Server Port" min={0} max={65536} defaultValue={3306} ref={portRef} onChange={() => validateInputs('port')}/>
          {portError && <p className="text-red-500 text-sm">{portError}</p>}

          <p className="text-gray-700 text-lg font-semibold mt-6">SSH Username</p>
          <input type="text" className="py-2 px-4 outline-0" placeholder="SSH Username" ref={sshUsernameRef} onChange={() => validateInputs('sshUsername')}/>
          {sshUsernameError && <p className="text-red-500 text-sm">{sshUsernameError}</p>}

          <p className="text-gray-700 text-lg font-semibold mt-2">SSH Password</p>
          <input type="text" className="py-2 px-4 outline-0" placeholder="SSH Password" ref={sshPasswordRef} onChange={() => validateInputs('sshPassword')}/>
          {sshPasswordError && <p className="text-red-500 text-sm">{sshPasswordError}</p>}

          <p className="text-gray-700 text-lg font-semibold mt-6">MySQL Username</p>
          <input type="text" className="py-2 px-4 outline-0" placeholder="MySQL Username" ref={mysqlUsernameRef} onChange={() => validateInputs('mysqlUsername')}/>
          {mysqlUsernameError && <p className="text-red-500 text-sm">{mysqlUsernameError}</p>}

          <p className="text-gray-700 text-lg font-semibold mt-2">MySQL Password</p>
          <input type="text" className="py-2 px-4 outline-0" placeholder="MySQL Password" ref={mysqlPasswordRef} onChange={() => validateInputs('mysqlPassword')}/>
        </div>

        <div className="flex flex-row justify-end gap-x-4 mt-6">
          <button className="bg-white px-4 py-2 rounded-md hover:scale-101 duration-100" onClick={testConnection}>Test Connection</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:scale-101 disabled:hover:scale-100 duration-100 disabled:cursor-not-allowed disabled:opacity-75" ref={addServerButtonRef} disabled={true}>Add
            Server
          </button>
        </div>

        {connectionStatus && <p className="text-gray-700 font-semibold flex justify-end mt-4">{connectionStatus}</p>}
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
import { getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Servers() {
  const [servers, setServers] = useState([]);
  const [loadingError, setLoadingError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return () => {
      fetch('/api/servers')
        .then((res) => res.json())
        .then((data) => {
          if(data.error)
            setLoadingError(data.error);
          else
            setServers(data);
          setLoading(false);
        });
    };
  }, []);


  return (
    <Layout>
      <title>Database Servers</title>
      <div className="flex flex-col gap-y-6 items-center justify-center mx-32 mt-8">
        {loading && <p className="text-gray-500 text-lg">Loading...</p>}
        {loadingError && <p className="text-red-500 text-lg">Error loading servers: {loadingError}</p>}
        {servers?.map((server, index) => (
          <Link href={`/server/${server.id}`} className="flex flex-col w-3/4 bg-white rounded-lg p-2 px-5 shadow-sm hover:shadow-md transition duration-200 ease-in-out">
            <h1 className="font-semibold text-xl">{server.name}</h1>
            <p className="text-sm text-gray-500 mb-1">{server.ip}:{server.port}</p>
            <p className="text-sm text-gray-500">Tracking <span className="font-semibold">3</span> databases</p>
            <p className="text-sm text-gray-500">Server Status: <span className={server.status ? "text-green-500" : "text-red-500"}>{server.status ? 'Online' : 'Offline'}</span></p>
            <p className="text-sm text-gray-500">Backup Status: <span className="text-green-500">Backup Completed</span></p>
          </Link>
        ))}
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
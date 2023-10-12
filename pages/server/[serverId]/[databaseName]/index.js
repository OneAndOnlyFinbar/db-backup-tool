import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Backup from "@/components/pages/server/backups/Backup";
import { useEffect, useState } from "react";

export default function Backups(props) {
  const [backups, setBackups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/backups/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serverId: props.serverId,
        databaseName: props.databaseName
      })
    }).then(res => res.json()).then(res => {
      if (!res.error)
        setBackups(res);
    })
  }, []);

  return (
    <Layout>
      <title>Backups</title>
      <div className="flex flex-col pb-12 mx-auto md:max-w-[1000px] w-3/4">
        <h1 className="text-2xl font-light select-none my-2">Backups for {props.databaseName}</h1>
        <div className="flex flex-col gap-y-4">
          {backups.map(backup => <Backup data={backup}/>)}
        </div>
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

  const { serverId, databaseName } = context.query;

  if (!serverId)
    return {
      redirect: {
        destination: '/servers',
        permanent: false
      }
    }

  if (!databaseName)
    return {
      redirect: {
        destination: `/server/${serverId}`,
        permanent: false
      }
    }

  return {
    props: {
      serverId,
      databaseName
    }
  }
}
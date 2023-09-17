import { useState } from 'react';
import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';

export default function Server() {
  const [tracked, setTracked] = useState([{
    id: 1,
    name: 'ProductionDB'
  }]);
  const [untracked, setUntracked] = useState([{
    id: 1,
    name: 'DevelopmentDB'
  }]);

  return (
    <Layout>
      <title>Server</title>
      <div className="flex flex-col w-[1000px] mt-8 mx-auto">
        <h1 className="text-2xl font-light select-none">Tracked Databases</h1>

        {tracked.map((database, index) => (
          <div className="flex flex-col w-full bg-white rounded-lg p-2 px-5 shadow-sm mt-2">
            <h1 className="font-semibold text-xl">{database.name}</h1>
            <p className="text-sm text-gray-500"><span className="font-semibold">3</span> tables</p>
            <p className="text-sm text-gray-500"><span className="font-semibold">7</span> backups</p>
            <p className="text-sm text-gray-500">Backup interval: <span className="font-semibold">every hour</span></p>
            <p className="text-sm text-gray-500">Last backup: <span className="font-semibold">1 hour ago</span></p>
            <p className="text-sm text-gray-500">Current Status: <span className="font-semibold text-green-500">Backup Completed</span></p>
            <p className="text-sm text-gray-500">Current Status: <span className="font-semibold text-yellow-600">Running backup</span></p>
            <p className="text-sm text-gray-500">Current Status: <span className="font-semibold text-red-500">Backup Failed</span></p>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex flex-row items-center gap-x-2 mb-1">
              <p className="text-gray-500 hover:underline cursor-pointer">Backup Now</p>
              <p className="text-gray-200 select-none">|</p>
              <p className="text-gray-500 hover:underline cursor-pointer">View Backups</p>
              <p className="text-gray-200 select-none">|</p>
              <p className="text-gray-500 hover:underline cursor-pointer">Edit</p>
              <p className="text-gray-200 select-none">|</p>
              <p className="text-red-500 hover:underline cursor-pointer">Untrack</p>
            </div>
          </div>
        ))}

        <h1 className="text-2xl font-light select-none mt-4">Untracked Databases</h1>

        {untracked.map((database, index) => (
          <div className="flex flex-col w-full bg-white rounded-lg p-2 px-5 shadow-sm mt-2">
            <h1 className="font-semibold text-xl">{database.name}</h1>
            <p className="text-sm text-gray-500"><span className="font-medium">3</span> tables</p>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex flex-row items-center gap-x-2 mb-1">
              <p className="text-gray-500 hover:underline cursor-pointer">Start Tracking</p>
            </div>
          </div>
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
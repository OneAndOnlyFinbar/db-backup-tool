import { Inter } from 'next/font/google'
import { getSession, useSession } from 'next-auth/react';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center mx-32 mt-8">
        <div className="flex flex-col w-3/4 bg-white rounded-lg p-2 px-5">
          <h1 className="font-semibold text-xl">Server Name</h1>
          <p className="text-sm text-gray-500 mb-1">192.168.1.1:3306</p>
          <p className="text-sm text-gray-500">Tracking <span className="font-medium">3</span> databases</p>
          <p className="text-sm text-gray-500">Server Status: <span className="text-green-500">Online</span></p>
          <p className="text-sm text-gray-500">Backup Status: <span className="text-green-500">Backup Completed</span></p>
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

  return {
    props: {}
  }
}
import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Servers() {
  return (
    <Layout>
      <title>Database Servers</title>
      <div className="flex flex-col items-center justify-center mx-32 mt-8">
        <Link href="/server/test" className="flex flex-col w-3/4 bg-white rounded-lg p-2 px-5 shadow-sm hover:shadow-md transition duration-200 ease-in-out">
          <h1 className="font-semibold text-xl">Server Name</h1>
          <p className="text-sm text-gray-500 mb-1">192.168.1.1:3306</p>
          <p className="text-sm text-gray-500">Tracking <span className="font-semibold">3</span> databases</p>
          <p className="text-sm text-gray-500">Server Status: <span className="text-green-500">Online</span></p>
          <p className="text-sm text-gray-500">Backup Status: <span className="text-green-500">Backup Completed</span></p>
        </Link>
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
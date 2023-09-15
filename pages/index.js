import { Inter } from 'next/font/google'
import { getSession, useSession } from 'next-auth/react';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center mx-32 mt-8">
        <div className="flex items-center h-12 w-3/4 bg-white rounded-lg p-2 px-5">
          <p className="font-light">{new Date().toLocaleDateString()}</p>
          <div className="flex-grow"></div>
          <p className="font-light">Today's Snapshot</p>
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
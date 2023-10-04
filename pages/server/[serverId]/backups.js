import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';

export default function Backups(props) {
  return (
    <Layout>
      <title>Backups</title>
      <div className="flex flex-col pb-12 mx-auto md:max-w-[1000px] w-3/4">

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

  const { serverId } = context.query;

  if (!serverId)
    return {
      redirect: {
        destination: '/servers',
        permanent: false
      }
    }

  return {
    props: {
      serverId
    }
  }
}
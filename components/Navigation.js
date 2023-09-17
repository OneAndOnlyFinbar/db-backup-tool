import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navigation(props) {
  const { data: session } = useSession()

  return (
    <div className="flex flex-row items-center justify-between p-4 pt-8 mx-16">
      <div className="flex flex-row items-center gap-x-8">
        <Link href="/" className="text-xl cursor-pointer font-light duration-100 hover:scale-[101%]">Servers</Link>
        <p className="text-xl cursor-pointer font-light duration-100 hover:scale-[101%]">User Management</p>
      </div>
      {session && <p>Signed in as <span className="font-semibold">{session.user.name}</span></p>}
    </div>
  )
}
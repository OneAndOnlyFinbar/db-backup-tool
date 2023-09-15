import { signIn, useSession } from 'next-auth/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Navigation(props) {
  const { data: session } = useSession()

  return (
    <div className={`flex flex-row items-center justify-between p-4 pt-8 mx-16 ${inter.className}`}>
      <div className="flex flex-row items-center gap-x-8">
        <p className="text-xl cursor-pointer font-light duration-100 hover:scale-[101%]">Snapshots</p>
        <p className="text-xl cursor-pointer font-light duration-100 hover:scale-[101%]">Routines</p>
        <p className="text-xl cursor-pointer font-light duration-100 hover:scale-[101%]">User Management</p>
      </div>
      {session && <p>Signed in as <span className="font-semibold">{session.user.name}</span></p>}
    </div>
  )
}
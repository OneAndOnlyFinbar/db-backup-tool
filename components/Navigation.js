import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';

export default function Navigation(props) {
  const { data: session } = useSession()
  const [width, setWidth] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setWidth(window.innerWidth)
    window.addEventListener('resize', () => setWidth(window.innerWidth))
  }, [])

  return (
    width > 768 ? (
      <div className="flex flex-row items-center justify-between p-4 pt-8 mx-16">
        <div className="flex flex-row items-center gap-x-8">
          <Link href="/" className="text-xl cursor-pointer font-light duration-100 hover:scale-[101%]">Servers</Link>
          <p className="text-xl cursor-pointer font-light duration-100 hover:scale-[101%]">User Management</p>
        </div>
        {session && <p>Signed in as <span className="font-semibold">{session.user.name}</span></p>}
      </div>
    ) : (
      <div>
        <div className="w-screen py-4 px-6">
          <FaBars className="text-2xl cursor-pointer" onClick={() => setOpen(!open)}/>
        </div>
        {open && (
          <div className="flex flex-col justify-center w-screen px-6">
            <Link href="/" className="text-xl cursor-pointer font-light duration-100 hover:scale-[101%]">Servers</Link>
            <p className="text-xl cursor-pointer font-light duration-100 hover:scale-[101%]">User Management</p>
          </div>
        )}
      </div>
    )
  )
}
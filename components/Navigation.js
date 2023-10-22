import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FaBars, FaServer, FaUserCircle, FaLock } from 'react-icons/fa';
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
      <div className="flex flex-row items-center justify-between p-4 pt-8 mx-16 mb-4">
        <div className="flex flex-row items-center gap-x-8">
          <div className="flex flex-row gap-x-2 items-center hover:scale-[101%]">
            <FaServer/>
            <Link href="/" className="text-xl cursor-pointer font-light duration-100">Servers</Link>
          </div>
          <div className="flex flex-row gap-x-2 items-center hover:scale-[101%]">
            <FaUserCircle/>
            <p className="text-xl cursor-pointer font-light duration-100">User Management</p>
          </div>
          <div className="flex flex-row gap-x-2 items-center hover:scale-[101%]">
            <FaLock/>
            <p className="text-xl cursor-pointer font-light duration-100">Authentication Stores</p>
          </div>
        </div>
        {session && <p>Signed in as <span className="font-semibold">{session.user.name}</span></p>}
      </div>
    ) : (
      <div>
        <div className="flex flex-row justify-between w-screen px-4 pt-4 mb-4">
          <FaBars className="text-2xl cursor-pointer" onClick={() => setOpen(!open)}/>
          {session && <p>Signed in as <span className="font-semibold">{session.user.name}</span></p>}
        </div>
        {open && (
          <div className="flex flex-col justify-center w-screen px-4 mb-4 gap-y-4">
            <div className="flex flex-row gap-x-2 items-center hover:scale-[101%]">
              <FaServer/>
              <Link href="/" className="text-xl cursor-pointer font-light duration-100">Servers</Link>
            </div>
            <div className="flex flex-row gap-x-2 items-center hover:scale-[101%]">
              <FaUserCircle/>
              <p className="text-xl cursor-pointer font-light duration-100">User Management</p>
            </div>
            <div className="flex flex-row gap-x-2 items-center hover:scale-[101%]">
              <FaLock/>
              <p className="text-xl cursor-pointer font-light duration-100">Authentication Stores</p>
            </div>
          </div>
        )}
      </div>
    )
  )
}
import Link from 'next/link'
import React from 'react'
import { MdAccountCircle } from 'react-icons/md'
import { AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai'
import { signIn, useSession, signOut } from 'next-auth/react'

import logo from '../assets/logo.png'

const Header = () => {
  const { data: session } = useSession()
  return (
    <header className="mx-auto flex max-w-7xl justify-between p-5">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            src="https://miro.medium.com/max/8978/1*s986xIGqhfsN8U--09_AdA.png"
            alt="main-logo"
            className="w-44 cursor-pointer object-contain"
          />
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full bg-green-600 px-4 py-1 text-white">
            {session ? (
              <Link
                href={{
                  pathname: '/detail/[userId]',
                  query: { userId: session?.user?.id },
                }}
              >
                My Profile
              </Link>
            ) : (
              'Follow'
            )}
          </h3>
        </div>
      </div>
      <div className="text-md flex items-center space-x-1 md:space-x-5">
        {session && (
          <>
            <div className="block cursor-pointer items-center gap-2 px-4 py-1 text-black transition-all duration-100 ease-in md:hidden">
              <Link
                href={{
                  pathname: '/detail/[userId]',
                  query: { userId: session?.user?.id },
                }}
              >
                <MdAccountCircle size={30} />
              </Link>
            </div>

            <div
              className="flex cursor-pointer items-center gap-2 rounded-full border border-red-600 px-4 py-1 text-red-600 transition-all duration-100 ease-in hover:bg-red-600 hover:text-white"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <span className="block md:hidden">
                <AiOutlineLogout size={30} />
              </span>
              <h3 className="hidden md:block">Sign Out</h3>
            </div>
          </>
        )}
        {!session && (
          <div
            className="flex cursor-pointer flex-row items-center gap-2 rounded-full border border-green-600 px-4 py-1 text-green-600 transition-all duration-100 ease-in hover:bg-green-600 hover:text-white"
            onClick={() =>
              signIn('google', {
                callbackUrl: '/',
              })
            }
          >
            <span className="block md:hidden">
              <AiOutlineLogin size={30} />
            </span>
            <h3 className="hidden md:block">Sign In</h3>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

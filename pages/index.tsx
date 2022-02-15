import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import dynamic from 'next/dynamic'
const Map = dynamic(
  () => {
    return import('../components/map')
  }, {ssr: false});

const Home: NextPage = () => {
  return (
    <div className="p-6">
      <Head>
        <title>T16 - Dashboard</title>
        <meta name="description" content="Dashboard for NTP use" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid overflow-hidden grid-cols-4 grid-rows-5 gap-2">
        <div className="row-span-5 col-span-3">
          <h1 className="font-bold text-xl md:text-2xl lg:text-5xl">Dashboard</h1>
          <div className='mt-2'>
            <Map></Map>
          </div>
        </div>
        <div className="row-span-2 min-w-full min-h-full h-32">
          <h1 className="m-2 font-bold text-xl md:text-2xl lg:text-5xl">Current Missions</h1>
        </div>
        <div className="row-span-2 min-w-full min-h-full h-32">
          <h1 className="m-2 font-bold text-xl md:text-2xl lg:text-5xl">Past Missions</h1>
        </div>
        <div className="min-w-full min-h-full h-32 p-2 flex flex-col justify-center items-center">
          <Link href="/login" passHref>
            <button className="w-full px-3 py-2 my-2 border bg-purple-500 hover:bg-purple-700 rounded-md shadow-sm text-sm leading-5 text-white font-semibold">Login</button>
          </Link>
          <Link href="/register" passHref>
            <button className="w-full px-3 py-2 my-2 border rounded-md hover:bg-slate-100 shadow-sm text-sm leading-5 font-semibold">Register</button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { parseISO } from 'date-fns'
import { IQuery } from '../../types/query';

const Query: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    let [query, setQuery] = useState<IQuery | undefined>(undefined);

    useEffect(() => {
        axios(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/query/${id}`).then(res => {
			if (res.data.status === 200) {
                setQuery({
                    id: res.data.query['_id'],
                    name: res.data.query['name'],
                    location: res.data.query['location'],
                    startDate: parseISO(res.data.query['startDate']),
                    endDate: parseISO(res.data.query['endDate']),
                    keywords: res.data.query['keywords'],
                    frequency: res.data.query['frequency'],
                    maxTweets: res.data.query['maxTweets']
                });
            }
            else setQuery(undefined);
        }).catch(err => {
            console.log(err);
            setQuery(undefined);
        });
    }, [id]);

    return (
        <div className="p-8">
            <Head>
                <title>T16 - {query?.name}</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="min-h-screen p-16 flex flex-1 flex-col justify-center items-center">
                <h1 className="text-2xl font-bold">{query?.name}</h1>
            </main>
        </div>
    );
}

export default Query
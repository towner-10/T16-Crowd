import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { IQuery } from '../../types/query';
import { QueryHeatmap } from '../../components/map'
import { ITweet } from '../../types/tweet'

const Query: NextPage = () => {

    // Get the query id from the url
    const router = useRouter();
    const { id } = router.query;

    // State for the tweets and the query
    let [tweets, setTweets] = useState<ITweet[] | undefined>(undefined);
    let [query, setQuery] = useState<IQuery | undefined>(undefined);

    useEffect(() => {
        // Get the query
        axios(`${process.env.NEXT_PUBLIC_API_URL}/query/${id}`).then(res => {

            // Set the query on success
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

        // Get the tweets
        axios(`${process.env.NEXT_PUBLIC_API_URL}/query/${id}/tweets?limit=5`).then(res => {

            // Set the tweets on success
            if (res.data.status === 200) {
                let tweetsList: ITweet[] = [];
                for (let query of res.data['tweets']) {
                    tweetsList.push({
                        id: query['id'],
                        queryID: query['qId'],
                        likes: query['likes'],
                        retweets: query['rt'],
                        replies: query['rp'],
                        media: query['media'],
                        createdAt: parseISO(query['date']),
                        location: query['loc'],
                        content: query['content'],
                        keywordCount: query['kc'],
                        interactionScore: query['is'],
                        relatabilityScore: query['rs']
                    });
                }
                setTweets(tweetsList);
            }
            else setTweets(undefined);
        }).catch(err => {
            console.log(err);
        });
    }, [id]); // Only run when the id changes

    return (
        <>
            <Head>
                <title>T16 - Dashboard</title>
                <meta name="description" content="Dashboard for NTP use" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='h-screen bg-white dark:bg-stone-900'>
                <main className="p-2 grid overflow-hidden grid-cols-4 grid-rows-5 gap-2">
                    <div className="row-span-5 col-span-3">
                        <h1 className="font-bold text-xl md:text-xl xl:text-4xl dark:text-white">{query?.name}</h1>
                        <div className='mt-2 rounded-md'>
                            <QueryHeatmap id={id as string} />
                        </div>
                    </div>
                    <div className="row-span-3 min-w-full min-h-full overflow-hidden">
                        <h1 className="m-2 font-bold text-xl md:text-xl xl:text-4xl dark:text-white">Quick View</h1>
                        <div className='overflow-y-auto' style={{ height: '50vh' }}>
                            {tweets && tweets.map((tweet, index) => {

                                // Check each piece of media on the tweet and display it whether it's a photo or a video
                                return (
                                    <div key={index} className="block m-3 p-6 bg-white rounded-lg border border-stone-200 shadow-md dark:bg-stone-800 dark:border-stone-700">
                                        <div className="m-2">
                                            {tweet.media && tweet.media.length > 0 && tweet.media.map((media, index) => {
                                                if (media.type === 'video') {
                                                    return (
                                                        <video key={index} className="rounded-md" controls>
                                                            <source src={media.url} type="video/mp4" />
                                                        </video>
                                                    );
                                                }
                                                else if (media.type === 'photo') {
                                                    // Does not use the <Image> component because the image is loaded asynchronously
                                                    return (
                                                        <img key={index} className="rounded m-2" src={media.url} alt="media" />
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="row-span-2 min-w-full min-h-full">
                        <h1 className="m-2 font-bold text-xl md:text-xl xl:text-4xl dark:text-white">Top 5 Tweets</h1>
                        <div className='overflow-y-auto' style={{ height: '30vh' }}>
                            {tweets && tweets.map((tweet, index) => {
                                // Display the top 5 tweets
                                return (
                                    <div key={index} className="block m-3 p-6 bg-white rounded-lg border border-stone-200 shadow-md dark:bg-stone-800 dark:border-stone-700">
                                        <h5 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white break-words">Tweet: {tweet.id}</h5>
                                        <h5 className="mb-2 text-l tracking-tight text-stone-900 dark:text-stone-200">{format(tweet.createdAt, 'yyyy/MM/dd')} - {tweet.relatabilityScore.toFixed(2)} score</h5>
                                        <p className="font-normal text-stone-700 dark:text-stone-400"><span className='font-bold'>Likes: </span>{tweet.likes}</p>
                                        <p className="font-normal text-stone-700 dark:text-stone-400"><span className='font-bold'>Matches: </span><span className='italic'>{tweet.keywordCount}</span> keywords matched</p>
                                        <p className="font-normal text-stone-700 dark:text-stone-400"><span className='font-bold'>Media: </span><span className='italic'>{tweet.media.length}</span> pieces of content</p>
                                        <p className="font-normal text-stone-700 dark:text-stone-400"><span className='font-bold'>Link: </span><span className='italic'><a target='_blank' href={`https://twitter.com/anyuser/status/${tweet.id}`} rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300'>Twitter</a></span></p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Query
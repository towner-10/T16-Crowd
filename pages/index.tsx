import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns'

// Disable server side rendering
const Map = dynamic(
  () => {
    return import('../components/map')
  }, {ssr: false});

interface IQuery {
  id: string;
	name: string;
  location: any;
  startDate: Date;
  endDate: Date;
  keywords: string[];
  frequency: number;
	maxTweets: number;
}

interface ITweet {
  id: string;
  queryID: string;
  likes: number;
  retweets: number;
  replies: number;
  content: string;
  media: any[];
  location: any;
  createdAt: Date;
  keywordCount: number;
  interactionScore: number;
  relatabilityScore: number;
}

// Image recognition
// Use Google Image Recognition API
// Assign data points from events to members
// One account
// Microsoft image recognition API

const Dashboard: NextPage = () => {

  let [queries, setQueries] = useState<IQuery[] | undefined>(undefined);
  let [tweets, setTweets] = useState<ITweet[] | undefined>(undefined);

  useEffect(() => {
    axios('http://127.0.0.1:5000/queries/active/list').then(res => {
			if (res.data.status === 200) {
        let queriesList: IQuery[] = [];
        for (let query of res.data['queries']) {
          queriesList.push({
            id: query['_id'],
            name: query['name'],
            location: query['location'],
            startDate: parseISO(query['startDate']),
            endDate: parseISO(query['endDate']),
            keywords: query['keywords'],
            frequency: query['frequency'],
            maxTweets: query['maxTweets']
          });
        }
				setQueries(queriesList);
			}
			else setQueries(undefined);
		}).catch(err => {
			console.log(err);
		});

    axios('http://127.0.0.1:5000/queries/active/list/tweets?limit=5').then(res => {
			if (res.data.status === 200) {
        let tweetsList: ITweet[] = [];
        for (let query of res.data['tweets']) {
          console.log(query);
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
			else setQueries(undefined);
		}).catch(err => {
			console.log(err);
		});
  }, []);

  return (
    <div className="h-screen bg-white dark:bg-gray-700">
      <Head>
        <title>T16 - Dashboard</title>
        <meta name="description" content="Dashboard for NTP use" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-2 grid overflow-hidden grid-cols-4 grid-rows-5 gap-2">
        <div className="row-span-5 col-span-3">
          <h1 className="font-bold text-xl md:text-xl xl:text-4xl dark:text-white">Dashboard</h1>
          <div className='mt-2 rounded-md'>
            <Map></Map>
          </div>
        </div>
        <div className="row-span-2 min-w-full min-h-full overflow-hidden">
          <h1 className="m-2 font-bold text-xl md:text-xl xl:text-4xl dark:text-white">Active Queries</h1>
          <div className='overflow-y-auto' style={{height: '30vh'}}>
            {queries && queries.map((query, index) => {
              return(
                <a key={index} href='#' className="block m-3 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{query.name}</h5>
                  <h5 className="mb-2 text-l tracking-tight text-gray-900 dark:text-gray-200">{format(query.startDate, 'yyyy/MM/dd')} to {format(query.endDate, 'yyyy/MM/dd')}</h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400"><span className='font-bold'>Keywords: </span>{query.keywords.toLocaleString().replaceAll(',', ', ')}</p>
                  <p className="font-normal text-gray-700 dark:text-gray-400"><span className='font-bold'>Frequency: </span><span className='italic'>{query.frequency}</span> min</p>
                  <p className="font-normal text-gray-700 dark:text-gray-400"><span className='font-bold'>Max Tweets: </span><span className='italic'>{query.maxTweets}</span></p>
                </a>
              );
            })}
          </div>
        </div>
        <div className="row-span-2 min-w-full min-h-full">
          <h1 className="m-2 font-bold text-xl md:text-xl xl:text-4xl dark:text-white">Top 5 Tweets</h1>
          <div className='overflow-y-auto' style={{height: '30vh'}}>
            {tweets && tweets.map((tweet, index) => {
              return(
                <div key={index} className="block m-3 p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white break-words">{tweet.id}</h5>
                  <h5 className="mb-2 text-l tracking-tight text-gray-900 dark:text-gray-200">{format(tweet.createdAt, 'yyyy/MM/dd')} - {tweet.relatabilityScore.toFixed(2)} score</h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400"><span className='font-bold'>Likes: </span>{tweet.likes}</p>
                  <p className="font-normal text-gray-700 dark:text-gray-400"><span className='font-bold'>Matches: </span><span className='italic'>{tweet.keywordCount}</span> keywords matches</p>
                  <p className="font-normal text-gray-700 dark:text-gray-400"><span className='font-bold'>Media: </span><span className='italic'>{tweet.media.length}</span> pieces of content</p>
                  <p className="font-normal text-gray-700 dark:text-gray-400"><span className='font-bold'>Link: </span><span className='italic'><a target='_blank' href={`https://twitter.com/anyuser/status/${tweet.id}`} rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300'>Twitter</a></span></p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="min-w-full min-h-full p-2 flex flex-col justify-center items-center">
          <Link href="/login" passHref>
            <button className="w-full px-3 py-2 my-2 rounded-md border-2 border-purple-700 bg-purple-600 hover:bg-purple-500 shadow-sm text-sm leading-5 font-semibold text-white">Login</button>
          </Link>
          <Link href="/register" passHref>
            <button className="w-full px-3 py-2 my-2 border rounded-md hover:bg-slate-100 dark:hover:bg-slate-500 shadow-sm text-sm leading-5 font-semibold dark:text-white">Register</button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
export interface ITweet {
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
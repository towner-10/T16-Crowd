export interface IQuery {
    id?: string;
    name: string;
    location: any;
    startDate: Date;
    endDate: Date;
    keywords: string[];
    frequency: number;
    maxTweets: number;
}
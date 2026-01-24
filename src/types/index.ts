export interface User {
    name: string;
    username: string;
    email: string;
    bio?: string;
    emailVerified: boolean;
}

export type ListType = 'watched' | 'watching' | 'pending' | 'favourites';

export interface ListItem {
    id: number;
    title: string;
    poster_path: string;
    media_type: 'movie' | 'tv';
    vote_average: number;
}

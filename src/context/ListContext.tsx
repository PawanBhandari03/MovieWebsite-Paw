import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ListType = 'watched' | 'watching' | 'pending' | 'favourites';

export interface ListItem {
    id: number;
    title: string;
    poster_path: string;
    media_type: 'movie' | 'tv';
    vote_average: number;
}

interface ListContextType {
    lists: Record<ListType, ListItem[]>;
    addToList: (item: ListItem, listType: ListType) => void;
    removeFromList: (id: number, listType: ListType) => void;
    checkListStatus: (id: number) => ListType | null;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider = ({ children }: { children: ReactNode }) => {
    const [lists, setLists] = useState<Record<ListType, ListItem[]>>(() => {
        const savedLists = localStorage.getItem('userLists');
        return savedLists ? JSON.parse(savedLists) : {
            watched: [],
            watching: [],
            pending: [],
            favourites: []
        };
    });

    useEffect(() => {
        localStorage.setItem('userLists', JSON.stringify(lists));
    }, [lists]);

    const addToList = (item: ListItem, listType: ListType) => {
        setLists(prev => {
            // Remove from other lists first if present
            const newLists = { ...prev };
            (Object.keys(newLists) as ListType[]).forEach(key => {
                newLists[key] = newLists[key].filter(i => i.id !== item.id);
            });

            // Add to target list
            newLists[listType] = [...newLists[listType], item];
            return newLists;
        });
    };

    const removeFromList = (id: number, listType: ListType) => {
        setLists(prev => ({
            ...prev,
            [listType]: prev[listType].filter(item => item.id !== id)
        }));
    };

    const checkListStatus = (id: number): ListType | null => {
        for (const [type, items] of Object.entries(lists)) {
            if (items.some(item => item.id === id)) {
                return type as ListType;
            }
        }
        return null;
    };

    return (
        <ListContext.Provider value={{ lists, addToList, removeFromList, checkListStatus }}>
            {children}
        </ListContext.Provider>
    );
};

export const useList = () => {
    const context = useContext(ListContext);
    if (context === undefined) {
        throw new Error('useList must be used within a ListProvider');
    }
    return context;
};

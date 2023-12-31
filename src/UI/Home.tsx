import {
    createRef,
    FormEvent,
    HTMLAttributes,
    KeyboardEventHandler,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { PS_context } from './components/single/PS_context';
import RoomCard from './components/RoomCard';
import { InfinitySpin } from 'react-loader-spinner';
import MiniSearch, { SearchResult } from 'minisearch';
import NewsCard from './components/NewsCard';

import targetFaceCluster from './assets/cluster_target_face_nobg.png';

import github from './assets/github.png';
import discord from './assets/discord.png';
import FAQ from './assets/FAQ.png';

import { twMerge } from 'tailwind-merge';

const minisearch = new MiniSearch({
    fields: ['title', 'desc'],
    storeFields: ['title', 'desc', 'userCount', 'section'],
    idField: 'title',
});

function TargetFaceWelcome({ className }: { className?: string }) {
    return (
        <div
            className={twMerge(
                'rounded-lg flex flex-col justify-center items-center overflow-hidden relative',
                className,
            )}
        >
            <img
                src={targetFaceCluster}
                alt="targetFaceCluster"
                className="opacity-70 h-auto min-h-[110%]"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black z-10 bg-gray-100 dark:bg-gray-600 opacity-10" />
            <div className="flex flex-col justify-between p-4 absolute">
                <h1 className="font-bold text-4xl text-center z-10 text-transparent">
          Welcome to Showcord!
                </h1>
                <h2 className="font-bold text-2xl text-center z-10 text-transparent">
          Chat with your friends and meet new people
                </h2>
            </div>
        </div>
    );
}

function News({ className }: { className?: string }) {
    const [news, setNews] = useState<any[]>([]);
    const { client } = useContext(PS_context);
    useEffect(() => {
        if (!client) return;
        client.queryNews(setNews);
    }, [client]);
    return (
        <div
            className={twMerge(
                'p-4 rounded-lg flex flex-col overflow-y-auto',
                className,
            )}
        >
            <h2 className="font-bold text-xl text-center mt-2">
        Latest News
            </h2>
            {news?.slice(0, -1).map((n, idx) => (
                <NewsCard key={idx} news={n} last={idx === news.length - 2} />
            ))}
        </div>
    );
}

function RoomList({ className }: { className?: string }) {
    const { client } = useContext(PS_context);
    const [roomsJSON, setRoomsJSON] = useState<any>({});
    const [input, setInput] = useState<string>('');
    const [miniSearchResults, setMiniSearchResults] = useState<SearchResult[]>(
        [],
    );
    const { setRoom } = useContext(PS_context);

    const formRef = createRef<HTMLFormElement>();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!client) return;
        client.queryRooms(setRoomsJSON);
    }, [client]);

    useEffect(() => {
        if (!roomsJSON?.chat) return;
        minisearch.removeAll();
        minisearch.addAll(roomsJSON.chat);
    }, [roomsJSON]);

    useEffect(() => {
        const search = minisearch.search(input, {
            fuzzy: 0.2,
            prefix: true,
        });
        setMiniSearchResults(search);
    }, [input, setMiniSearchResults]);

    useEffect(() => {
        const focus = () => {
            inputRef.current?.focus();
        };
        focus();
        window.addEventListener('focus', focus);
        return () => {
            window.removeEventListener('focus', focus);
        };
    }, []);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!client) return;
        client.join(input);
        setInput('');
    };

    const manageRoomCardClick = (str: string) => {
        if (!client) return;
        client.join(str);
    };

    const onKeyDown: KeyboardEventHandler = (e: any) => {
        if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowRight') {
            if (!formRef.current?.textContent) {
                setRoom(1);
                e.preventDefault();
                return;
            }
        }
        if ((e.key === 'Tab' && e.shiftKey) || e.key === 'ArrowLeft') {
            if (!formRef.current?.textContent) {
                setRoom(-1);
                e.preventDefault();
                return;
            }
        }
    };
    return (
        <div className={twMerge('p-4 rounded-lg overflow-y-auto', className)}>
            <h2 className="font-bold text-xl text-center">
        Rooms
            </h2>
            <span className="m-2 block">
        Find a chatroom for your favourite metagame or hobby!
                <form
                    ref={formRef}
                    onSubmit={onSubmit}
                >
                    <input
                        value={input}
                        ref={inputRef}
                        onKeyDown={onKeyDown}
                        onChange={(e) => {
                            setInput(e.target.value);
                        }}
                        className="w-full rounded my-1 p-2 placeholder-gray-175 bg-gray-376 dark:bg-gray-375"
                        placeholder="Search for a room"
                    />
                </form>
                <small className="text-gray-125 mb-4">
          Pressing enter will try to join the room.
                </small>

                <hr />
            </span>

            {miniSearchResults.length > 0 ?
                miniSearchResults?.sort((a: any, b: any) => b.userCount - a.userCount)
                    .map((room: any, idx: number) => (
                        <RoomCard onClick={manageRoomCardClick} key={idx} room={room} />
                    )) :
                roomsJSON ?
                    roomsJSON.chat?.sort((a: any, b: any) => b.userCount - a.userCount)
                        .map((room: any, idx: number) => (
                            <RoomCard onClick={manageRoomCardClick} key={idx} room={room} />
                        )) :
                    (
                        <div className="h-full flex items-center justify-center !bg-white">
                            <InfinitySpin
                                width="200"
                                color="#4fa94d"
                            />
                        </div>
                    )}
        </div>
    );
}

function SocialLinks({ className }: { className?: string }) {
    return (
        <div
            className={twMerge(
                'p-4 rounded text-white flex items-center justify-center flex-col gap-2 text-sm ',
                className,
            )}
        >
            <a
                id="discord"
                className="max-h-full min-h-0 flex items-center gap-2 w-full p-8 rounded-lg hover:bg-gray-601 dark:hover:bg-gray-700 cursor-pointer visited:text-black dark:text-white dark:hover:text-white dark:visited:text-white"
                target="_blank"
                href="https://discord.gg/kxNdKdWxW2"
            >
                <img
                    src={discord}
                    alt="discord"
                    height="50"
                    width="50"
                />
                <span>
                    <p>
            Found a bug or want to give us feedback? Join our Discord
            community to share your thoughts and help us improve!
                    </p>
                </span>
            </a>
            <a
                id="github"
                className="max-h-full min-h-0 flex items-center gap-2 w-full p-8 rounded-lg hover:bg-gray-601 dark:hover:bg-gray-700 cursor-pointer visited:text-black dark:text-white dark:hover:text-white dark:visited:text-white"
                target="_blank"
                href="https://github.com/singiamtel/Showcord"
            >
                <img
                    src={github}
                    alt="github"
                    height="50"
                    width="50"
                />
                <span>
                    <p>
            All of our code is open source and available on GitHub. Contribute,
            explore, and help us evolve!
                    </p>
                </span>
            </a>
            <a
                id="FAQ"
                className="max-h-full min-h-0 flex items-center gap-2 w-full p-8 rounded-lg hover:bg-gray-601 dark:hover:bg-gray-700 cursor-pointer text-black visited:text-black dark:text-white dark:hover:text-white dark:visited:text-white"
                target="_blank"
                // href="https://github.com/singiamtel/Showcord"
            >
                <img
                    src={FAQ}
                    alt="FAQ"
                    height="50"
                    width="50"
                />
                <span>
                    <p>
            Frequently asked questions
                    </p>
                </span>
            </a>
            <div id="links">
            </div>
        </div>
    );
}

export default function Home(props: HTMLAttributes<'div'>) {
    return (
        <div
            className={twMerge(
                'grid grid-cols-8 grid-rows-2 gap-6 m-6 [&>*]:bg-gray-100 dark:[&>*]:bg-gray-600',
                props.className,
            )}
        >
            <News className="col-span-5 row-span-1" />
            <RoomList className="col-span-3 row-span-2" />
            <TargetFaceWelcome className="col-span-3 row-span-1" />
            <SocialLinks className="col-span-2 row-span-1" />
        </div>
    );
}

// {"chat":[{"title":"Lobby","desc":"Still haven't decided on a room for you? Relax here amidst the chaos.","userCount":626,"section":"Official"},

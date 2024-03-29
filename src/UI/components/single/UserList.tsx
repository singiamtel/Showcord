import { useClientContext } from './ClientContext';
import { HTMLAttributes, useLayoutEffect, useState } from 'react';
import { Username } from '../Username';
import { isStaff, User } from '../../../client/user';
import { toID } from '@/utils/generic';
import { cn } from '@/lib/utils';

export default function UserList(props: Readonly<HTMLAttributes<HTMLDivElement> & {
    searchable?: boolean
}>) {
    const { client, currentRoom: room } = useClientContext();
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>('');

    const filteredUsers = users.filter((user) => toID(user.name).includes(toID(search)));

    useLayoutEffect(() => {
        const refreshUsers = () => {
            if (!room) return;
            setUsers([...room.users]);
        };

        refreshUsers();
        client.events.addEventListener('users', refreshUsers);
        return () => {
            client.events.removeEventListener('users', refreshUsers);
        };
    }, [client, room]);

    // separate users into staff and regular users
    const staff = filteredUsers.filter((user) => isStaff(user.name));
    const regular = filteredUsers.filter((user) => !isStaff(user.name));

    return (
        <div className={cn('bg-gray-sidebar-light dark:bg-gray-600 w-full p-2 overflow-y-auto whitespace-nowrap', props.className)}>
            {props.searchable && <input
                className="w-full text-sm h-10 py-1 mb-2 px-2 bg-gray-251 placeholder:text-gray-150 dark:bg-gray-700 rounded-md"
                type="text"
                placeholder="Search users"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />}
            {staff.length > 0 && <h2 className="text-sm font-bold text-gray-500 dark:text-gray-175 mb-2">Staff</h2>}
            {staff.map((user, index) => (
                <div key={index}>
                    <Username
                        user={user.name}
                        bold={isStaff(user.name)}
                        alignRight
                        idle={user.status === '!'}
                    />
                </div>
            ))}
            {
                staff.length > 0 && regular.length > 0 && <hr className="my-2" />
            }
            {regular.length > 0 && <h2 className="text-sm font-bold text-gray-500 dark:text-gray-175 mb-2">Users</h2>}
            {regular.map((user, index) => (
                <div key={index}>
                    <Username
                        user={user.name}
                        bold={isStaff(user.name)}
                        alignRight
                        idle={user.status === '!'}
                    />
                </div>
            ))}
        </div>
    );
}

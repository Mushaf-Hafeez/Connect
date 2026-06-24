import type { User } from "@/types/user"

import SearchedUser from "./SearchedUser"

const SearchedUsers = ({ users }: { users: User[] | null }) => {
  return (
    <ul className="mt-2 max-h-[50vh] scrollbar-none overflow-y-auto">
      {users === null
        ? null
        : users.length > 0
          ? users.map((user) => <SearchedUser key={user.id} user={user} />)
          : "No user found."}
    </ul>
  )
}

export default SearchedUsers

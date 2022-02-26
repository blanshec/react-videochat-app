import {createContext, useState} from "react";
import {OwnProps} from "./types";

import {User} from "./user.types";

const defaultUser: User = {
    user: {
        name: '',
        loggedIn: false
    },
    login: () => {},
    logout: () => {}
};

export const UserContext = createContext<User>(defaultUser);
export function UserProvider({children}: OwnProps) {
    const [user, setUser] = useState({name: '', loggedIn: false});

    const login = (name: string) => {
        setUser({name: name, loggedIn: true});
    };

    const logout = () => {
        setUser({name: '', loggedIn: false});
    };

    return (
     <UserContext.Provider value={{user, login, logout}}>
         {children}
     </UserContext.Provider>
    )
}

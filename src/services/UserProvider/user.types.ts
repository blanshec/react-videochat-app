export type User = {
    user: {
        name: string,
        loggedIn: boolean,
    },
    login(name: string): void,
    logout(): void,
}
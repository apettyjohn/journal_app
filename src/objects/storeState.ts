import {User} from "./user";

// For reference as to the contents of the redux store
export interface State {
    user?: User,
    users: Array<User>,
    value: string,
}
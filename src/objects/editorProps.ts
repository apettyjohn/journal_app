import {RawDraftContentState} from "draft-js";
import {DateTime} from "./dateTime";
import {User} from "./user";

export interface EditorProps {
    editorState?: RawDraftContentState,
    html?: Array<string>,
    date?: DateTime,
    user?: User,
    fileName?: string,
    toolbarOptions?: Array<string>,
    changed?: boolean
}
import './Loader.css'
import {useSelector} from "react-redux";
import {Store} from "../../reducers/reduxStore";

function Loader() {
    const loading = useSelector((state: Store) => state.loading);

    return (
        <div id="loader">
        </div>)
}
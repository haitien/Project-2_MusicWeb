import React, {Component} from "react";
import styles from './SearchBar.module.css'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from "@material-ui/core/InputBase";

class SearchBar extends Component {
    render() {
        return (
            <div className={styles.wrapper}>
                <SearchIcon className={styles.search_icon}/>
                <InputBase
                    placeholder="Search…"
                    className={styles.input}
                />
            </div>
        )
    }
}

export default SearchBar;
import React from 'react'
import { useHistory } from "react-router-dom";
import styles from "./styles.module.css";

export default function Entry({ setUsername }) {

  const history = useHistory();

  function formSubmitHandler(e) {
    e.preventDefault();
    
    const username = e.target.username.value;
    
    if (username) {
      setUsername(username);
      history.push("/rooms");
    }
  }

  return (
    <div>
      <h1 className={styles.heading}>react-chat</h1>
      <form onSubmit={formSubmitHandler} className={styles.usernameForm}>
        <label className={styles.usernameLabel}>
          Enter your username
        <input name="username" className={styles.usernameInput} type="text" />
        </label>
        <button className={styles.btn}>Enter</button>
      </form>
    </div>
  )
}

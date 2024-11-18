import React, { useEffect, useState } from "react";
import { fetchUsers } from "../utils/api";

function HomePage() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchUsers()
            .then((res) => setMessage(res.data.message))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="text-center margin-top">
            <h1>{message || "Welcome to LoadKaar!, Hurray"}</h1>
        </div>
    );
}

export default HomePage;

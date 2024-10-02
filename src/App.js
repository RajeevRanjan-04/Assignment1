import React, { useState, useEffect, useMemo } from "react";
import Card from "./Card";
import "./App.css"; // Import the CSS file
import add from "./img/add.svg";
import tdot from "./img/3dot.svg";
import Backlog from "./img/Backlog.svg";
import Todo from "./img/Todo.svg";
import progress from "./img/in-progress.svg";

const App = () => {
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState({});
  const [sortBy, setSortBy] = useState("priority");
  const [groupBy, setGroupBy] = useState("status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await fetch(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCards(data.tickets);
        const userLookup = {};
        data.users.forEach((user) => {
          userLookup[user.id] = user;
        });
        setUsers(userLookup);
      } catch (error) {
        setError(error.message || "Error fetching data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // No dependencies means it only runs once

  const groupCards = (cardsToGroup) => {
    const groupedCards = {};
    cardsToGroup.forEach((card) => {
      const key =
        groupBy === "status"
          ? card.status
          : groupBy === "user"
          ? card.userId
          : card.priority;
      if (!groupedCards[key]) {
        groupedCards[key] = [];
      }
      groupedCards[key].push(card);
    });
    return groupedCards;
  };

  const sortCards = (cardsToSort) => {
    return Object.keys(cardsToSort).reduce((sorted, key) => {
      const sortedGroup = [...cardsToSort[key]].sort((a, b) => {
        if (sortBy === "priority") {
          return b.priority - a.priority; // Higher priority first
        } else if (sortBy === "title") {
          return a.title.localeCompare(b.title); // Alphabetical order
        }
        return 0;
      });

      sorted[key] = sortedGroup;
      return sorted; // Return the accumulator for the next iteration
    }, {});
  };

  const processedCards = useMemo(() => {
    const groupedCards = groupCards(cards);
    return sortCards(groupedCards); // Sort the grouped cards
  }, [cards, sortBy, groupBy]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app-container">
      {/* Controls */}
      <div className="controls">
        <div className="display-controls">
          <label htmlFor="group-by">Grouping:</label>
          <select
            id="group-by"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>

          <label htmlFor="sort">Ordering:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Group Summary */}
      {/* Group Summary */}
      <div className="group-summary">
        {Object.keys(processedCards).map((key) => (
          <div key={key} className="group-header">
            <div className="group-title">
              {groupBy === "status" && (
                <>
                  <img
                    src={
                      key === "Backlog"
                        ? Backlog
                        : key === "Todo"
                        ? Todo
                        : key === "In progress"
                        ? progress
                        : null
                    }
                    alt={key}
                  />
                  {`${key} (${processedCards[key].length})`}
                </>
              )}
              {groupBy === "user" && (
                <>
                  <img
                    src={users[key]?.avatar || "path/to/default-avatar.png"}
                    alt={users[key]?.name || "User Avatar"}
                  />
                  {`${users[key]?.name} (${processedCards[key].length})`}
                </>
              )}
              {groupBy === "priority" && (
                <>
                  <span>{`Priority ${key} (${processedCards[key].length})`}</span>
                </>
              )}
            </div>
            <div className="gapp">
              <img src={add} alt="Add" />
              <img src={tdot} alt="Options" />
            </div>
          </div>
        ))}
      </div>

      {/* Cards Display */}
      <div className="card-container">
        {Object.values(processedCards).map((group, index) => (
          <div className="card-column" key={index}>
            {group.map((card) => (
              <Card key={card.id} card={card} user={users[card.userId]} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

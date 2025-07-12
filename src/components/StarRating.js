import { useState, useEffect } from "react";
import './StarRating.css';

export default function StarRating({ storeId, userId, isEditing, setIsEditing, submitFlag }) {
  const [avgRating, setAvgRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  // Fetch both avg + user rating
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const [storeRes, userRes] = await Promise.all([
          fetch(`https://roxiler-systems-backend.onrender.com/ratings/store/${storeId}`).then(res => res.json()),
          userId ? fetch(`https://roxiler-systems-backend.onrender.com/ratings/user/${userId}`).then(res => res.json()) : []
        ]);

        setAvgRating(parseFloat(storeRes.avgRating || 0));

        if (userRes && Array.isArray(userRes)) {
          const ratingObj = userRes.find(r => r.store_id === storeId);
          if (ratingObj) {
            setUserRating(ratingObj.rating);
            setTempRating(ratingObj.rating);
          }
        }
      } catch (err) {
        console.error("❌ Rating fetch error:", err.message);
      }
    };

    fetchRatings();
  }, [storeId, userId]);

  // Submit updated rating when flag changes
  useEffect(() => {
    if (!submitFlag || !isEditing) return;

    fetch(`https://roxiler-systems-backend.onrender.com/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ store_id: storeId, user_id: userId, rating: tempRating }),
    })
      .then(() => {
        setUserRating(tempRating);
        setIsEditing(false);
        setTimeout(() => {
          fetch(`https://roxiler-systems-backend.onrender.com/ratings/store/${storeId}`)
            .then(res => res.json())
            .then(data => setAvgRating(parseFloat(data.avgRating || 0)));
        }, 500);
      })
      .catch((err) => console.error("❌ Failed to submit rating:", err.message));
  }, [submitFlag]);

  const handleClick = (index) => {
    if (!userId) return;

    if (!isEditing) {
      const confirm = window.confirm("Do you want to edit the rating?");
      if (!confirm) return;
      setIsEditing(true);
    }

    const newRating = index + 1;
    setTempRating(newRating);
  };

  const renderStars = () => {
    const ratingToShow = isEditing ? tempRating : avgRating;
    return [0, 1, 2, 3, 4].map((i) => (
      <span
        key={i}
        className={`star ${i < ratingToShow ? "selected" : ""}`}
        onClick={() => handleClick(i)}
      >
        ★
      </span>
    ));
  };

  return <div className="star-container">{renderStars()}</div>;
}



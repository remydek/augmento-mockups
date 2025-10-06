import React, { useState, useEffect } from 'react'

export default function Rewards({ rewardsData }) {
  const [userCoins] = useState(1245)
  const [rewardImages, setRewardImages] = useState({
    0: null,
    1: null,
    2: null,
    3: null
  })
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [rewardsTitle, setRewardsTitle] = useState('Rewards')
  const [editingReward, setEditingReward] = useState(null)

  const [rewards, setRewards] = useState([
    {
      id: 0,
      coins: 250,
      title: "Binance Limited Luggage",
      status: "CLAIMED",
      left: 15
    },
    {
      id: 1,
      coins: 999,
      title: "Binance Shirt",
      status: "NOT ENOUGH COINS",
      left: 5
    },
    {
      id: 2,
      coins: 250,
      title: "Binance Hoody",
      status: "CLAIM",
      left: 15
    },
    {
      id: 3,
      coins: 999,
      title: "Dinner in the Sky - Dubai",
      status: "NOT ENOUGH COINS",
      left: 5
    }
  ])

  // Update rewards when AI generates new data
  useEffect(() => {
    if (rewardsData && rewardsData.length > 0) {
      const newRewards = rewardsData.map((reward, index) => {
        const status = reward.coins <= userCoins ? "CLAIM" : "NOT ENOUGH COINS"
        return {
          id: index,
          coins: reward.coins,
          title: reward.title,
          status: status,
          left: Math.floor(Math.random() * 20) + 5 // Random number between 5-25
        }
      })
      setRewards(newRewards)

      // Set images from URLs
      const newImages = {}
      rewardsData.forEach((reward, index) => {
        if (reward.imageUrl) {
          newImages[index] = reward.imageUrl
        }
      })
      setRewardImages(newImages)
    }
  }, [rewardsData, userCoins])

  const handleImageUpload = (rewardId, event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setRewardImages(prev => ({
        ...prev,
        [rewardId]: imageUrl
      }))
    }
  }

  const triggerFileInput = (rewardId) => {
    document.getElementById(`file-input-${rewardId}`).click()
  }

  const updateRewardTitle = (rewardId, newTitle) => {
    setRewards(prev => prev.map(reward =>
      reward.id === rewardId ? { ...reward, title: newTitle } : reward
    ))
    setEditingReward(null)
  }

  const getButtonStyle = (status) => {
    switch (status) {
      case "CLAIMED":
        return "reward-btn-claimed"
      case "CLAIM":
        return "reward-btn-claim"
      case "NOT ENOUGH COINS":
        return "reward-btn-disabled"
      default:
        return "reward-btn-view"
    }
  }

  return (
    <div className="quiz-overlay">
      <div className="quiz-modal rewards-modal">
        {isEditingTitle ? (
          <input
            className="rewards-title-edit"
            value={rewardsTitle}
            onChange={(e) => setRewardsTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditingTitle(false)
              }
            }}
            autoFocus
          />
        ) : (
          <div
            className="rewards-title clickable"
            onClick={() => setIsEditingTitle(true)}
            title="Click to edit title"
          >
            {rewardsTitle}
            <span className="edit-icon-small">✏️</span>
          </div>
        )}

        <div className="rewards-content">
          {rewards.map((reward) => (
            <div key={reward.id} className="reward-item-new">
              <div
                className="reward-image clickable"
                onClick={() => triggerFileInput(reward.id)}
              >
                {rewardImages[reward.id] ? (
                  <img
                    src={rewardImages[reward.id]}
                    alt={reward.title}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = '<div class="reward-image-placeholder"><span>📷</span></div>' + e.target.parentElement.querySelector('input').outerHTML
                    }}
                  />
                ) : (
                  <div className="reward-image-placeholder">
                    <span>📷</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  id={`file-input-${reward.id}`}
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(reward.id, e)}
                />
              </div>

              <div className="reward-info">
                <div className="reward-coins">
                  <img src="/coin.png" alt="Coin" className="coin-icon-small" />
                  <span>{reward.coins} Coins</span>
                </div>
                {editingReward === reward.id ? (
                  <input
                    className="reward-title-edit"
                    value={reward.title}
                    onChange={(e) => {
                      const newTitle = e.target.value
                      setRewards(prev => prev.map(r =>
                        r.id === reward.id ? { ...r, title: newTitle } : r
                      ))
                    }}
                    onBlur={() => setEditingReward(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingReward(null)
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className="reward-title clickable"
                    onClick={() => setEditingReward(reward.id)}
                    title="Click to edit reward title"
                  >
                    {reward.title}
                    <span className="edit-icon-small">✏️</span>
                  </div>
                )}
                <button className={`reward-btn ${getButtonStyle(reward.status)}`}>
                  {reward.status}
                </button>
              </div>

              <div className="reward-left">{reward.left} left</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
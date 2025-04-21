import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import api from "../api";

const Profile = () => {
  const { t } = useContext(LanguageContext);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/profile/${id}`);
        setProfile(data.user);
        setPosts(data.posts);
        const { data: currentUser } = await api.get("/auth/profile");
        setIsFollowing(data.user.followers.some((f) => f._id === currentUser._id));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        setError(t.failedToLoadProfile);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, t]);

  const handleFollow = async () => {
    try {
      await api.post(`/users/follow/${id}`);
      setIsFollowing(true);
      const { data: currentUser } = await api.get("/auth/profile");
      setProfile((prev) => ({
        ...prev,
        followers: [...prev.followers, { _id: currentUser._id, name: currentUser.name }],
      }));
    } catch (error) {
      console.error("Error following user:", error.response?.data || error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.post(`/users/unfollow/${id}`);
      setIsFollowing(false);
      const { data: currentUser } = await api.get("/auth/profile");
      setProfile((prev) => ({
        ...prev,
        followers: prev.followers.filter((f) => f._id !== currentUser._id),
      }));
    } catch (error) {
      console.error("Error unfollowing user:", error.response?.data || error.message);
    }
  };

  if (loading) return <div>{t.loadingProfile}</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!profile) return <div>{t.userNotFound}</div>;

  const defaultUserIcon = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center space-x-6">
          <img
            src={profile.profilePic || defaultUserIcon}
            alt={profile.name}
            className="w-24 h-24 rounded-full object-cover"
            onError={(e) => (e.target.src = defaultUserIcon)}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{profile.name}</h1>
            <p className="text-gray-400">{profile.bio || t.noBio}</p>
            <p className="text-gray-500">
              {profile.educationalInstitution || t.noInstitution}
            </p>
            <div className="mt-2">
              <span className="text-gray-300">{t.followers}: {profile.followers.length} </span>
              <span className="text-gray-300 ml-4">{t.following}: {profile.following.length}</span>
            </div>
            {isFollowing ? (
              <button
                onClick={handleUnfollow}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                {t.unfollow}
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {t.follow}
              </button>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-100 mb-4">{t.recentPosts}</h2>
      {posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post._id} className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-200">{post.text}</p>
              {post.image && (
                <img
                  src={`http://localhost:5000${post.image}`}
                  alt="Post"
                  className="mt-2 max-w-full rounded object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <p className="text-gray-400 text-sm">Likes: {post.likes.length}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">{t.noPostsYet}</p>
      )}
    </div>
  );
};

export default Profile;
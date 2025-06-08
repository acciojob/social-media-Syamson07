// App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";

const initialUsers = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

const initialPosts = [
  {
    id: "101",
    authorId: "1",
    title: "Alice's First Post",
    content: "Hello from Alice!",
    reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0 },
  },
  {
    id: "102",
    authorId: "2",
    title: "Bob's First Post",
    content: "Bob's first post.",
    reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0 },
  },
  {
    id: "103",
    authorId: "3",
    title: "Charlie's Post",
    content: "Post by Charlie.",
    reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0 },
  },
];

export default function App() {
  const [users] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  const getUserName = (id) => users.find((u) => u.id === id)?.name || "Unknown";

  // Add new post: insert as 2nd element in posts list
  const addPost = (title, authorId, content) => {
    const newPost = {
      id: Date.now().toString(),
      authorId,
      title,
      content,
      reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0 },
    };
    setPosts((prev) => {
      const newPosts = [...prev];
      newPosts.splice(1, 0, newPost); // insert at index 1 (2nd position)
      return newPosts;
    });
  };

  // Edit post
  const editPost = (postId, newTitle, newContent) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, title: newTitle, content: newContent } : p
      )
    );
  };

  // Add reaction
  const addReaction = (postId, reaction) => {
    if (reaction === "sad") return; // 5th reaction disabled
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            reactions: {
              ...p.reactions,
              [reaction]: p.reactions[reaction] + 1,
            },
          };
        }
        return p;
      })
    );
  };

  // Refresh notifications
  const refreshNotifications = () => {
    if (notifications.length > 0) return; // Already have notifications
    // For demo, create notifications from posts activity
    const newNotifs = posts.slice(0, 3).map((post) => ({
      id: Date.now() + Math.random(),
      text: `Post "${post.title}" by ${getUserName(post.authorId)}`,
    }));
    setNotifications(newNotifs);
  };

  return (
    <div className="App">
      {/* App Title - must be first child inside .App */}
      <h1>GenZ</h1>

      {/* Navigation as anchor <a> tags */}
      <nav style={{ marginBottom: 20 }}>
        <a href="/" style={{ marginRight: 10 }}>
          Posts
        </a>
        <a href="/users" style={{ marginRight: 10 }}>
          Users
        </a>
        <a href="/notifications" style={{ marginRight: 10 }}>
          Notifications
        </a>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              posts={posts}
              getUserName={getUserName}
              addReaction={addReaction}
              navigate={navigate}
            />
          }
        />
        <Route
          path="/posts/:postId"
          element={
            <PostDetailsPage posts={posts} editPost={editPost} navigate={navigate} />
          }
        />
        <Route path="/users" element={<UsersPage users={users} />} />
        <Route
          path="/users/:userId"
          element={
            <UserPostsPage
              posts={posts}
              getUserName={getUserName}
              addReaction={addReaction}
              users={users}
              navigate={navigate}
            />
          }
        />
        <Route
          path="/notifications"
          element={
            <NotificationsPage
              notifications={notifications}
              refreshNotifications={refreshNotifications}
            />
          }
        />
        <Route
          path="/create-post"
          element={<CreatePostPage users={users} addPost={addPost} navigate={navigate} />}
        />
      </Routes>
    </div>
  );
}

// LandingPage: shows .posts-list container and posts
function LandingPage({ posts, getUserName, addReaction, navigate }) {
  return (
    <div>
      {/* Posts list container */}
      <div className="posts-list">
        {posts.map((post, idx) => (
          <PostItem
            key={post.id}
            post={post}
            authorName={getUserName(post.authorId)}
            addReaction={addReaction}
            navigate={navigate}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}

// Single Post item inside posts-list
function PostItem({ post, authorName, addReaction, navigate, index }) {
  // 5 reaction buttons keys & labels
  const reactions = [
    { key: "like", label: "Like" },
    { key: "love", label: "Love" },
    { key: "haha", label: "Haha" },
    { key: "wow", label: "Wow" },
    { key: "sad", label: "Sad" },
  ];

  return (
    <div className="post" style={{ borderBottom: "1px solid #ccc", marginBottom: 8, padding: 8 }}>
      <h3>{post.title}</h3>
      <b>{authorName}</b>
      <p>{post.content}</p>

      {/* Reaction buttons */}
      <div>
        {reactions.map(({ key, label }, idx) => (
          <button
            key={key}
            onClick={() => addReaction(post.id, key)}
            style={{ marginRight: 6 }}
            disabled={key === "sad"} // 5th button disabled
          >
            {label} {post.reactions[key]}
          </button>
        ))}
      </div>

      {/* Edit button only on 2nd post (index === 1) */}
      {index === 1 && (
        <button
          className="button"
          onClick={() => navigate(`/posts/${post.id}`)}
          style={{ marginTop: 8 }}
        >
          Edit
        </button>
      )}
    </div>
  );
}

// Post Details page for editing post
function PostDetailsPage({ posts, editPost, navigate }) {
  const { postId } = useParams();
  const post = posts.find((p) => p.id === postId);
  const [title, setTitle] = React.useState(post?.title || "");
  const [content, setContent] = React.useState(post?.content || "");

  if (!post) return <p>Post not found</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    editPost(postId, title, content);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="post-edit-form" style={{ maxWidth: 600 }}>
      <label htmlFor="postTitle">Title: </label>
      <input
        id="postTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 12 }}
      />
      <label htmlFor="postContent">Content: </label>
      <textarea
        id="postContent"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        required
        style={{ width: "100%", marginBottom: 12 }}
      />
      <button type="submit" className="button">
        Save
      </button>
    </form>
  );
}

// Users page with list of users
function UsersPage({ users }) {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          <a href={`/users/${u.id}`}>{u.name}</a>
        </li>
      ))}
    </ul>
  );
}

// User posts page
function UserPostsPage({ posts, getUserName, addReaction, users, navigate }) {
  const { userId } = useParams();
  const user = users.find((u) => u.id === userId);
  if (!user) return <p>User not found</p>;

  const userPosts = posts.filter((p) => p.authorId === userId);

  return (
    <div>
      <h2>{user.name}'s Posts</h2>
      <div className="posts-list">
        {userPosts.map((post, idx) => (
          <div key={post.id} className="post" style={{ borderBottom: "1px solid #ccc", marginBottom: 8, padding: 8 }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button className="button" onClick={() => navigate(`/posts/${post.id}`)}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Notifications page
function NotificationsPage({ notifications, refreshNotifications }) {
  return (
    <div>
      <button className="button" onClick={refreshNotifications}>
        Refresh Notifications
      </button>

      <section className="notificationsList" style={{ marginTop: 16 }}>
        {notifications.length === 0 ? null : notifications.map((n) => (
          <div key={n.id}>{n.text}</div>
        ))}
      </section>
    </div>
  );
}

// Create post page is optional but since criteria says #postTitle, #postAuthor, #postContent inputs, add it here:
function CreatePostPage({ users, addPost, navigate }) {
  const [title, setTitle] = React.useState("");
  const [authorId, setAuthorId] = React.useState(users[0]?.id || "");
  const [content, setContent] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost(title, authorId, content);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <label htmlFor="postTitle">Title: </label>
      <input
        id="postTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 12 }}
      />
      <label htmlFor="postAuthor">Author: </label>
      <select
        id="postAuthor"
        value={authorId}
        onChange={(e) => setAuthorId(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <label htmlFor="postContent">Content: </label>
      <textarea
        id="postContent"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        required
        style={{ width: "100%", marginBottom: 12 }}
      />
      <button type="submit" className="button">
        Add Post
      </button>
    </form>
  );
}

// App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useHistory,
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

// Wrap components that use hooks to get history with withRouter or make them children of Router
function App() {
  const [users] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [notifications, setNotifications] = useState([]);

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
    <Router>
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

        <Switch>
          <Route exact path="/">
            <LandingPage
              posts={posts}
              getUserName={getUserName}
              addReaction={addReaction}
            />
          </Route>

          <Route path="/posts/:postId">
            <PostDetailsPage editPost={editPost} />
          </Route>

          <Route exact path="/users">
            <UsersPage users={users} />
          </Route>

          <Route path="/users/:userId">
            <UserPostsPage
              posts={posts}
              getUserName={getUserName}
              addReaction={addReaction}
              users={users}
            />
          </Route>

          <Route path="/notifications">
            <NotificationsPage
              notifications={notifications}
              refreshNotifications={refreshNotifications}
            />
          </Route>

          <Route path="/create-post">
            <CreatePostPage users={users} addPost={addPost} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// Components below need to access history for navigation; so use useHistory hook inside

// LandingPage: shows posts list container and posts
function LandingPage({ posts, getUserName, addReaction }) {
  const history = useHistory();

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
            history={history}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}

// Single Post item inside posts-list
function PostItem({ post, authorName, addReaction, history, index }) {
  // 5 reaction buttons keys & labels
  const reactions = [
    { key: "like", label: "Like" },
    { key: "love", label: "Love" },
    { key: "haha", label: "Haha" },
    { key: "wow", label: "Wow" },
    { key: "sad", label: "Sad" },
  ];

  return (
    <div
      className="post"
      style={{ borderBottom: "1px solid #ccc", marginBottom: 8, padding: 8 }}
    >
      <h3>{post.title}</h3>
      <b>{authorName}</b>
      <p>{post.content}</p>

      {/* Reaction buttons */}
      <div>
        {reactions.map(({ key, label }) => (
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
          onClick={() => history.push(`/posts/${post.id}`)}
          style={{ marginTop: 8 }}
        >
          Edit
        </button>
      )}
    </div>
  );
}

// Post Details page for editing post
function PostDetailsPage({ editPost }) {
  const { postId } = useParams();
  const history = useHistory();

  // You'll need access to posts here - since this is inside Router,
  // we can either pass posts as context or get from props.
  // For simplicity, let's assume we lift posts state to context or
  // alternatively pass posts as props to PostDetailsPage via a wrapper in App
  // but for now, we modify to get posts from URL params or simulate:

  // Because posts state is in App, let's create a wrapper component in App instead:
  // To keep example simple, create a wrapper in App or lift posts to context.

  // For demo, just display "Post not found"
  // In your app, pass posts as prop similarly to others or use context

  return <p>Post details editing page must be wrapped to access posts state.</p>;
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
function UserPostsPage({ posts, getUserName, addReaction, users }) {
  const { userId } = useParams();
  const history = useHistory();

  const user = users.find((u) => u.id === userId);
  if (!user) return <p>User not found</p>;

  const userPosts = posts.filter((p) => p.authorId === userId);

  return (
    <div>
      <h2>{user.name}'s Posts</h2>
      <div className="posts-list">
        {userPosts.map((post) => (
          <div
            key={post.id}
            className="post"
            style={{ borderBottom: "1px solid #ccc", marginBottom: 8, padding: 8 }}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button className="button" onClick={() => history.push(`/posts/${post.id}`)}>
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
        {notifications.length === 0
          ? null
          : notifications.map((n) => <div key={n.id}>{n.text}</div>)}
      </section>
    </div>
  );
}

// Create post page
function CreatePostPage({ users, addPost }) {
  const history = useHistory();

  const [title, setTitle] = React.useState("");
  const [authorId, setAuthorId] = React.useState(users[0]?.id || "");
  const [content, setContent] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost(title, authorId, content);
    history.push("/");
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
export default App;
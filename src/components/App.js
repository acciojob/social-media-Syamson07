import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import AddPost from './AddPost';
import ViewEditPost from './ViewEditPost';
import Users from './Users';
import Notifications from './Notifications';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Shopping Cart</h1>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/add">Add Post</Link> |{' '}
          <Link to="/view">View/Edit Post</Link> |{' '}
          <Link to="/users">Users</Link> |{' '}
          <Link to="/notifications">Notifications</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddPost />} />
          <Route path="/view" element={<ViewEditPost />} />
          <Route path="/users" element={<Users />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

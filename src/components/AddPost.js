import React, { useState } from 'react';

const AddPost = () => {
  const [title, setTitle] = useState('');
  return (
    <div>
      <h2>Add Post</h2>
      <input
        id="postTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
      />
      <button className="button">Add</button>
    </div>
  );
};

export default AddPost;

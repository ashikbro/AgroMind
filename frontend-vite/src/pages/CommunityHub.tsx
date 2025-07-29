import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const CommunityHub: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const postsPerPage = 8;

  useEffect(() => {
    axios.get('/api/community/posts')
      .then(res => setPosts(res.data))
      .catch(() => setError('Failed to load community posts'))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(search.toLowerCase()) ||
    post.author.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedPosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="p-8">
      <Typography variant="h4" gutterBottom>Community Hub</Typography>
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        className="mb-4 p-2 border rounded w-full max-w-md"
      />
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && paginatedPosts.length === 0 && (
        <Typography>No community posts found.</Typography>
      )}
      <Grid container spacing={2}>
        {paginatedPosts.map(post => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">{post.author}</Typography>
                <Typography variant="body1">{post.content}</Typography>
                <Typography variant="caption" color="textSecondary">{new Date(post.timestamp).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommunityHub;

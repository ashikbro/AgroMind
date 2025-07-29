import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';

interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    axios.get('/api/marketplace/listings')
      .then(res => setItems(res.data))
      .catch(() => setError('Failed to load marketplace items'))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="p-8">
      <Typography variant="h4" gutterBottom>Marketplace</Typography>
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        className="mb-4 p-2 border rounded w-full max-w-md"
      />
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && paginatedItems.length === 0 && (
        <Typography>No marketplace items found.</Typography>
      )}
      <Grid container spacing={2}>
        {paginatedItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                <Typography variant="h6">{item.title}</Typography>
                <Typography>${item.price}</Typography>
                <Typography variant="body2">{item.description}</Typography>
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

export default Marketplace;

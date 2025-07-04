# NFT Vault Visualizer - Backend API Integration

This project has been successfully integrated with your backend API at `localhost:3000`. The frontend now fetches NFT data from your backend instead of using mock data.

## Features Added

### 1. Backend API Integration
- **API Endpoint**: `http://localhost:3000/api/nfts`
- **Parameters**: 
  - `wallet`: Wallet address
  - `contract`: Contract address
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 12, max: 100)

### 2. Server-Side Pagination
- Pagination is now handled by the backend API
- Frontend displays pagination controls based on API response
- Page changes trigger new API calls

### 3. Contract Selection
- **Predefined Contracts**: Alpha Lions contract is pre-configured
- **Custom Contracts**: Users can enter custom contract addresses
- Contract changes reset pagination to page 1

### 4. Enhanced Error Handling
- CORS support for cross-origin requests
- Detailed error messages from API responses
- User-friendly error display in the UI

### 5. Real-time Data
- NFT metadata is fetched from the blockchain
- Image URLs are resolved from IPFS when needed
- Real-time balance and acquisition data

## How to Use

### 1. Start the Backend Server
Make sure your backend server is running on `localhost:3000` with the `/api/nfts` endpoint available.

### 2. Start the Frontend
```bash
npm run dev
```
The frontend will start on `http://localhost:5173`

### 3. Connect Wallet
- Click "Connect Wallet" to connect your Web3 wallet
- The app will automatically fetch NFTs for the connected wallet

### 4. Select Contract
- Use the sidebar to select a predefined contract (Alpha Lions)
- Or click "Custom Contract" to enter a custom contract address
- The NFT grid will update automatically

### 5. Navigate Pages
- Use the pagination controls at the bottom to navigate through pages
- Each page shows up to 12 NFTs (configurable)

## API Response Format

The backend should return data in this format:

```json
{
  "wallet": "0x...",
  "contract": "0x...",
  "total": 100,
  "nfts": [
    {
      "contract_address": "0x...",
      "token_standard": "ERC721",
      "token_id": "123",
      "chain": "ApeChain",
      "chain_id": 1234,
      "name": "NFT Name",
      "symbol": "SYMBOL",
      "metadata": {
        "name": "NFT Name",
        "description": "Description",
        "image": "ipfs://...",
        "image_url": "https://ipfs.io/ipfs/...",
        "attributes": []
      },
      "balance": "1",
      "last_acquired": "2024-01-01T00:00:00Z"
    }
  ],
  "page": 1,
  "limit": 12,
  "totalPages": 9,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

## Configuration

### Default Contract
The default contract is set to `0x8420B95bEac664b6E8E89978C3fDCaA1A71c8350` (Alpha Lions)

### Items Per Page
Default is 12 items per page, maximum is 100 (as enforced by the backend)

### CORS
The frontend is configured to handle CORS requests to the backend

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend has CORS enabled:

```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### API Connection Issues
- Check that your backend is running on `localhost:3000`
- Verify the `/api/nfts` endpoint is accessible
- Check browser console for detailed error messages

### Wallet Connection Issues
- Ensure MetaMask or another Web3 wallet is installed
- Check that you're connected to the correct network
- Verify the wallet has the NFTs you're trying to view

## Testing

You can test the API integration using the provided `test-api.html` file:
1. Open `test-api.html` in a browser
2. Click "Test API" to verify the backend connection
3. Check the response to ensure data is being returned correctly

## Development

### Adding New Contracts
To add new predefined contracts, edit `src/components/Sidebar.tsx`:

```javascript
const contracts = [
  {
    name: 'Alpha Lions',
    address: '0x8420B95bEac664b6E8E89978C3fDCaA1A71c8350',
    description: 'Alpha Lions NFT Collection'
  },
  {
    name: 'New Collection',
    address: '0x...',
    description: 'New NFT Collection'
  }
];
```

### Modifying API Endpoint
To change the API endpoint, update `src/hooks/useNFTs.ts`:

```javascript
const apiUrl = `YOUR_NEW_ENDPOINT/api/nfts?wallet=${address}&contract=${contractId}&page=${page}&limit=${limit}`;
```

## File Structure

```
src/
├── hooks/
│   └── useNFTs.ts          # API integration hook
├── components/
│   ├── NFTGrid.tsx         # NFT display with pagination
│   └── Sidebar.tsx         # Contract selection
└── pages/
    └── Index.tsx           # Main page with state management
```

The integration is now complete and ready for use! 
const fetch = require('node-fetch');

async function testAPI() {
  console.log('Testing API endpoint...');
  
  try {
    // Test the API endpoint
    const apiUrl = 'http://localhost:3000/api/nfts?wallet=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6&contract=0x8420B95bEac664b6E8E89978C3fDCaA1A71c8350&page=1&limit=12';
    console.log('Making request to:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('API request failed with status:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('API response data:', JSON.stringify(data, null, 2));
    console.log('Number of NFTs:', data.nfts?.length || 0);
    
  } catch (error) {
    console.error('Error testing API:', error.message);
    console.error('Full error:', error);
  }
}

// Test if the server is running
async function testServerConnection() {
  console.log('Testing server connection...');
  
  try {
    const response = await fetch('http://localhost:3000');
    console.log('Server is running, status:', response.status);
  } catch (error) {
    console.error('Server is not running or not accessible:', error.message);
    console.log('Make sure your backend server is running on localhost:3000');
  }
}

// Run tests
async function runTests() {
  console.log('=== API Debug Test ===');
  await testServerConnection();
  console.log('\n=== API Endpoint Test ===');
  await testAPI();
}

runTests(); 
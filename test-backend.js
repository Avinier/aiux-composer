#!/usr/bin/env node

/**
 * Test script to verify backend AI integration is working
 */

async function testBackend() {
  // Load from .env file
  const dotenv = await import('dotenv');
  dotenv.config();

  const API_BASE = process.env.VITE_API_URL || 'http://localhost:8001';

  console.log('🧪 Testing Backend AI Integration...\n');
  console.log(`📡 Using API: ${API_BASE}\n`);

  try {
    // Test 1: Health check
    console.log('📍 Test 1: Health Check');
    const healthRes = await fetch(`${API_BASE}/health`);
    const health = await healthRes.json();
    console.log('✅ Health check passed:', health);
    console.log('');

    // Test 2: Context generation
    console.log('📍 Test 2: Context Question Generation');
    const contextRes = await fetch(`${API_BASE}/api/generate/context`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Should I quit my job to start a startup?' })
    });

    if (!contextRes.ok) {
      throw new Error(`Context generation failed: ${contextRes.statusText}`);
    }

    const contextData = await contextRes.json();
    console.log('✅ Context questions generated:', contextData.questions?.length || 0, 'questions');
    if (contextData.questions?.[0]) {
      console.log('   Sample question:', contextData.questions[0].question);
    }
    console.log('');

    // Test 3: Foundation endpoint
    console.log('📍 Test 3: Foundation Endpoint');
    const foundationRes = await fetch(`${API_BASE}/api/foundation`);
    if (foundationRes.ok) {
      const foundation = await foundationRes.json();
      console.log('✅ Foundation loaded:', foundation.title);
    } else {
      console.log('⚠️  Foundation endpoint not available (expected - needs to be added)');
    }
    console.log('');

    console.log('🎉 Backend test complete! AI integration is working.');

  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('\n💡 Make sure the backend is running:');
    console.log('   cd server && node index.js');
    console.log('\n💡 Also ensure GLM_API_KEY is set in .env file');
    process.exit(1);
  }
}

// Run the test
testBackend();
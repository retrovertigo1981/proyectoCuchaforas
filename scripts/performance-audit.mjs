#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

console.log('🔍 Running Performance Audit...\n');

try {
  // Build the project first
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!\n');
  
  // Show bundle size analysis
  console.log('📊 Bundle Size Analysis:');
  console.log('─'.repeat(50));
  
  const distFiles = execSync('ls -lh dist/assets/ | grep -E "\\.js$|\\.css$"', { encoding: 'utf-8' });
  console.log(distFiles);
  
  // Calculate total size
  const totalSize = execSync('du -sh dist/', { encoding: 'utf-8' }).trim();
  console.log(`\n📦 Total build size: ${totalSize}`);
  
  // Show image optimization status
  console.log('\n🖼️  Image Optimization Status:');
  console.log('─'.repeat(50));
  const imageFiles = execSync('ls -lh src/assets/img/ | grep -E "\\.(jpg|png|svg)$"', { encoding: 'utf-8' });
  console.log(imageFiles);
  
  console.log('\n✅ Performance audit completed!');
  console.log('\n💡 Tips for better performance:');
  console.log('   - Run "npm run optimize:images" to optimize images');
  console.log('   - Run "npm run build:analyze" to visualize bundle');
  console.log('   - Test on Lighthouse: https://pagespeed.web.dev/');
  
} catch (error) {
  console.error('❌ Performance audit failed:', error.message);
  process.exit(1);
}

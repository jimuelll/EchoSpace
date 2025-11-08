const fs = require('fs');
const path = require('path');

// Define the import mappings
const importMappings = {
  '@/components/AuthCard': '@/components/auth/AuthCard',
  '@/components/AuthGuard': '@/components/auth/AuthGuard',
  '@/components/CreateCommunityModal': '@/components/modals/CreateCommunityModal',
  '@/components/CreatePostModal': '@/components/modals/CreatePostModal',
  '@/components/JoinCommunityModal': '@/components/modals/JoinCommunityModal',
  '@/components/VerifyEmailModal': '@/components/modals/VerifyEmailModal',
  '@/components/Header': '@/components/layout/Header',
  '@/components/HomePage': '@/components/layout/HomePage',
  '@/components/postcard': '@/components/post',
  '../JoinCommunityModal': '../modals/JoinCommunityModal',
  '../CreateCommunityModal': '../modals/CreateCommunityModal',
  '../VerifyEmailModal': '../modals/VerifyEmailModal'
};

// Files to update
const filesToUpdate = [
  'src/pages/Auth.tsx',
  'src/pages/PrivateCommunitiesPage.tsx',
  'src/pages/CommunityPage.tsx',
  'src/pages/PublicCommunitiesPage.tsx',
  'src/layouts/GlobalSidebarAndHeader.tsx',
  'src/components/sidebar/index.tsx',
  'src/components/sidebar/DropdownSection.tsx',
  'src/components/auth/AuthCard.tsx'
];

// Update each file
filesToUpdate.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;
    
    for (const [oldPath, newPath] of Object.entries(importMappings)) {
      const regex = new RegExp(`from ['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
      const newContent = content.replace(regex, `from '${newPath}'`);
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    }
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('Import updates complete!');

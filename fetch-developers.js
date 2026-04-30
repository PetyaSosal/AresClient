// Скрипт для заполнения developers.json с GitHub API
// Запустите это в Node.js или используйте на GitHub Actions

const https = require('https');
const fs = require('fs');

const DEVELOPERS = ['SMAILLNN', 'PetyaSosal'];

async function fetchGithubUser(username) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': 'Ares-Client-Site' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchUserRepositories(username) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, {
      headers: { 'User-Agent': 'Ares-Client-Site' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const repos = JSON.parse(data);
          resolve(repos.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            language: repo.language
          })));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function generateDevelopersJson() {
  try {
    console.log('Получаю информацию с GitHub API...');
    
    const developersData = {
      developers: [],
      updated: new Date().toISOString()
    };

    const displayNames = {
      'SMAILLNN': 'zero1null',
      'PetyaSosal': 'Pettanko'
    };

    const roles = {
      'SMAILLNN': 'Вор, негодяй и скелетон сити',
      'PetyaSosal': 'Дурачок и фембой, футфетешист'
    };

    for (const username of DEVELOPERS) {
      console.log(`Загружаю данные для ${username}...`);
      
      const userInfo = await fetchGithubUser(username);
      const repositories = await fetchUserRepositories(username);

      developersData.developers.push({
        username: username,
        displayName: displayNames[username],
        role: roles[username],
        github: `https://github.com/${username}`,
        avatar: userInfo.avatar_url,
        bio: userInfo.bio || '',
        public_repos: userInfo.public_repos,
        repositories: repositories
      });

      console.log(`✓ ${username} - ${repositories.length} репозиториев`);
    }

    fs.writeFileSync('developers.json', JSON.stringify(developersData, null, 2));
    console.log('\n✓ developers.json успешно создан!');
    console.log(JSON.stringify(developersData, null, 2));

  } catch (error) {
    console.error('Ошибка при загрузке данных:', error.message);
    process.exit(1);
  }
}

generateDevelopersJson();

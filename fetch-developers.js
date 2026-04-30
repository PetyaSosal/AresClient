// fetch-developers.js
document.addEventListener('DOMContentLoaded', loadDevelopers);

async function loadDevelopers() {
    const developers = [
        { username: "SMAILLNN",   displayName: "zero1null",   role: "Вор, негодяй и скелетон сити" },
        { username: "PetyaSosal", displayName: "Pettanko",    role: "Дурачок и фембой, футфетешист" }
    ];

    const grid = document.querySelector('.devs-grid');
    if (!grid) return;

    grid.innerHTML = '';   // очищаем старые карточки

    for (const dev of developers) {
        try {
            const res = await fetch(`https://api.github.com/users/${dev.username}`);
            if (!res.ok) throw new Error();
            
            const user = await res.json();

            const cardHTML = `
                <a href="https://github.com/${dev.username}" target="_blank" class="dev-card glass-panel">
                    <div class="dev-avatar">
                        <img src="${user.avatar_url}" alt="${dev.displayName}">
                    </div>
                    <h3 class="dev-name">${dev.displayName}</h3>
                    <p class="dev-role">${dev.role}</p>
                    
                    <div class="dev-preview">
                        <div class="preview-stats">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            <span class="repo-count">${user.public_repos}</span> репозиториев
                        </div>
                        <p class="preview-bio">${user.bio ? user.bio : 'Таинственный разработчик. Описание профиля скрыто во мраке GitHub.'}</p>
                    </div>
                </a>
            `;

            grid.innerHTML += cardHTML;

        } catch (e) {
            console.error(`Не удалось загрузить данные для ${dev.username}`);
            // Можно добавить fallback-карточку, если хочешь
        }
    }
}

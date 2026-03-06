tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
            },
            colors: {
                vercel: {
                    black: '#000000',
                    dark: '#0A0A0A',
                    border: '#333333',
                    gray: '#888888',
                }
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initCustomDropdowns();
    loadCategories();
    setupHorizontalScroll();
    initTags();
});

function initCustomDropdowns() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const selectedText = dropdown.querySelector('.dropdown-selected');
        const items = dropdown.querySelectorAll('.dropdown-item');

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = dropdown.classList.contains('open');
            document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
            if (!isOpen) dropdown.classList.add('open');
        });

        setupDropdownItems(dropdown, items, selectedText);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
        }
    });
}

function setupDropdownItems(dropdown, items, selectedText) {
    items.forEach(item => {
        item.addEventListener('click', () => {
            dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            selectedText.textContent = item.textContent;
            dropdown.classList.remove('open');
        });
    });
}

async function loadCategories() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Datvex/Datvex-prompt-LAB/main/data/categories.json');
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        const categoryList = document.getElementById('category-list');
        const dropdown = document.getElementById('dropdown-category');
        const selectedText = dropdown.querySelector('.dropdown-selected');

        categoryList.innerHTML = `<li class="dropdown-item active px-3 py-2 cursor-pointer transition-colors duration-150" data-value="all">Все</li>`;

        data.forEach(groupData => {
            categoryList.innerHTML += `<li class="px-3 pt-3 pb-1 text-[#666] font-semibold text-[10px] uppercase tracking-wider select-none">${groupData.group}</li>`;
            
            groupData.items.forEach(item => {
                categoryList.innerHTML += `<li class="dropdown-item px-3 py-2 hover:bg-[#111] cursor-pointer transition-colors duration-150" data-value="${item.id}">${item.name}</li>`;
            });
        });

        const newItems = categoryList.querySelectorAll('.dropdown-item');
        setupDropdownItems(dropdown, newItems, selectedText);

    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

function setupHorizontalScroll() {
    const scrollContainer = document.getElementById('category-scroll');
    const gradLeft = document.getElementById('grad-left');
    const gradRight = document.getElementById('grad-right');
    
    if (!scrollContainer) return;

    scrollContainer.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        scrollContainer.scrollLeft += evt.deltaY * 2;
    });

    const handleScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        
        if (scrollLeft > 5) {
            gradLeft.style.opacity = '1';
        } else {
            gradLeft.style.opacity = '0';
        }

        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 5) {
            gradRight.style.opacity = '0';
        } else {
            gradRight.style.opacity = '1';
        }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    setTimeout(handleScroll, 100); 
}

function initTags() {
    const tags = document.querySelectorAll('.tag-btn');
    
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('tag-active');
        });
    });
}

interface MenuItem {
    id: number;
    title: string;
    path: string;
}

export const mainMenu: MenuItem[] = [
    { id: 1, title: '예능', path: '/entertainment' },
    { id: 2, title: '드라마', path: '/drama' },
    { id: 3, title: '영화', path: '/movie' },
    { id: 4, title: '해외 시리즈', path: '/overseasSeries' },
    { id: 5, title: '시사교양', path: '/currentAffairs' },
    { id: 6, title: '애니메이션', path: '/animation' },
    { id: 7, title: '키즈', path: '/kids' },
    { id: 8, title: 'COMMON', path: '/Common' },
];

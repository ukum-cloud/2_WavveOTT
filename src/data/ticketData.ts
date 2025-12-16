import type { TicketData } from "../types/etc";

// 웨이브 이용권 데이터
export const WAVE_TICKETS: TicketData[] = [
  {
    id: 1,
    title: "광고형 스탠다드",
    category: 'wave',
    badge: "",
    hasFlip: true,
    prices: [
      { period: "1개월", price: 5500, monthlyPrice: 6583 }
    ],
    specs: [
      { label: "동시 시청", value: "2대" },
      { label: "시청 가능 디바이스", value: "모든 디바이스" },
      { label: "화질", value: "FHD 화질 " },
      { label: "TV", value: "이용 가능" },
      { label: "광고", value: "있음" },
      { label: "모바일 다운로드", value: "15회" },
      { label: "QVOD 및 타임머신 기능", value: "QVOD Only" },
      { label: "30만편 이상의 VOD", value: "이용 가능" },
      { label: "100여개 실시간 라이브 채널", value: "이용 가능" },
      { label: "9천여편의 영화", value: "이용 가능" }
    ]
  },
  {
    id: 2,
    title: "베이직",
    category: 'wave',
    badge: "",
    hasFlip: true,
    prices: [
      { period: "1개월", price: 7900 },
      { period: "12개월", price: 79000, discount: 16, monthlyPrice: 6583 }
    ],
    specs: [
      { label: "동시 시청", value: "1대" },
      { label: "시청 가능 디바이스", value: "모든 디바이스" },
      { label: "화질", value: "HD 화질 " },
      { label: "TV", value: "-" },
      { label: "광고", value: "-" },
      { label: "모바일 다운로드", value: "무제한" },
      { label: "QVOD 및 타임머신 기능", value: "이용 가능" },
      { label: "30만편 이상의 VOD", value: "이용 가능" },
      { label: "100여개 실시간 라이브 채널", value: "이용 가능" },
      { label: "9천여편의 영화", value: "이용 가능" }
    ]
  },
  {
    id: 3,
    title: "스탠다드",
    category: 'wave',
    badge: "추천",
    hasFlip: true,
    prices: [
      { period: "1개월", price: 10900 },
      { period: "12개월", price: 109000, discount: 16, monthlyPrice: 9083 }
    ],
    specs: [
      { label: "동시 시청", value: "2대" },
      { label: "시청 가능 디바이스", value: "모든 디바이스" },
      { label: "화질", value: "FHD 화질 " },
      { label: "TV", value: "이용 가능" },
      { label: "광고", value: "-" },
      { label: "모바일 다운로드", value: "무제한" },
      { label: "QVOD 및 타임머신 기능", value: "이용 가능" },
      { label: "30만편 이상의 VOD", value: "이용 가능" },
      { label: "100여개 실시간 라이브 채널", value: "이용 가능" },
      { label: "9천여편의 영화", value: "이용 가능" }
    ]
  },
  {
    id: 4,
    title: "프리미엄",
    category: 'wave',
    badge: "",
    hasFlip: true,
    prices: [
      { period: "1개월", price: 13900 },
      { period: "12개월", price: 139000, discount: 16, monthlyPrice: 11583 }
    ],
    specs: [
      { label: "동시 시청", value: "4대" },
      { label: "시청 가능 디바이스", value: "모든 디바이스" },
      { label: "화질", value: "최고 화질 " },
      { label: "TV", value: "이용 가능" },
      { label: "광고", value: "-" },
      { label: "모바일 다운로드", value: "무제한" },
      { label: "QVOD 및 타임머신 기능", value: "이용 가능" },
      { label: "30만편 이상의 VOD", value: "이용 가능" },
      { label: "100여개 실시간 라이브 채널", value: "이용 가능" },
      { label: "9천여편의 영화", value: "이용 가능" }
    ]
  }
];

// 더블 이용권 데이터
export const DOUBLE_TICKETS: TicketData[] = [
  {
    id: 5,
    title: "더블 광고형 스탠다드",
    category: 'double',
    badge: "추천",
    hasFlip: true,
    prices: [
      { period: "1개월", price: 7000 }
    ],
    brands: {
      wave: "광고형 스탠다드",
      tving: "광고형 스탠다드"
    },
    specs: [
      { label: "동시 시청", value: "2대" },
      { label: "시청 가능 디바이스", value: "모든 디바이스" },
      { label: "화질", value: "웨이브:FHD 화질\n티빙:고화질" },
      { label: "TV", value: "이용 가능" },
      { label: "광고", value: "있음" },
      { label: "모바일 다운로드", value: "15회" }
    ]
  },
  {
    id: 6,
    title: "더블 슬림",
    category: 'double',
    badge: "",
    hasFlip: true,
    prices: [
      { period: "1개월", price: 9500 }
    ],
    brands: {
      wave: "베이직",
      tving: "광고형 스탠다드"
    },
    specs: [
      { label: "동시 시청", value: "웨이브 - 1대 / 티빙 - 2대" },
      { label: "시청 가능 디바이스", value: "모든 디바이스" },
      { label: "화질", value: "웨이브: HD 화질\n티빙: 고화질 " },
      { label: "TV", value: "티빙 Only" },
      { label: "광고", value: "있음" },
      { label: "모바일 다운로드", value: "웨이브 - 무제한\n티빙 - 15회" }
    ]
  },
  {
    id: 7,
    title: "더블 베이직",
    category: 'double',
    badge: "추천",
    hasFlip: true,
    prices: [
      { period: "1개월", price: 13500 }
    ],
    brands: {
      wave: "베이직",
      tving: "베이직"
    },
    specs: [
      { label: "동시 시청", value: "1대" },
      { label: "시청 가능 디바이스", value: "모든 디바이스" },
      { label: "화질", value: "웨이브: HD 화질\n티빙: 일반화질" },
      { label: "TV", value: "티빙 Only" },
      { label: "광고", value: "있음" },
      { label: "모바일 다운로드", value: "웨이브 - 무제한\n티빙 - 200회" }
    ]
  },
  {
    id: 8,
    title: "더블 스탠다드",
    category: 'double',
    badge: "",
    hasFlip: true,
    prices: [
      { period: "1개월", price: 15000 }
    ],
    brands: {
      wave: "스탠다드",
      tving: "스탠다드"
    },
    specs: [
      { label: "동시 시청", value: "2대" },
      { label: "시청 가능 디바이스", value: "모든 디바이스" },
      { label: "화질", value: "웨이브: FHD 화질\n티빙: 고화질" },
      { label: "TV", value: "이용 가능" },
      { label: "광고", value: "있음" },
      { label: "모바일 다운로드", value: "웨이브 - 무제한\n티빙 - 300회" }
    ]
  },
  {
    id: 9,
    title: "더블 프리미엄",
    category: 'double',
    badge: "",
    hasFlip: true,
    prices: [
      { period: "1개월", price: 19500 }
    ],
    brands: {
      wave: "스탠다드",
      tving: "스탠다드"
    },
    specs: [
      { label: "동시 시청", value: "2대" },
      { label: "시청 가능 디바이스", value: "모든 디바이스" },
      { label: "화질", value: "웨이브: 최고화질\n티빙: 고화질(4K 일부)" },
      { label: "TV", value: "이용 가능" },
      { label: "광고", value: "있음" },
      { label: "모바일 다운로드", value: "웨이브 - 무제한\n티빙 - 400회" }
    ]
  }
];

// 제휴 이용권 데이터
export const COALITION_TICKETS: TicketData[] = [
  {
    id: 10,
    title: "베이직 X FLO 무제한",
    category: 'coalition',
    badge: "추천",
    hasFlip: false,
    prices: [
      { period: "1개월", price: 13750 }
    ],
    specs: [
      { label: "", value: "동시시청 1대" },
      { label: "", value: "HD화질" },
      { label: "", value: "무제한 다운로드" }
    ]
  },
  {
    id: 11,
    title: "베이직 X 나라사랑카드", 
    category: 'coalition',
    badge: "",
    hasFlip: false,
    prices: [
      { period: "1개월", price: 6700, originalPrice: 7900, monthlyPrice: 6583 }
    ],
    specs: [
      { label: "", value: "동시시청 1대" },
      { label: "", value: "모든 디바이스 (TV 시청 제한)" },
      { label: "", value: "HD화질" },
      { label: "", value: "무제한 다운로드" }
    ]
  },
  {
    id: 12,
    title: "베이직 X Bugs 듣기",
    category: 'coalition',
    badge: "",
    hasFlip: false,
    prices: [
      { period: "1개월", price: 13750 }
    ],
    specs: [
      { label: "", value: "동시시청 1대" },
      { label: "", value: "모든 디바이스 (TV 시청 제한)" },
      { label: "", value: "HD화질" },
      { label: "", value: "무제한 다운로드" }
    ]
  }
];

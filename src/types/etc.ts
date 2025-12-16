 //이벤트 목록 항목 타입 정의
export interface EventType {
  id: number;
  imgThumb: string;
  imgUrl: string;
  title: string;
  date: string;
}

// 공지사항 항목 타입 정의
export interface NoticeType {
  id: number;
  division: string;
  title: string;
  date: string;
  content: string;
}
// CustomSelect 컴포넌트의 단일 옵션 타입 정의
export interface SelectOption {
  label: string; // 사용자에게 보이는 이름
  path: string;  // 이동할 URL 경로 (링크)
}

// CustomSelect 컴포넌트의 props 타입 정의
export interface CustomSelectProps {
  options: SelectOption[]; 
  selectedValue: string;
  onSelect: (path: string, label: string) => void; 
  label?: string;
  width?: string;
}

// 모달 크기를 정의하는 타입
export type ModalSize = 'xsmall' | 'small' | 'default' | 'large';

// Modal 컴포넌트의 Props 타입 정의
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    size?: ModalSize;
    children: React.ReactNode;
}



// 카드 데이터 타입 정의
export interface PriceInfo {
  period: string;
  price: number;
  discount?: number;
  monthlyPrice?: number;
  originalPrice?: number;
}

export interface SpecInfo {
  label: string;
  value: string;
}
export interface BrandInfo {
  wave?: string;
  tving?: string;
}
export interface TicketData {
  id: number;
  title: string;
  category: 'wave' | 'double' | 'coalition';
  badge?: string;
  prices: PriceInfo[];
  brands?: BrandInfo;
  specs?: SpecInfo[];
  hasFlip: boolean;
}
export interface PaymentPageProps {
  ticketData?: TicketData;
  selectedPrice?: PriceInfo;
}

// Payment.tsx로 전달받는 location state의 타입 정의
export interface LocationState {
    ticketData: TicketData;
    selectedPrice: PriceInfo;
}
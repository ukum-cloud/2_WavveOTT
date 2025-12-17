// 콘텐츠 리스트 랜덤돌리기 함수
export function randomArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

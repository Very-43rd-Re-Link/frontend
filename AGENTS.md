# AGENTS.md — React + Vite Frontend

> Scope: 이 규칙은 현재 디렉터리와 하위 디렉터리에 적용됩니다.

## 원칙

1. 사용자 요청이 구현이면 직접 구현합니다.
2. 변경은 작고 명확하게 유지합니다.
3. 기존 동작과 디자인을 보존합니다.
4. 검증은 가능한 한 `npm run typecheck`, `npm run lint`, `npm run build` 순서로 수행합니다.
5. 사용자-facing 응답, 커밋 메시지, PR 설명은 한국어로 작성합니다.

## 기술 스택

- React
- Vite
- TypeScript
- Tailwind CSS

## 구현 규칙

- 화면 레이아웃은 Tailwind class 중심으로 작성합니다.
- 반복되거나 의미가 분명한 UI는 컴포넌트로 분리합니다.
- 색상, 폰트, 그림자 값은 `tailwind.config.js`와 `src/styles/token.css`의 토큰을 우선 사용합니다.
- Figma 구현은 임의 재해석보다 시각적 일치를 우선합니다.
- 에셋은 `assets/icons`와 `assets/images` 아래에 보관하고 import해서 사용합니다.
- 모바일 우선 화면은 기본적으로 375px 폭의 모바일 프레임 안에서 구현합니다.

## 주의

- Expo, React Native, native prebuild 구조는 더 이상 사용하지 않습니다.
- 새 의존성 추가 전 기존 의존성으로 해결 가능한지 확인합니다.
- 민감정보, 토큰, `.env` 값은 코드나 로그에 노출하지 않습니다.

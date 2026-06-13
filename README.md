# ReLink Frontend

React + Vite 기반의 ReLink 프론트엔드입니다.

## 실행

```bash
npm install
npm run dev
```

## 환경변수

```bash
VITE_API_BASE_URL=
```

## 검증

```bash
npm run typecheck
npm run lint
npm run build
```

## 구조

- `src/main.tsx`: Vite 엔트리
- `src/App.tsx`: 앱 루트
- `src/features/home`: 홈 화면
- `assets/icons`: SVG 아이콘
- `assets/images`: 이미지 에셋
- `src/styles/token.css`: CSS 토큰
- `tailwind.config.js`: Tailwind 토큰 확장

현재 화면은 웹/PWA 전환을 전제로 375px 모바일 프레임 안에서 구현합니다.

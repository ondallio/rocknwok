# Rock'n Wok - Work Log

## 2026-02-02

### 작업 내역

1. Pencil(.pen)에서 랜딩페이지 디자인 완성
2. HTML/CSS/JS 코드 구현 (다크 테마)
3. 폰트 변경: Playfair Display → Pretendard (타이틀), Manrope (본문)
4. 배경 그라데이션 적용
5. 모바일 반응형 강화 (480px 이하 대응)
6. 한식 퓨전 컨셉 전환 (중식+한식 혼합 메뉴)
7. GitHub 리포 생성 및 Pages/Vercel 배포
8. 히어로 섹션 리디자인 (오렌지 그라데이션 오버레이, 텍스트 강조)
9. 영문 메인 전환 (index.html → 영문, ko.html → 한국어)
10. 언어 전환 버튼 오렌지 액센트 컬러 적용
11. 히어로 타이틀 DM Serif Display 폰트 + 자간 적용

### 배포 현황

| 플랫폼 | URL |
|--------|-----|
| GitHub | https://github.com/ondallio/rocknwok |
| Vercel | https://rocknwok.vercel.app |
| GitHub Pages | https://ondallio.github.io/rocknwok/ |

---

### 에러 기록 및 원인 분석

#### 1. GitHub Pages 워크플로우 push 거부
- **증상**: `.github/workflows/deploy.yml` push 시 `refusing to allow an OAuth App to create or update workflow` 에러
- **원인**: `gh auth login`으로 발급된 OAuth 토큰의 스코프에 `workflow`가 포함되지 않음. GitHub은 보안상 워크플로우 파일에 별도 권한을 요구
- **해결**: 워크플로우 삭제, source 기반(legacy) 배포로 전환
- **교훈**: `gh auth refresh -s workflow`로 스코프 추가하거나, 정적 사이트는 source 기반 배포가 더 간단

#### 2. Vercel "No Production Deployment"
- **증상**: CLI로 배포 성공했으나 대시보드에 "No Production Deployment" 표시
- **원인**: CLI 배포와 GitHub 연동 자동 배포가 별개의 파이프라인으로 인식됨. 대시보드는 GitHub 연동 기준으로 production을 표시
- **해결**: `git push`로 GitHub 자동 배포 트리거
- **교훈**: Vercel에 GitHub 연동 후에는 CLI 대신 git push로 배포해야 대시보드가 정상 인식

#### 3. GitHub Pages 캐시 지연
- **증상**: `status: built` 확인 후에도 WebFetch로 접속 시 구버전 표시
- **원인**: CDN 엣지 서버 캐시 갱신에 수십 초~수 분 소요. WebFetch 자체 캐시(15분)도 영향
- **해결**: 캐시 갱신 대기 후 쿼리 파라미터 추가하여 확인
- **교훈**: 배포 직후 확인 시 캐시 지연을 감안하고, 쿼리 파라미터(`?v=timestamp`)로 캐시 우회

#### 4. Vercel 프로젝트 중복
- **증상**: `rocknwok-in-tauranga`와 `rocknwok-fusion` 두 개 프로젝트 생성
- **원인**: 기존 프로젝트가 있는 상태에서 `vercel --yes` 실행 시 같은 디렉토리명으로 새 프로젝트를 자동 생성. `--yes` 플래그가 프롬프트를 스킵하면서 기존 프로젝트 연결 대신 신규 생성
- **해결**: 중복 프로젝트 삭제 후 새 리포로 재배포
- **교훈**: `vercel link`로 기존 프로젝트에 먼저 연결 후 배포

#### 5. Pencil Stock 이미지 404
- **증상**: "menbosha chinese fried shrimp toast crispy golden appetizer" 검색 시 Unsplash 404
- **원인**: Unsplash API 검색 인덱스가 영어 기반이라 로컬 음식명은 인덱싱 안 됨
- **해결**: 재료/외형 위주 일반적 키워드("fried shrimp crispy golden appetizer food")로 재검색
- **교훈**: 구체적 요리명보다 재료/외형/분위기 키워드가 Unsplash에서 효과적

#### 6. "File has not been read yet" 에러
- **증상**: `en.html`에 Write 시도 시 에러 발생
- **원인**: Claude Code의 안전장치로, 기존 파일 덮어쓰기 전 반드시 Read 선행 필요. 실수로 의도하지 않은 파일을 덮어쓰는 것을 방지하는 설계
- **해결**: 파일을 Read한 후 Write 실행
- **교훈**: Write 전 항상 Read 선행. 새 파일 생성 시에는 불필요

#### 7. Pencil 디자인 섹션 배경 누락
- **증상**: Concept, Reservation 섹션이 밝게 보임
- **원인**: Pencil 프레임의 기본 fill이 투명(transparent). 상위 프레임에 배경색을 설정해도 하위 프레임이 투명이면 캔버스 배경(흰색)이 비침
- **해결**: 각 섹션 프레임에 `fill: "#0F0F0F"` 명시
- **교훈**: Pencil에서 모든 섹션 프레임에 fill을 명시적으로 설정

#### 8. Pencil 메뉴 리스트 가로 배치
- **증상**: 세로여야 할 메뉴 리스트가 가로로 표시
- **원인**: Pencil 프레임의 기본 layout이 horizontal(가로). `layout: "vertical"` 미지정 시 자식 노드가 가로 나열
- **해결**: `layout: "vertical"` 명시
- **교훈**: Pencil 프레임 생성 시 layout 방향을 항상 명시

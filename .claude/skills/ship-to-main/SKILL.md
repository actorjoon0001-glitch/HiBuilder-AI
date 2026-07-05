---
name: ship-to-main
description: >-
  작업이 끝나 배포/반영할 때, 현재 작업 브랜치의 변경사항을 커밋·푸시하고
  main을 대상으로 하는 "새 PR"을 만들어 곧바로 머지(자동 머지)한다.
  사용자가 "머지", "배포", "반영", "ship", "올려줘", "적용해줘" 등으로
  작업을 마무리하라고 할 때, 또는 한 덩어리의 작업을 완료했을 때 사용한다.
  이 저장소의 표준 전달 방식이며, 기존 PR을 재사용하지 않고 매번 새 PR을 연다.
---

# ship-to-main — 항상 새 PR로 main에 자동 머지

이 저장소(HiBuilder-AI)의 표준 전달 워크플로우다. 작업을 마무리할 때마다
**기존 PR을 재사용하지 말고 매번 새 PR을 만들어 `main`에 머지**한다.

## 절차

1. **브랜치 확인**
   - 지정 작업 브랜치(`claude/construction-materials-marketplace-swk0sy`)에서 작업한다.
   - 현재 `main`에 있다면 먼저 feature 브랜치로 이동/생성한다. `main`에 직접 커밋 금지.

2. **커밋**
   - 의미 있는 한글 커밋 메시지로 변경사항을 커밋한다.
   - 커밋 메시지 끝에 아래 트레일러를 붙인다:
     ```
     Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
     Claude-Session: <현재 세션 URL>
     ```

3. **푸시**
   - `git push -u origin <branch>` (네트워크 오류 시 2s→4s→8s→16s 지수 백오프로 최대 4회 재시도)

4. **새 PR 생성** (GitHub MCP `create_pull_request`)
   - `owner: actorjoon0001-glitch`, `repo: HiBuilder-AI`
   - `head: <작업 브랜치>`, `base: main`
   - 제목·본문은 이번 변경 내용으로 채운다. PR 본문 끝에:
     `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
   - 기존 PR이 있어도 재사용하지 않고 새로 연다.

5. **곧바로 머지** (GitHub MCP `merge_pull_request`, `merge_method: merge`)
   - 이 저장소는 브랜치 보호/필수 CI가 없어 GitHub의 auto-merge 큐를 쓸 수 없으므로,
     PR 생성 직후 바로 머지해 "자동 머지" 효과를 낸다.
   - 머지 후 브랜치가 main과 갈라져 충돌이 나면, `main`을 먼저 병합·정리한 뒤 재시도한다.

6. **결과 보고**
   - PR 번호/URL과 머지 완료(SHA)를 사용자에게 알린다.

## 배포 반영 주의 (넷리파이)

- main 머지가 실제 사이트에 반영되려면 **넷리파이 프로덕션 브랜치가 `main`**이어야 한다.
- 화면이 안 바뀌면: 넷리파이 → Deploys → "Clear cache and deploy site" 후,
  브라우저 강력 새로고침(Ctrl/Cmd+Shift+R)을 안내한다.
- `netlify.toml`에서 `/assets/*.js`, `/assets/*.css`, `/data/*` 는 `must-revalidate`로
  설정되어 있어 배포 후 최신 코드가 즉시 반영된다.

## 하지 말 것

- 이미 머지된 PR에 새 커밋을 얹지 않는다(머지된 PR은 끝난 것). 후속 작업은 새 PR로.
- `main`에 직접 푸시하지 않는다.
- 사용자가 명시적으로 요청하지 않는 한 결제 연동에 쓰이는 DB 컬럼명(`course_id` 등)은 바꾸지 않는다.

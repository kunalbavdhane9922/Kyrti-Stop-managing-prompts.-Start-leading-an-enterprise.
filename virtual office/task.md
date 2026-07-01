# Virtual Office HQ — Task Tracker

## Phase 1 — Map Generator
- [/] Write `generate_hq_map.cjs` (100×80 tile map with all rooms)
- [ ] Run generator to produce `hq-office.json`
- [ ] Validate JSON structure

## Phase 2 — CEO Sprite Character
- [ ] Load `player_spritesheet.png` as animated spritesheet
- [ ] Create walk animations (4 directions × 5 frames)
- [ ] Replace circle avatar with animated sprite
- [ ] CEO spawns in executive office

## Phase 3 — NPC Employee System
- [ ] Create NPC spawn definitions per department
- [ ] Implement patrol AI (IDLE → WALK → IDLE state machine)
- [ ] Department color coding and labels
- [ ] AI workers with pulsing green glow

## Phase 4 — Room Labels
- [ ] Add floating room name text objects
- [ ] Semi-transparent backgrounds
- [ ] Proper depth sorting

## Phase 5 — Polish
- [ ] Minimap resize for 100×80 map
- [ ] Depth sorting fixes
- [ ] Verify collision boundaries
- [ ] Test all rooms walkable

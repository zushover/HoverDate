-- ============================================================
-- responses: 用户问卷回答
-- ============================================================
CREATE TABLE IF NOT EXISTS responses (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),

  -- Step 1: 基础身份
  user_gender       TEXT CHECK (user_gender IN ('male', 'female')),
  pref_gender       TEXT CHECK (pref_gender IN ('male', 'female', 'any')),
  user_university   TEXT CHECK (user_university IN ('lzu', 'nwnu')),
  user_campus       TEXT,
  major_category    TEXT,

  -- Step 2+3: 生活共振 + 学业
  my_sleep     SMALLINT NOT NULL DEFAULT 3 CHECK (my_sleep BETWEEN 1 AND 5),
  pref_sleep   SMALLINT NOT NULL DEFAULT 3 CHECK (pref_sleep BETWEEN 1 AND 5),
  my_social    SMALLINT NOT NULL DEFAULT 3 CHECK (my_social BETWEEN 1 AND 5),
  pref_social  SMALLINT NOT NULL DEFAULT 3 CHECK (pref_social BETWEEN 1 AND 5),
  my_study     SMALLINT NOT NULL DEFAULT 3 CHECK (my_study BETWEEN 1 AND 5),
  pref_study   SMALLINT NOT NULL DEFAULT 3 CHECK (pref_study BETWEEN 1 AND 5),

  -- Step 4: 兴趣图谱
  hobbies          TEXT,
  music_preference TEXT,
  video_preference TEXT,

  -- Step 5: 内心世界
  life_priority   TEXT,
  spending_style  TEXT,
  stress_response TEXT,
  decision_style  TEXT,

  -- Step 6: 关系筛选
  intent                  TEXT NOT NULL,
  accept_long_distance    TEXT NOT NULL,
  dating_experience       TEXT,
  target_year             TEXT,
  pref_university         TEXT,
  pref_campus             TEXT,
  pref_dating_experience  TEXT,
  social_energy           TEXT,
  love_language           TEXT,
  conflict_style          TEXT NOT NULL,
  date_frequency          TEXT,

  -- Step 7: 未来拼图
  future_city        TEXT,
  edu_plan           TEXT,
  marriage_timeline  TEXT,
  relationship_pace  TEXT
);

CREATE INDEX idx_responses_email ON responses(email);
CREATE INDEX idx_responses_gender ON responses(user_gender);
CREATE INDEX idx_responses_university ON responses(user_university);
CREATE INDEX idx_responses_created ON responses(created_at);

-- ============================================================
-- matches: 每周匹配结果
-- ============================================================
CREATE TABLE IF NOT EXISTS matches (
  id            BIGSERIAL PRIMARY KEY,
  week_start    DATE NOT NULL,
  user_email_a  TEXT NOT NULL,
  user_email_b  TEXT NOT NULL,
  score         SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 100),
  score_detail  JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(week_start, user_email_a),
  UNIQUE(week_start, user_email_b)
);

CREATE INDEX idx_matches_week ON matches(week_start);
CREATE INDEX idx_matches_user_a ON matches(user_email_a, week_start);
CREATE INDEX idx_matches_user_b ON matches(user_email_b, week_start);

-- ============================================================
-- match_actions: 用户对匹配结果的操作
-- ============================================================
CREATE TABLE IF NOT EXISTS match_actions (
  id          BIGSERIAL PRIMARY KEY,
  match_id    BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  action      TEXT NOT NULL CHECK (action IN ('connect', 'pass')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, email)
);

CREATE INDEX idx_match_actions_match ON match_actions(match_id);

-- ============================================================
-- email_verifications: OTP 验证码
-- ============================================================
CREATE TABLE IF NOT EXISTS email_verifications (
  id          BIGSERIAL PRIMARY KEY,
  email       TEXT NOT NULL,
  code        TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_verifications_lookup ON email_verifications(email, used, expires_at);

-- ============================================================
-- school_requests: 学校申请接入
-- ============================================================
CREATE TABLE IF NOT EXISTS school_requests (
  id          BIGSERIAL PRIMARY KEY,
  school_name TEXT NOT NULL,
  email       TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS: anon 可 insert responses，其余用 service_role API
-- ============================================================
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY r_anon_insert ON responses FOR INSERT WITH CHECK (true);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY sr_anon_insert ON school_requests FOR INSERT WITH CHECK (true);

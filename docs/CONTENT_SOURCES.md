# Content Sources & Verification

Every project entry was built from a primary source: a public repository, a
deployed site, or a local project directory inspected directly. Claims that
could not be verified from a primary source are labelled as owner-reported.

## Repositories verified via the GitHub API

| Slug | Repository | Verified |
| --- | --- | --- |
| `algorithm-discovery-lab` | `mohdmohsinrizvi/algorithm-discovery-engine` | Yes — Python, MIT licence, created 2026-09-11, README read. Confirms the `adl` CLI, evolutionary / MAP-Elites / random search, exhaustive verification for n ≤ 8, SQLite discovery archive and web dashboard. |
| `saafai` | `mohdmohsinrizvi/SaafAi` | Yes — repository exists, public. |
| `vibecoderz` | `mohdmohsinrizvi/vibecoderz` | Yes — repository exists, public. |
| `virtual-chemistry-lab` | `mohdmohsinrizvi/virtual-chemistry-lab` | Yes — repository exists, public. |
| `esp32-csi` | `mohdmohsinrizvi/esp32_ruview_csi` | Yes — repository exists, public. Firmware also inspected from the local source tree. |

## Deployed sites verified over HTTP

| Slug | URL | Status | Notes |
| --- | --- | --- | --- |
| `campusresq` | `https://safety-exit.onrender.com/` | 200 | Content read: "Blue Dot Location Generator", Mappedin JS SDK v6, Tom Select for location search, hazard zones, turn-by-turn navigation, blue-dot simulation. |
| `bbdu-study-hub` | `https://bbdu.netlify.app/` | 200 | Content read: "BBD Study Hub — B.Tech CSE Study Material & Syllabus". |

## Local source trees inspected

### CardioSense — `/home/mohsin/Desktop/ecg project/CardioSense/`

Kotlin Android application, 39 `.kt` files. Directly inspected:

- BLE acquisition layer: `BleEcgDataSource`, `BleProtocol`, `BleScanner`
- `EcgSimulator` for development without hardware
- Room persistence layer
- `MonitorService` background capture
- Rendering: `EcgStripView`, `EcgWaveformView`, `MiniWaveView`
- Fragments for home, monitor, history, report, devices, settings and onboarding

### ESP32 CSI capture — `esp32_ruview_csi/esp32_ruview_csi.ino`

ESP-IDF CSI callback registration, hot path limited to counters and sampled
values, UDP telemetry with sequence numbers so drops are visible, and
per-class frame counters (probes, beacons, management, data).

> **Security:** this source file contains a hard-coded Wi-Fi SSID and
> password. Neither appears anywhere in this site, its content, or its
> documentation, and neither is reproduced here.

## Repositories that could not be verified

| Reference | Status | Handling |
| --- | --- | --- |
| `SHEIKH-NASIR/safety-exit` | The owner account no longer resolves (404). | The deployed site above was used as the primary source instead. The GitHub link is **not** published on the site, because it would 404. |

## Discrepancies and flagged claims

These are recorded deliberately. Where a discrepancy exists, the site
states the more conservative reading.

| Item | Discrepancy | How the site handles it |
| --- | --- | --- |
| Smart India Hackathon | The repository `mohdmohsinrizvi/sih` README reads **"Smart India Hackathon 2024"**, while the site owner states the participation was in **2026**. | The site says "Smart India Hackathon — internal round" and does **not** state a year for the event. It explicitly says the result was the university internal selection round and **not** a national finalist result. |
| CampusResQ project year | No reliable year established from primary sources. | `year` is `null` in the data, rendered as "—" rather than invented. No repository URL is published for it, since the original repo is gone. |
| Chakravyuh 1.0 first prizes | Both the Safety & Security domain prize and the overall first prize are **owner-reported**. No public listing was located. | Stated on the site as the owner's account, with a LinkedIn evidence link. Not presented as independently verified. |
| Amazon ML Challenge | Described in informal contexts as a win or a finalist result. | The site states: approximate top 3%, score movement 0.559 → 0.939309, four-person team, roughly 72 hours, **"a competition entry — not a win, and not advancement to a later round."** |
| CardioSense | Could be read as a medical product. | The site states it is a **prototype for learning and demonstration**, and explicitly **not a clinically validated medical device**. |
| CampusResQ | Could be read as certified safety equipment. | The site states it is **not certified emergency equipment** and should not be relied on as such. |
| E-Cell IIT Bombay role | Could be read as employment or enrolment. | The site states it is a **student representative role — not employment at, or enrolment in, IIT Bombay**. |
| AWS / Deloitte / JPMorganChase credentials | Could be read as employment. | Each carries an explicit note: a simulated work experience, not employment and not a certification. |
| SIH problem statement | — | Problem statement #26069, team ResQSix, is stated with the internal-round qualifier. |

## Privacy

- `profile.email` is `null`. No email address is published in any page,
  metadata field or test fixture. A Playwright test asserts that no email
  pattern appears in the rendered HTML of `/`, `/about` or `/contact`.
- `profile.resumeUrl` is `null`. The contact page renders "Not published".
- No phone number, street address, date of birth or CGPA appears anywhere.
- Contact is routed through LinkedIn and GitHub only, so there is no
  unattended inbox exposed in plain text.

## Owner-reported vs verified

Verified from a primary source: repository existence and language, licence,
deployed site behaviour and content, README claims, local source structure,
score figures that appear in a public README, repository creation dates.

Owner-reported: hackathon placements, campus role titles, competition
ranking, freelance engagement history, credential completion.

Nothing on the site claims independent verification of an owner-reported
item.

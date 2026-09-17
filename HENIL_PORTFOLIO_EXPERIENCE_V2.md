# HENIL PORTFOLIO — EXPERIENCE V2
## Master Experience & Engineering Specification

**Document:** `HENIL_PORTFOLIO_EXPERIENCE_V2.md`  
**Status:** Master V2 Specification  
**Purpose:** Single source of truth for the complete experience-layer transformation of the existing HENIL portfolio.  
**Implementation model:** One autonomous implementation pass by Antigravity. No phase-by-phase implementation prompts.

---

# 0. EXECUTIVE DIRECTIVE

The existing portfolio is a strong technical foundation, but V2 must change the **experience category** of the website.

### Current category

> Premium animated developer portfolio.

### V2 category

> **An interactive digital experience that happens to be Henil Patel's portfolio.**

The website must not feel like:

- a normal resume website with animations
- a template portfolio
- a collection of cards
- a SaaS landing page
- a generic cyberpunk site
- a page with random scroll-triggered fades
- a Three.js demo attached to a portfolio
- a collection of visual effects without purpose

It should feel like a **designed digital environment**.

The visitor should progressively experience:

> **“What am I looking at?”**  
> → **“Wait… this is a portfolio?”**  
> → **“I need to explore this.”**

The experience must be visually ambitious while remaining technically disciplined.

---

# 1. NON-NEGOTIABLE PRINCIPLES

## 1.1 The interaction IS the interface

Do not merely animate existing HTML.

For every major interaction, define:

1. What the visitor does.
2. What physically responds.
3. What changes visually.
4. What information is revealed.
5. What state the system enters afterward.

Examples:

### Bad

Text fades in when scrolling.

### Good

The visitor scrolls and the hero typography compresses vertically, the background grid changes perspective, the cursor field bends nearby letterforms, and the hero composition physically moves upward to reveal the next visual world.

---

## 1.2 Motion must have meaning

Every major animation must communicate at least one of:

- hierarchy
- navigation
- continuity
- transformation
- depth
- cause/effect
- discovery
- storytelling
- system state

Avoid animation simply because animation is possible.

---

## 1.3 Build fewer unforgettable moments, not hundreds of effects

Target approximately **5–7 genuinely memorable experience moments**.

Primary moments:

1. Hero typography physically reacts to the visitor.
2. Scrolling transforms the entire composition.
3. Projects become distinct visual worlds.
4. Project-to-project transitions morph between worlds.
5. HENEOXY temporarily takes over the interface.
6. Creative Lab behaves like an interactive gallery.
7. The ending contains an unexpected but purposeful interaction.

---

## 1.4 Performance is part of the design

A beautiful effect that causes visible stutter is a failed effect.

Prefer:

- transforms
- opacity
- clip-path
- CSS compositing
- GPU-friendly canvas/WebGL
- procedural geometry
- lightweight shaders
- texture displacement
- efficient image sequences
- selective blur
- GSAP timelines
- Motion for component interactions

Avoid:

- giant particle fields
- unnecessary DOM nodes
- continuous expensive CPU calculations
- huge uncompressed media
- excessive backdrop filters
- multiple competing animation loops
- constantly rendering 3D when it is not visible
- layout-thrashing animations

Do not make unverified numerical performance claims in UI copy.

---

## 1.5 Content truth is mandatory

Never invent:

- clients
- testimonials
- job titles
- companies
- awards
- metrics
- project results
- user counts
- performance benchmarks
- technologies the user has not confirmed
- fabricated project screenshots
- fake GitHub stars
- fake users
- fake revenue
- fake production claims

If content is missing, create a clear content placeholder that can later be populated through CMS.

---

# 2. EXISTING V1 FOUNDATION

The current application already provides the technical base.

## 2.1 Existing stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Motion for React
- GSAP
- ScrollTrigger
- Lenis
- Three.js
- React Three Fiber
- Drei
- Lucide React
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Vercel target deployment

Do not replace the stack merely for novelty.

---

## 2.2 Existing architecture

Public routes:

- `/`
- `/project/:slug`
- `/creative`

Admin routes:

- `/admin/login`
- `/admin`
- `/admin/projects`
- `/admin/experience`
- `/admin/skills`
- `/admin/creative`
- `/admin/achievements`
- `/admin/settings`

The CMS architecture must remain functional.

---

## 2.3 Existing motion architecture

Use the current responsibility split:

### Motion for React

Use for:

- component interaction
- hover
- tap
- local state transitions
- layout-adjacent interactions where appropriate
- presence transitions

### GSAP / ScrollTrigger

Use for:

- cinematic timelines
- pinned sections
- scroll choreography
- scrubbing
- section transformations
- cross-world transitions

### Lenis

Use as the smooth-scroll layer.

There must remain **one coherent scrolling/animation loop**.

### Three.js / R3F

Use for:

- environmental visual systems
- procedural geometry
- particle/point systems where justified
- shader-based distortion
- spatial project worlds
- controlled interactive backgrounds

Do not create a global always-running WebGL scene simply because Three.js exists.

---

# 3. DESIGN LANGUAGE

## 3.1 Core visual identity

### Background

Near-black:

- `#070709`
- `#0B0B0E`

### Primary text

Near-white:

- `#F4F4F6`

### Secondary text

Muted gray:

- `#8A8A93`

### Borders

Very subtle:

- `rgba(255,255,255,.08)`

### Accent

Controlled cyan:

- `#00F0FF`

The cyan is an **event color**, not the entire website's color palette.

---

## 3.2 Typography

Preferred typography:

- Space Grotesk
- Inter
- JetBrains Mono

Use typography as a visual system.

Large typography should sometimes behave like:

- architecture
- texture
- navigation
- geometry
- environmental objects

Not every heading should simply sit inside a container.

---

## 3.3 Visual character

The design should feel:

- dark
- editorial
- technical
- futuristic
- precise
- cinematic
- experimental
- minimal
- intelligent

Avoid:

- purple SaaS gradients
- generic blue gradients
- rainbow neon
- excessive glassmorphism
- generic glowing cards
- excessive rounded cards
- stock illustrations
- generic dashboard aesthetics
- random floating 3D shapes
- “AI” visual clichés everywhere

---

# 4. EXPERIENCE ARCHITECTURE

The site should behave like one continuous visual narrative.

Recommended journey:

```text
SYSTEM INITIALIZATION
        ↓
HERO / IDENTITY
        ↓
PERSON / CONTEXT
        ↓
CAPABILITY FIELD
        ↓
PROJECT UNIVERSES
        ↓
HENEOXY TAKEOVER
        ↓
CREATIVE LAB
        ↓
CONTACT / SIGNAL
        ↓
FINAL INTERACTION
```

Sections must not feel like unrelated pages stacked vertically.

The visual language of one section should create the next.

---

# 5. GLOBAL EXPERIENCE SYSTEM

## 5.1 Persistent environment

Create a lightweight global visual environment containing:

- near-black base
- subtle grain
- extremely subtle technical grid
- dynamic light field
- contextual visual layers
- optional WebGL environment
- cursor influence
- scroll-velocity influence

The environment should change depending on the section.

### Example

Normal section:

- quiet grid
- subtle grain
- low-energy light field

Project section:

- stronger geometry
- project-specific visual language

HENEOXY:

- spatial computing / agent system atmosphere

Creative Lab:

- photographic/editorial atmosphere

Contact:

- environment simplifies again

Do not keep every visual system at maximum intensity simultaneously.

---

# 6. HERO EXPERIENCE

The hero is the first major signature moment.

## 6.1 Initial state

The page should not immediately show a conventional portfolio hero.

Initial visual state:

- mostly black
- tiny system metadata
- subtle ambient movement
- small fragments/lines
- restrained initialization text

Possible metadata:

```text
HP / EXPERIENCE_01
INITIALIZING...
```

The exact copy may be adjusted if it improves the design.

---

## 6.2 Construction sequence

The hero should feel as though it is constructing itself.

Potential sequence:

1. Background wakes.
2. Fine lines appear.
3. Small metadata becomes visible.
4. Typography fragments enter.
5. Large name assembles.
6. Environmental field stabilizes.
7. Supporting role appears.
8. Cursor interaction becomes active.

The sequence should be cinematic, not slow for the sake of being slow.

---

## 6.3 Name treatment

Primary:

```text
HENIL
PATEL
```

or another composition if the design system produces a stronger result.

The typography should have physical behavior.

Possible interactions:

- cursor displacement
- velocity distortion
- magnetic attraction
- local character offset
- subtle depth
- horizontal compression
- tracking changes
- shader displacement
- parallax layers

Do not stack every effect.

Select a coherent combination.

---

## 6.4 Hero cursor interaction

Cursor proximity should influence the typography or nearby environment.

Possible behavior:

- letters subtly repel from cursor
- local displacement field
- character-level distortion
- light field follows cursor
- secondary labels emerge

The effect must remain controlled and readable.

---

## 6.5 Hero scroll transition

Scrolling must not simply fade the hero away.

The visitor should feel that the hero is physically leaving its current state.

Possible choreography:

```text
HERO
 ↓
name compresses
 ↓
background perspective shifts
 ↓
system metadata migrates
 ↓
grid rotates/changes depth
 ↓
hero exits viewport
 ↓
next visual world is revealed
```

The transition should establish the site's core motion language.

---

# 7. TYPOGRAPHY ENGINE

Typography is one of the primary visual assets.

## 7.1 Typography states

Create reusable typography behavior:

- reveal
- split
- mask
- displacement
- kinetic tracking
- velocity response
- depth
- scale
- clipping
- perspective
- character stagger

---

## 7.2 Large typography

Use oversized type when appropriate.

Large words may:

- extend beyond viewport
- move at different speeds
- become masks
- reveal imagery
- act as navigation
- transition into project labels

But readability must remain intentional.

---

# 8. CURSOR SYSTEM

Desktop cursor behavior should feel like part of the interface.

## 8.1 Base cursor

A minimal custom cursor may include:

- small dot
- ring
- velocity trail
- subtle magnetic behavior

Keep it lightweight.

---

## 8.2 Contextual states

Cursor can communicate interaction.

Examples:

```text
EXPLORE
VIEW
OPEN ↗
ROTATE
← DRAG →
PLAY
```

The label should only appear when relevant.

---

## 8.3 Physical behavior

Cursor movement may use:

- spring interpolation
- delayed secondary ring
- magnetic attraction
- contextual scaling

Avoid excessive trails or particle spam.

---

## 8.4 Touch devices

Do not simulate a mouse cursor on touch devices.

Replace cursor behavior with:

- touch
- drag
- swipe
- scroll velocity
- tap states

---

# 9. SCROLL SYSTEM

Scrolling is the main storytelling mechanism.

## 9.1 Scroll controls time

Scroll should control:

- composition
- depth
- typography
- object movement
- environmental intensity
- project state
- transitions

Not simply:

> scroll → reveal next card.

---

## 9.2 Pinning

Use pinned sections selectively.

A pinned section should have an actual transformation narrative.

Example:

```text
PROJECT INTRO
      ↓
PIN
      ↓
visual world constructs
      ↓
content appears
      ↓
visual state changes
      ↓
project exits
      ↓
UNPIN
```

---

## 9.3 Scroll velocity

Use velocity as an input.

Fast scrolling can cause:

- increased distortion
- stronger streaking
- faster typography displacement
- environmental energy increase

When the visitor stops:

- system settles
- noise decreases
- composition stabilizes

The effect should not cause visual chaos.

---

# 10. TRANSITION SYSTEM

The site needs visual continuity between sections.

Avoid:

> section A ends → blank gap → section B starts.

Instead:

> section A transforms into section B.

---

## 10.1 Project transition examples

### HENEOXY → AeroIndex

Possible transformation:

```text
agent nodes
    ↓
network connections
    ↓
lines extend
    ↓
lines become flight paths
    ↓
grid changes
    ↓
AeroIndex environment emerges
```

### AeroIndex → COALINTEL

Possible transformation:

```text
flight paths
    ↓
vectors collapse
    ↓
map becomes terrain
    ↓
terrain becomes geological layers
    ↓
document/evidence fragments emerge
    ↓
COALINTEL
```

These are conceptual directions, not mandatory literal implementations.

---

# 11. PROJECT UNIVERSE

Projects should not be presented as ordinary cards.

Each major project should feel like entering a different visual universe.

Current project worlds:

1. HENEOXY
2. AeroIndex India
3. COALINTEL
4. Architectural Blueprint

---

# 12. HENEOXY EXPERIENCE

HENEOXY is a major portfolio centerpiece.

It should receive significantly more experience depth than a standard project.

## 12.1 Visual identity

HENEOXY can use:

- agent nodes
- spatial planes
- network paths
- terminal fragments
- data streams
- contextual panels
- subtle shader distortion
- system architecture
- spatial relationships

The visual language should communicate:

> AI + systems + agents + personal computing environment.

---

## 12.2 HENEOXY takeover

At an appropriate point, HENEOXY should temporarily feel like it is taking control of the portfolio.

Possible sequence:

```text
normal portfolio
      ↓
HENEOXY signal detected
      ↓
navigation transforms
      ↓
background changes
      ↓
cursor changes
      ↓
typography changes
      ↓
interface becomes system-like
```

The visitor should feel:

> “I just entered the project.”

---

## 12.3 HENEOXY internal narrative

Use concepts such as:

```text
SYSTEM
AGENTS
MEMORY
CONTEXT
TOOLS
SECURITY
ARCHITECTURE
```

These are storytelling categories, not claims that every feature is fully implemented.

Clearly distinguish:

- implemented
- currently developing
- researched
- planned
- conceptual

Never present planned functionality as completed functionality.

---

## 12.4 HENEOXY visual interaction

Possible interactions:

- drag a system node
- inspect an agent path
- reveal architecture layers
- hover system modules
- zoom into relationships
- scroll through system states

The experience should explain the project rather than becoming a fake operating system dashboard.

---

# 13. AEROINDEX INDIA EXPERIENCE

Visual language:

- radar
- flight paths
- altitude
- vectors
- navigation grids
- aircraft geometry
- coordinates represented visually without exposing the user's private precise location

Possible experience:

```text
dark field
 ↓
radar sweep
 ↓
vector appears
 ↓
flight path grows
 ↓
project title enters
 ↓
interface reveals system
```

Use real project media once supplied.

---

# 14. COALINTEL EXPERIENCE

Visual language:

- geological layers
- evidence chains
- document fragments
- industrial telemetry
- mapping
- structured information
- investigative/data-oriented atmosphere

Possible interaction:

```text
terrain
 ↓
layers separate
 ↓
evidence fragments appear
 ↓
relationships connect
 ↓
project interface emerges
```

Do not invent real-world metrics or system capabilities.

---

# 15. ARCHITECTURAL BLUEPRINT

This project should demonstrate the user's visual/design side.

Possible visual language:

- blueprint grids
- measured lines
- technical annotations
- dimensional movement
- architectural layers
- precise typography

The visual treatment should contrast with the AI/system projects.

---

# 16. PROJECT DETAIL PAGE

`/project/:slug` must feel like an extension of the project's world.

Avoid:

```text
Title
Description
Tech Stack
Screenshot
GitHub button
```

as a simple vertical template.

Instead:

```text
WORLD INTRO
 ↓
PROJECT IDENTITY
 ↓
CONTEXT
 ↓
VISUAL MEDIA
 ↓
SYSTEM / PROCESS
 ↓
KEY INTERACTIONS
 ↓
TECHNICAL STORY
 ↓
RESULT / CURRENT STATE
 ↓
MEDIA
 ↓
NEXT WORLD
```

The exact structure can vary by project.

---

# 17. MEDIA SYSTEM

Real media is critical to V2.

Procedural graphics can establish the environment, but real work must eventually dominate the project and Creative Lab presentation.

## 17.1 Project media

Support:

- screenshots
- screen recordings
- demo videos
- diagrams
- UI captures
- architecture visuals
- project-specific graphics

---

## 17.2 Creative media

Creative Lab should support:

- video
- motion
- graphics
- photography
- astrophotography
- experiments

Use only categories supported by actual user content.

---

## 17.3 Media behavior

Media may:

- stretch
- crop
- reveal
- distort
- parallax
- clip
- scale
- move through masks
- respond to cursor
- respond to scroll velocity

But the media itself must remain understandable.

Do not distort important screenshots so aggressively that they cannot be inspected.

---

## 17.4 Media loading

Implement:

- lazy loading
- responsive sources where useful
- optimized image formats
- video poster frames
- controlled preload
- viewport-based activation

Do not load every large asset on page initialization.

---

# 18. CREATIVE LAB

The Creative Lab should feel like a separate gallery mode.

## 18.1 Categories

Current categories:

```text
ALL
VIDEO
MOTION
GRAPHICS
PHOTOGRAPHY
ASTROPHOTOGRAPHY
EXPERIMENTS
```

Only populate categories with actual user work.

---

## 18.2 Gallery behavior

Do not use a standard grid as the primary experience.

Possible behavior:

```text
category
 ↓
large title
 ↓
media enters viewport
 ↓
media moves according to scroll
 ↓
cursor changes context
 ↓
metadata appears
 ↓
next work intersects viewport
```

---

## 18.3 Gallery interactions

Potential interactions:

- drag
- hover reveal
- image displacement
- velocity-based movement
- fullscreen media
- category transitions
- horizontal sequences
- overlapping media layers

Choose the interaction model that best fits the content.

---

# 19. CONTACT / SIGNAL

The contact section should not be a boring:

> “Let's work together” + form.

Create a final state that feels like the system is becoming quiet.

Potential progression:

```text
visual intensity decreases
 ↓
grid fades
 ↓
large typography appears
 ↓
contact signal becomes dominant
 ↓
interaction becomes simple
```

Potential copy:

```text
HAVE A SIGNAL?
```

or another concise concept.

Use actual contact information once supplied.

---

# 20. FINAL INTERACTION

The ending should contain one unexpected but purposeful moment.

Possible concepts:

- interface collapses into a tiny system
- cursor becomes a signal
- final typography responds to cursor
- site reveals a hidden “system shutdown” state
- a minimal interaction reconstructs the opening

A particularly strong option is a **visual loop**:

```text
END
 ↓
system collapses
 ↓
single signal remains
 ↓
signal expands
 ↓
opening visual language briefly returns
```

Do not create an annoying infinite loop.

---

# 21. SOUND

Sound is optional.

If implemented:

- no autoplay
- explicit user control
- muted by default
- subtle UI sounds
- optional ambient layer
- no aggressive music
- no audio required for understanding the site

Sound must enhance the experience, never become a requirement.

---

# 22. MOBILE EXPERIENCE

Mobile is not desktop stacked vertically.

Create a deliberate mobile choreography.

## Desktop

Can support:

- cursor
- hover
- richer WebGL
- spatial composition
- horizontal movement
- pinned scenes
- more complex visual layering

## Mobile

Prefer:

- touch
- drag
- swipe
- scroll velocity
- simplified WebGL
- fewer simultaneous layers
- carefully controlled typography
- vertical transformations

Maintain the same identity but use a different interaction model.

---

# 23. RESPONSIVE TYPOGRAPHY

Large desktop typography must not simply scale proportionally.

Create intentional mobile compositions.

Check:

- no overflow
- no clipped critical text
- readable metadata
- safe interaction zones
- no accidental horizontal scrolling

---

# 24. ACCESSIBILITY

Must support:

- keyboard navigation
- visible focus states
- semantic HTML
- useful labels
- accessible buttons/links
- reduced-motion mode
- sufficient text contrast
- media alternative text where appropriate

---

# 25. REDUCED MOTION

When:

```css
prefers-reduced-motion: reduce
```

the experience should remain premium.

Replace:

- intense parallax
- continuous motion
- large displacement
- aggressive transitions

with:

- simple reveals
- opacity
- short transforms
- static visual composition
- accessible navigation

Do not make reduced-motion users experience a broken or empty website.

---

# 26. WEBGL STRATEGY

Three.js should be treated as a visual instrument.

Potential uses:

- particle fields
- procedural geometry
- line networks
- spatial planes
- project-specific environments
- shader displacement
- light fields

Avoid:

- generic spinning cubes
- random floating spheres
- unnecessary 3D models
- giant particle counts
- permanent high-cost rendering

---

## 26.1 WebGL lifecycle

WebGL scenes should:

- initialize only where useful
- pause when offscreen where possible
- clean up on unmount
- dispose resources
- avoid duplicate render loops
- adapt quality to device capability

---

## 26.2 Device adaptation

Use capability-aware behavior.

Potential levels:

```text
HIGH
MEDIUM
LOW
REDUCED MOTION
```

The visual language should remain coherent across all levels.

---

# 27. PERFORMANCE ARCHITECTURE

## 27.1 Animation

Prefer:

- transform
- opacity
- clip-path
- CSS variables
- compositor-friendly properties

Be cautious with:

- filters
- blur
- box-shadow animation
- layout properties
- expensive SVG manipulation

---

## 27.2 Rendering

Avoid unnecessary rerenders.

Use:

- memoization where justified
- isolated animation components
- refs for animation state where appropriate
- throttled pointer calculations
- requestAnimationFrame only where necessary

Do not introduce abstractions merely for abstraction's sake.

---

## 27.3 Media

Use:

- compression
- modern formats
- responsive sizing
- lazy loading
- poster frames
- deferred loading

---

## 27.4 Bundle

Keep Three.js lazy-loaded.

Do not accidentally pull heavy visual dependencies into the initial bundle unless justified.

---

# 28. TECHNICAL ARCHITECTURE

The V2 experience should be implemented as reusable systems.

Suggested architecture:

```text
src/
  components/
    experience/
      HeroExperience
      CursorSystem
      EnvironmentSystem
      TypographySystem
      ScrollScene
      WorldTransition
      ProjectWorld
      MediaStage
      ExperienceFooter

    worlds/
      HeneoxyWorld
      AeroIndexWorld
      CoalIntelWorld
      BlueprintWorld

    creative/
      CreativeGallery
      CreativeMedia
      CreativeCategory

    motion/
      Reveal
      Magnetic
      Velocity
      SplitText
      ClipReveal

    webgl/
      SceneController
      Field
      Particles
      Lines
      ShaderPlane

  hooks/
    useCursorField
    useScrollVelocity
    useReducedMotion
    useMediaQuery
    useWebGLCapability

  lib/
    animation
    performance
    media
    content
```

This is a conceptual architecture.

Reuse existing project conventions where they are already good.

Do not reorganize the entire repository unnecessarily.

---

# 29. STATE MANAGEMENT

Keep experience state minimal.

Useful global states may include:

```text
currentWorld
cursorMode
reducedMotion
webglQuality
soundEnabled
activeProject
```

Avoid turning animation state into a giant global store.

---

# 30. CMS COMPATIBILITY

The visual experience must remain compatible with the existing admin/CMS architecture.

CMS content should drive:

- projects
- experience
- skills
- creative work
- achievements
- settings
- media

The design should not hardcode project content when that content already belongs in the CMS.

---

# 31. V1 → V2 MIGRATION

## KEEP

Keep:

- React/TypeScript/Vite
- Tailwind
- Motion
- GSAP
- ScrollTrigger
- Lenis
- Three.js/R3F/Drei
- Supabase architecture
- authentication
- CMS
- routes
- content model
- security model
- reduced-motion support
- performance discipline
- current visual identity foundation

---

## MODIFY

Modify:

- hero composition
- section transitions
- project presentation
- background environment
- typography behavior
- cursor
- scroll choreography
- Creative Lab presentation
- project detail storytelling
- mobile choreography
- visual hierarchy

---

## REBUILD WHERE NECESSARY

Rebuild:

- hero experience if current implementation cannot reach the V2 target
- project presentation layer
- cross-section transition system
- project worlds
- HENEOXY takeover
- Creative Lab interaction layer
- global environmental system

Do not rebuild working infrastructure merely for aesthetic reasons.

---

## REMOVE / AVOID

Remove or avoid:

- phase markers
- development-status UI
- fake metrics
- fake testimonials
- unnecessary badges
- generic skill bars
- excessive cards
- repetitive fade-ins
- generic gradient blobs
- excessive glow
- unnecessary blur
- random 3D decorations
- unverified performance claims
- professional title inflation
- private precise location data

---

# 32. CONTENT RULES

Current truthful identity direction:

```text
Creative Technologist & Software Engineer
```

or another accurate title based on actual user-provided content.

Do not inflate experience.

Confirmed creative/tool context includes:

- DaVinci Resolve
- Photoshop
- Canva
- AI tools

Do not claim unconfirmed expertise in:

- Figma
- After Effects
- Lightroom
- Blender
- other software

unless the user later supplies it.

---

# 33. PROJECT TRUTH RULES

### HENEOXY

Describe according to actual status:

- research
- architecture
- development
- implemented features
- planned features

Never imply that planned features are already complete.

Do not claim HENEOXY beats Hermes Agent.

Hermes is a benchmark/reference point, not proof of superiority.

---

### AeroIndex India

Use actual project information and supplied media.

Do not invent deployment metrics or adoption numbers.

---

### COALINTEL

Use actual implementation and supplied media.

Do not invent accuracy, users, organizations, or production impact.

---

### Architectural Blueprint

Use the actual work.

---

# 34. VISUAL HIERARCHY RULE

Not every section should scream.

The site needs rhythm.

Recommended intensity curve:

```text
QUIET
  ↓
HIGH
  ↓
MEDIUM
  ↓
HIGH
  ↓
EXTREME / HENEOXY
  ↓
EDITORIAL / CREATIVE
  ↓
QUIET
  ↓
SIGNAL
```

Contrast creates impact.

---

# 35. VISUAL DENSITY

Use intentional negative space.

But avoid empty areas that exist only because a template expects them.

Every large empty area should serve one of:

- anticipation
- scale
- focus
- transition
- breathing room
- visual contrast

---

# 36. INTERACTION PRIORITY

Prioritize:

### Tier 1 — Signature

Must feel exceptional:

- hero
- project worlds
- HENEOXY takeover
- major transitions
- Creative Lab

### Tier 2 — Supporting

Should feel polished:

- cursor
- navigation
- project metadata
- contact
- hover interactions

### Tier 3 — Utility

Should remain simple:

- admin
- forms
- settings
- authentication
- CMS controls

Do not waste visual complexity on utility screens.

---

# 37. NAVIGATION

Navigation should be minimal.

Possible structure:

```text
HENIL
WORK
CREATIVE
ABOUT
CONTACT
```

The exact labels may be adjusted.

Navigation can transform contextually during HENEOXY.

Do not make navigation difficult to discover.

---

# 38. LOADING EXPERIENCE

Loading should feel designed but must not block users unnecessarily.

If assets are loading:

- show meaningful progress only if measurable
- use skeleton/placeholder composition
- progressively reveal media
- avoid fake percentage counters

Never display:

> LOADING 87%

unless that percentage represents actual measurable progress.

---

# 39. ERROR STATES

Error states should match the visual system while remaining understandable.

Examples:

```text
SIGNAL INTERRUPTED
MEDIA UNAVAILABLE
SYSTEM CONNECTION LOST
```

Then provide a normal explanation/action.

Do not hide functional error information behind aesthetic language.

---

# 40. SECURITY REQUIREMENTS

Preserve existing security rules.

Never expose:

- Supabase service-role key
- private credentials
- secrets
- admin-only data

Admin access must be authenticated.

Hiding admin controls in the UI is not security.

---

# 41. OFFLINE / FIXTURE MODE

Fixture fallback may exist for development.

However:

> No Supabase production configuration must never grant administrative access.

Fixture data is for development/demo fallback only.

---

# 42. IMPLEMENTATION DECISION RULE

When deciding between two visual approaches:

Choose the one that provides the strongest combination of:

1. visual impact
2. clarity
3. performance
4. maintainability
5. accessibility
6. content truth

Do not choose an effect simply because it looks technically impressive.

---

# 43. ANIMATION QUALITY RULE

Animation should have:

### Entrance

Where did it come from?

### Movement

What is it doing?

### Destination

Where does it settle?

### Relationship

What does this movement communicate?

### Exit

How does it become the next thing?

This creates choreography instead of isolated effects.

---

# 44. DESIGN FOR “DISCOVERY”

The site should reward exploration.

Examples:

- hover reveals
- hidden metadata
- subtle interaction states
- contextual cursor labels
- project world details
- media inspection
- small system annotations

But discovery must never hide essential information.

---

# 45. NO EFFECT STACKING

Do not simultaneously apply:

- large blur
- chromatic aberration
- heavy displacement
- particles
- noise
- glow
- parallax
- scale
- rotation

to every object.

Use a visual hierarchy.

One dominant effect + supporting effects is generally stronger than eight equal effects.

---

# 46. REAL MEDIA INTEGRATION STRATEGY

The site should be architected so the user can later provide:

### HENEOXY

- screenshots
- architecture diagrams
- videos
- UI captures
- GitHub/live links

### AeroIndex India

- screenshots
- dashboard captures
- maps
- project demo

### COALINTEL

- screenshots
- evidence/reporting UI
- architecture
- demo

### Creative Lab

- actual edited videos
- motion work
- graphics
- photography
- astrophotography
- experiments

When real media is unavailable during development:

Use restrained placeholders that clearly communicate where the media belongs.

Do not fill the site with fake AI-generated “project screenshots” that could be mistaken for real work.

---

# 47. DESKTOP EXPERIENCE

Desktop can use the full visual system.

Target:

- immersive viewport composition
- cinematic typography
- richer WebGL
- contextual cursor
- deep scroll choreography
- project worlds
- transitions
- media stages

Do not assume visitors have infinite GPU power.

---

# 48. TABLET EXPERIENCE

Reduce:

- particle density
- simultaneous layers
- complex hover behavior

Maintain:

- typography
- transitions
- project identity
- strong visual rhythm

---

# 49. MOBILE EXPERIENCE

Mobile should still feel intentional and premium.

Do not simply:

```text
desktop section
↓
desktop section
↓
desktop section
```

Instead design mobile-specific transformations.

Potential pattern:

```text
visual object
 ↓
touch interaction
 ↓
content reveal
 ↓
object transforms
 ↓
next content
```

---

# 50. ACCESSIBILITY + INTERACTION FALLBACKS

Every interactive visual should have a non-interactive information path.

For example:

If a project is represented by an interactive WebGL world, the user must still be able to:

- read the project title
- understand what it is
- access project details
- navigate with keyboard
- interact without a mouse where applicable

---

# 51. ACCEPTANCE CRITERIA

V2 is successful only if all of the following are true.

## Experience

- [ ] Site no longer feels like a conventional portfolio template.
- [ ] Hero is a signature experience.
- [ ] Scrolling feels choreographed.
- [ ] Major sections visually transform.
- [ ] Projects feel like different worlds.
- [ ] At least one project transition feels genuinely surprising.
- [ ] HENEOXY has a distinct takeover experience.
- [ ] Creative Lab feels like an interactive gallery.
- [ ] Ending has a memorable final interaction.
- [ ] Visual rhythm includes both intensity and quiet.

## Visual

- [ ] Dark editorial identity remains coherent.
- [ ] Typography is a major visual element.
- [ ] Cyan is controlled.
- [ ] No generic SaaS visual language.
- [ ] No excessive glassmorphism.
- [ ] No random 3D decoration.
- [ ] No effect overload.

## Interaction

- [ ] Cursor has contextual states on desktop.
- [ ] Touch behavior is intentionally designed.
- [ ] Scroll velocity can influence visual energy.
- [ ] Transitions connect sections.
- [ ] Interactions communicate meaning.

## Performance

- [ ] Three.js remains lazy where appropriate.
- [ ] WebGL quality adapts.
- [ ] Offscreen visual systems are minimized/paused where appropriate.
- [ ] Media is lazy-loaded.
- [ ] No unnecessary animation loops.
- [ ] No obvious animation-induced layout thrashing.
- [ ] Build succeeds.

## Accessibility

- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Reduced-motion mode works.
- [ ] Interactive controls have labels.
- [ ] Content remains understandable without visual effects.

## Content

- [ ] No fake metrics.
- [ ] No fake clients.
- [ ] No fake testimonials.
- [ ] No unsupported technologies.
- [ ] No fabricated achievements.
- [ ] No precise private location.
- [ ] Project status is truthful.

## CMS

- [ ] Existing admin routes remain functional.
- [ ] Public content remains CMS-compatible.
- [ ] Media remains manageable through the content system.
- [ ] Authentication remains secure.

---

# 52. SELF-AUDIT CHECKLIST

Before declaring V2 complete, inspect:

### Visual

- Does the first viewport immediately establish a unique identity?
- Does the site feel designed rather than assembled?
- Are transitions meaningful?
- Is typography being used creatively?
- Are project worlds visually distinct?

### Interaction

- What happens when the cursor moves?
- What happens when the visitor scrolls quickly?
- What happens when they stop?
- What happens when they hover a project?
- What happens when they enter HENEOXY?
- What happens on touch?

### Performance

- Are any expensive effects running continuously without purpose?
- Are hidden WebGL scenes still rendering?
- Are huge images loaded immediately?
- Are animation calculations causing unnecessary React renders?

### Accessibility

- Can the site be navigated with keyboard?
- Does reduced motion remain attractive?
- Are essential interactions still understandable?

### Truth

- Did implementation accidentally invent content?
- Did visual copy become a fake claim?
- Did placeholder media look real?
- Did any previous unsupported claim return?

---

# 53. IMPLEMENTATION PRIORITY

The autonomous implementation should prioritize in this order:

```text
1. Experience architecture
2. Hero signature moment
3. Global environmental system
4. Scroll choreography
5. Project worlds
6. World transitions
7. HENEOXY takeover
8. Creative Lab
9. Cursor system
10. Project detail storytelling
11. Mobile choreography
12. Performance hardening
13. Accessibility hardening
14. CMS regression verification
15. Final visual polish
```

This is a priority order, not a request for separate phases.

The implementation should be executed as **one coherent V2 transformation**.

---

# 54. AUTONOMOUS IMPLEMENTATION RULES

Antigravity must:

1. Read this entire document before modifying code.
2. Inspect the existing repository.
3. Understand current architecture before replacing anything.
4. Preserve working infrastructure.
5. Reuse existing systems where appropriate.
6. Implement the V2 experience as one coherent transformation.
7. Make reasonable design decisions autonomously.
8. Do not stop after implementing only the hero.
9. Do not ask for approval after each section.
10. Do not create “Phase 13”, “Phase 14”, etc.
11. Do not produce a list of future implementation tasks instead of implementing them.
12. Use existing CMS architecture.
13. Preserve security boundaries.
14. Preserve reduced-motion support.
15. Preserve mobile support.
16. Build and type-check after implementation.
17. Fix issues found during self-audit.
18. Review git diff for accidental changes.
19. Commit the completed V2 transformation.
20. Push to the existing repository branch currently used for the portfolio.
21. Return a concise final implementation report.

---

# 55. DO NOT OVER-ENGINEER

The objective is not:

> “largest codebase possible.”

The objective is:

> **maximum perceived experience quality per unit of technical complexity.**

A 200-line shader that creates one unforgettable moment may be better than 2,000 lines of effects.

A simple clip-path transition executed perfectly may be better than an expensive WebGL scene.

Choose quality over quantity.

---

# 56. FINAL EXPERIENCE TEST

After implementation, mentally simulate a completely random visitor.

They know nothing about Henil.

They open the homepage.

Within seconds they should understand:

> This is not a standard portfolio.

As they scroll:

> The website reacts to me.

When they reach projects:

> Each project feels like entering another world.

When they enter HENEOXY:

> This project has its own environment.

When they enter Creative Lab:

> This person is not only a coder.

When they reach the end:

> I remember the experience.

That is the V2 goal.

---

# 57. THE CORE STATEMENT

The entire implementation can be summarized by this principle:

> **Do not build a portfolio with animations.**
>
> **Build an interactive digital experience where the portfolio is the content.**

The website should feel:

**precise, cinematic, reactive, spatial, intelligent, experimental, fast, and unmistakably Henil.**

---

# 58. V2 DEFINITION OF DONE

V2 is not complete because:

- the build passes
- the animations work
- Three.js renders
- the homepage looks polished

V2 is complete when the **entire site behaves like one designed experience**.

The visitor should not consciously think:

> “Now I am on the About section.”

They should feel:

> “The environment changed, and I discovered something.”

That distinction is the heart of V2.

---

## END OF MASTER SPEC

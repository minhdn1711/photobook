# 📚 TÀI LIỆU PHÂN TÍCH KIẾN TRÚC TRẢI NGHIỆM TOÀN DIỆN
## Hệ Thống Photobook Custom — Web-to-Print Platform
> **Version:** 1.0  
> **Stack:** Vue 3 + Konva.js · Laravel API · MinIO/S3 · Node.js Sharp/PDFKit  
> **Created:** 2026-05-25  
> **Status:** Pre-development Blueprint

---

## 📑 MỤC LỤC

1. [Product Analysis & Editing Strategy](#1-product-analysis--editing-strategy)
2. [End-to-End User Flow](#2-end-to-end-user-flow)
3. [Screen Structure & Layout Hierarchy](#3-screen-structure--layout-hierarchy)
4. [Editor UX Design (Deep Dive)](#4-editor-ux-design-deep-dive)
5. [Premium Design System Specification](#5-premium-design-system-specification)
6. [Vue 3 Component Tree & Architecture](#6-vue-3-component-tree--architecture)
7. [Cross-Platform Responsive Strategy](#7-cross-platform-responsive-strategy)
8. [Text-Based Wireframe Description](#8-text-based-wireframe-description)
9. [Intermediate AI UI Generation Plan](#9-intermediate-ai-ui-generation-plan)
10. [MVP Compass & Development Roadmap](#10-mvp-compass--development-roadmap)

---

## BUSINESS MODEL & CONSTRAINTS (BẮT BUỘC TUÂN THỦ)

| Hạng mục | Ràng buộc |
|---|---|
| **Sản phẩm** | Photobook custom vật lý, cố định 16 trang |
| **Layout** | Mỗi trang dùng một Template định sẵn, không tự tạo layout |
| **Quyền User** | Chỉ được: upload ảnh, kéo ảnh vào Frame, zoom/crop trong frame, sửa Text có sẵn |
| **KHÔNG có** | Tạo layout mới, thêm object tự do (shapes/stickers), animation, full-editor |
| **Workflow** | Landing → Chọn mẫu → Preview → Upload ảnh → Edit → Preview → Submit → Cọc → Admin duyệt → Render PDF → In |
| **Bảo mật** | User KHÔNG export PDF. Chỉ Admin sở hữu file in cuối cùng |
| **Render** | PDF CMYK 300 DPI, server-side Node.js + Sharp + PDFKit |

---

# 1. PRODUCT ANALYSIS & EDITING STRATEGY

## 1.1 Business Model × User Behavior Matrix

### The Core Tension

Web-to-Print tạo ra một mâu thuẫn nội tại đặc thù: User muốn cảm giác **kiểm soát sáng tạo** nhưng thực chất họ cần **được dẫn dắt đến kết quả đẹp** càng nhanh càng tốt. Đây là sự khác biệt căn bản với Canva:

```
CANVA USER INTENT:          PHOTOBOOK USER INTENT:
"Tôi muốn thiết kế"    vs  "Tôi muốn có quyển sách đẹp"
Freedom-seeking            Outcome-seeking
Tool mastery valued        Speed & simplicity valued
Tolerates learning curve   Zero tolerance for friction
```

### Pain Points Phân Tầng (Tiered Pain Points)

**Tầng 1 — Cognitive Load (Tải nhận thức):**
- Sợ "làm hỏng thiết kế" — không biết tỷ lệ, font, màu nào phù hợp
- Sợ lãng phí tiền (sản phẩm vật lý không hoàn tiền nếu thiết kế tệ)
- Bị choáng ngợp khi thấy quá nhiều tuỳ chọn

**Tầng 2 — Technical Anxiety (Lo lắng kỹ thuật):**
- Không biết ảnh của mình có đủ chất lượng in không
- Không hiểu DPI, CMYK là gì
- Sợ ảnh bị méo, bị mờ khi in ra

**Tầng 3 — Trust Deficit (Thiếu niềm tin):**
- Không thấy được sản phẩm thật trông như thế nào
- Lo lắng về việc dữ liệu cá nhân (ảnh gia đình) được bảo mật
- Không chắc tiền cọc có được bảo vệ không

### Conversion Flow Analysis

```
AWARENESS → INTENT → CONSIDERATION → DECISION → ACTION → RETENTION
   ↓           ↓           ↓             ↓          ↓         ↓
Landing     Template    Template       Editor    Checkout   Dashboard
Page        Browse      Preview        Complete  Complete   Reorder

Drop-off    Drop-off    DROP-OFF       DROP-OFF  Drop-off   Target
risk: Low   risk: Med   risk: HIGH     risk:     risk: Med  for upsell
                        (Decision      CRITICAL
                        fatigue)       (friction)
```

> **Critical Insight:** Điểm rơi cao nhất (Drop-off) xảy ra tại **Template Preview → Editor** và **Editor → Checkout**. Chiến lược thiết kế phải tập trung triệt tiêu ma sát tại 2 điểm này.

---

## 1.2 "Minimal Editor" vs "Full Canva Editor" — Phân Tích Chiến Lược

### Tại sao Minimal Editor vượt trội cho mô hình này?

**Luận điểm 1 — The Expert Taste Transfer:**
Template designer (Admin) là chuyên gia thẩm mỹ. Layout, spacing, font pairing, màu sắc tổng thể — tất cả đã được quyết định bởi người có chuyên môn. Khi User được phép can thiệp vào những yếu tố này, họ thường làm **xấu hơn**, không đẹp hơn. Minimal Editor bảo tồn "expert taste" này.

**Luận điểm 2 — Speed-to-Completion:**

```
Full Editor Flow:          Minimal Editor Flow:
Choose template            Choose template
↓                          ↓
Arrange layout             Upload photos (bulk)
↓                          ↓
Choose fonts               Drag into frames
↓                          ↓
Pick colors                Edit text (optional)
↓                          ↓
Resize elements            Preview → Checkout
↓
Add decorations
↓
Preview → Checkout

Avg. completion: 45–90min  Avg. completion: 10–20min
Completion rate: ~35%      Completion rate: ~72%
```

**Luận điểm 3 — Print Quality Guarantee:**
Với Full Editor, user tự di chuyển elements có thể tạo ra các vấn đề in ấn (bleed area violations, object nằm ngoài safe zone). Minimal Editor đảm bảo mọi element nằm đúng vị trí print-safe.

**Luận điểm 4 — Support Cost Reduction:**
Full Editor → nhiều biến số → nhiều lỗi → nhiều yêu cầu hỗ trợ. Minimal Editor → ít biến số → ít lỗi → ít chi phí vận hành.

### Completion Rate Optimization Strategy

| Tactic | Cơ Chế | Tác Động Ước Tính |
|---|---|---|
| **Progress Indicator** | Hiển thị "Trang X/16 đã hoàn thành" luôn hiện | +15% completion |
| **Smart Prefill** | Gợi ý tự động điền ảnh từ album upload vào frame trống | +22% completion |
| **Micro-achievements** | Animation nhỏ khi hoàn thành từng trang | +8% engagement |
| **Incomplete Warning** | Cảnh báo nhẹ (không blocking) về frame chưa có ảnh | +18% quality |
| **One-click Preview** | Preview full book bất kỳ lúc nào | +12% confidence |
| **Save & Return** | Autosave + email nhắc nhở dự án dang dở sau 24h | +25% return rate |

---

## 1.3 Smart Frame Fit UX — Cơ Chế Kỹ Thuật

### Object-Fit "Cover with Center Gravity" Algorithm

```javascript
// Pseudo-code cho Smart Frame Fit
function smartFrameFit(image, frame) {
  const imageAspect = image.width / image.height;
  const frameAspect = frame.width / frame.height;

  let scale, offsetX = 0, offsetY = 0;

  if (imageAspect > frameAspect) {
    // Ảnh rộng hơn frame → fit theo chiều cao, overflow ngang
    scale = frame.height / image.height;
    offsetX = (frame.width - image.width * scale) / 2; // Center horizontally
  } else {
    // Ảnh cao hơn frame → fit theo chiều rộng, overflow dọc
    scale = frame.width / image.width;
    offsetY = (frame.height - image.height * scale) / 2; // Center vertically
  }

  return {
    scale,
    x: frame.x + offsetX,
    y: frame.y + offsetY,
    cropRegion: calculateCropRegion(image, frame, scale, offsetX, offsetY)
  };
}
```

### UX Behavior Specification

```
Khi user kéo ảnh vào frame:
1. Ảnh SNAP vào frame → visual highlight (blue glow border)
2. Hệ thống tự scale "cover" → không méo → luôn lấp đầy frame
3. Nếu ảnh bị crop → hiển thị indicator nhỏ "Nhấp đúp để điều chỉnh"
4. Double-click/tap → Crop mode: ảnh gốc mờ ngoài frame, rõ trong frame
5. Trong Crop mode: Slider zoom (0.5x → 3x) + Drag để reposition
6. Click "Xong" hoặc click ra ngoài → Confirm và exit crop mode
7. Preview tức thời trong frame sau mỗi thao tác
```

### Frame Highlight States (Trạng Thái Visual của Frame)

| State | Visual |
|---|---|
| **EMPTY** | Dashed border `#CBD5E1`, icon camera + "Thêm ảnh" |
| **DRAG-OVER** | Solid blue border `#3B82F6`, background blue tint 10% |
| **FILLED** | No border (seamless), ảnh hiển thị đầy đủ |
| **SELECTED** | Solid blue border 2px + corner handles + action buttons |
| **LOW-RES WARNING** | Orange dashed border + warning icon overlay |
| **CROP MODE** | Dark overlay ngoài frame + bright interior + handles |

---

## 1.4 Pre-flight Print Warning System

### DPI Check Architecture

```
Upload Event → Client-side Quick Check → Server-side Precise Validation
     ↓                    ↓                           ↓
File size hint    Canvas API: measure          Sharp: get metadata
(heuristic)       actual pixel dimensions      actual DPI/PPI value
                  vs frame print size
```

### DPI Calculation Logic

```javascript
// Frame có kích thước in vật lý (mm), ảnh có pixel dimensions
function calculateEffectiveDPI(imagePx, framePhysicalMM, zoomLevel = 1.0) {
  const framePxAtPrint = (framePhysicalMM / 25.4) * 300; // 300 DPI standard
  const effectiveImagePx = imagePx / zoomLevel; // Zoom in = ít pixel hơn được dùng
  const effectiveDPI = (effectiveImagePx / framePxAtPrint) * 300;
  return Math.round(effectiveDPI);
}

// Ngưỡng cảnh báo:
// < 72 DPI  → CRITICAL: "Ảnh quá nhỏ, sẽ rất mờ khi in"
// 72–149    → WARNING:  "Ảnh có thể bị mờ nhẹ"
// 150–299   → NOTICE:   "Chấp nhận được, khuyến khích dùng ảnh rõ hơn"
// ≥ 300     → GOOD:     No warning, green checkmark
```

### Visual Warning Implementation

```
LOW DPI INDICATOR (Không blocking, không làm gián đoạn flow):
┌─────────────────────────────────┐
│  [⚠️ Icon nhỏ góc phải frame]   │
│                                  │
│  ← Ảnh hiển thị bình thường →   │
│                                  │
└─────────────────────────────────┘

Hover/tap icon → Tooltip:
"Ảnh có thể bị mờ khi in. DPI hiện tại: 95.
 Khuyến nghị: ≥150 DPI. [Đổi ảnh khác]"

Tại Preview mode → Summary panel:
"⚠️ 3 ảnh có thể in mờ. Xem chi tiết →"

Tại Checkout → Confirmation step:
Checkbox bắt buộc: "Tôi đã biết một số ảnh có thể in không sắc nét"
```

---

# 2. END-TO-END USER FLOW

## 2.1 Full Journey Architecture

```
[AWARENESS]          [CONSIDERATION]        [CONVERSION]
Landing Page    →    Template Listing   →    Template Detail
     ↓                     ↓                      ↓
  SEO/Ads            Browse & Filter         Deep Preview
                                                   ↓
                                            [ENGAGEMENT]
                                            Editor Workspace
                                                   ↓
                                          Upload → Edit → Preview
                                                   ↓
                                            [TRANSACTION]
                                            Cart → Payment
                                                   ↓
                                             [RETENTION]
                                         Order Success → Dashboard
```

## 2.2 Phân Tích Chi Tiết Từng Chặng

### CHẶNG 1: Landing Page

| Dimension | Detail |
|---|---|
| **User Action** | Lướt trang, xem examples, đọc giá |
| **UX Goal** | Xây dựng desire, giảm anxiety về kết quả in ấn |
| **Key UI Elements** | Hero video/slideshow sản phẩm thật, Social proof, Preview template đẹp, CTA "Bắt đầu tạo sách" |
| **Conversion Tactics** | "Sản phẩm thật > Mockup" — luôn hiển thị ảnh chụp sách vật lý. Đặt giá ngay trang đầu để lọc qualified leads. Trust badges: "In tại Việt Nam", "Giao trong 7–10 ngày" |
| **Drop-off Risk** | Thấp |

### CHẶNG 2: Template Listing

| Dimension | Detail |
|---|---|
| **User Action** | Filter theo chủ đề (Wedding, Travel, Family, Baby), xem thumbnails |
| **UX Goal** | Rút ngắn thời gian tìm kiếm, spark excitement |
| **Key UI Elements** | Grid view 3–4 columns, Card với preview bìa + 2–3 trang nội dung, Badge "Phổ biến"/"Mới", Price visible |
| **Conversion Tactics** | Hover card → quick preview animation hiển thị 3–4 trang. Filter sticky. Không quá 3 categories để tránh paradox of choice |
| **Drop-off Risk** | Trung bình |

### CHẶNG 3: Template Detail

| Dimension | Detail |
|---|---|
| **User Action** | Xem toàn bộ 16 trang layout, đánh giá phù hợp với nội dung |
| **UX Goal** | Tạo mental visualization — user tự hình dung ảnh của họ trong template |
| **Key UI Elements** | Slideshow 16 trang full-screen capable, Thumbnail strip dọc, Mockup 3D sách mở, Nút CTA primary |
| **Conversion Tactics** | **"Thay ảnh thử" mini demo** — cho upload 1 ảnh xem thử trong template (không cần đăng nhập). Đây là conversion accelerator mạnh nhất tại step này |
| **Drop-off Risk** | Cao — cần đặc biệt chú ý |

### CHẶNG 4: Editor Workspace

| Dimension | Detail |
|---|---|
| **User Action** | Upload ảnh → kéo vào frame → edit text → review từng trang |
| **UX Goal** | Trải nghiệm fluent, không gián đoạn, không bao giờ bị lost |
| **Key UI Elements** | Canvas trung tâm, Left panel upload, Right panel text properties, Bottom page nav, Top toolbar Progress indicator |
| **Conversion Tactics** | Onboarding tooltip (3 bước, dismissable). Smart auto-fill. Never dead-end. **Completion Gate** nhẹ nhàng: "Còn 4 frame trống — muốn điền tiếp không?" |
| **Drop-off Risk** | **CRITICAL** |

### CHẶNG 5: Checkout Flow

| Dimension | Detail |
|---|---|
| **User Action** | Review final preview → xác nhận thông tin → thanh toán cọc |
| **UX Goal** | Build confidence, reduce purchase anxiety |
| **Key UI Elements** | Full book preview scrollable, Order summary sidebar, Deposit amount rõ ràng, Multiple payment options |
| **Conversion Tactics** | Hiển thị "Cọc 30% = 180,000đ". Guarantee badge "Không hài lòng hoàn tiền cọc". Estimated delivery date cụ thể |
| **Drop-off Risk** | Trung bình–Cao |

### CHẶNG 6: Order Success + Dashboard

| Dimension | Detail |
|---|---|
| **User Action** | Xác nhận đơn, theo dõi tiến trình |
| **UX Goal** | Reduce post-purchase anxiety, encourage referral |
| **Key UI Elements** | Confirmation với order number, Timeline trạng thái, Share button, CTA "Tạo thêm quyển khác" |
| **Conversion Tactics** | Referral: "Giới thiệu bạn bè → giảm 50k đơn tiếp". Order tracking real-time. Sneak peek mockup 3D |
| **Drop-off Risk** | Thấp |

---

# 3. SCREEN STRUCTURE & LAYOUT HIERARCHY

## 3.1 Complete Screen Inventory

```
PHOTOBOOK PLATFORM — SCREEN HIERARCHY
│
├── PUBLIC ZONE (No Auth Required)
│   ├── /                          → Homepage
│   ├── /templates                 → Template Categories & Listing
│   ├── /templates/[slug]          → Template Detail & Preview
│   ├── /pricing                   → Pricing Page
│   ├── /faq                       → FAQ & Support
│   └── /about                     → About / Brand Story
│
├── AUTH ZONE
│   ├── /login                     → Login
│   ├── /register                  → Register
│   └── /forgot-password           → Password Recovery
│
├── EDITOR ZONE (Auth Required)
│   ├── /editor/new/[template-id]  → New Project from Template
│   └── /editor/[project-id]       → Resume Existing Project
│
├── CHECKOUT ZONE (Auth Required)
│   ├── /checkout/[project-id]     → Checkout & Deposit Payment
│   └── /checkout/success/[order]  → Order Success Page
│
├── USER DASHBOARD
│   ├── /dashboard                 → Overview & My Projects
│   ├── /dashboard/orders          → Order History & Tracking
│   └── /dashboard/drafts          → Draft Projects
│
└── ADMIN CMS (/admin/*)
    ├── /admin/dashboard            → Analytics Overview
    ├── /admin/orders               → Orders Management
    ├── /admin/orders/[id]          → Order Detail & Approve
    ├── /admin/templates            → Templates Manager
    ├── /admin/templates/create     → Template Builder
    ├── /admin/media                → Media Asset Library
    ├── /admin/render-queue         → Render Job Status
    └── /admin/users                → User Management
```

## 3.2 Đặc Tả Chi Tiết Từng Màn Hình Chính

### SCREEN: Homepage (`/`)

```
UX Goal: Convert visitor to "Template Browser" state trong < 30 giây

Layout Structure:
┌─────────────────────────────────────────────────────┐
│ HEADER (64px): Logo | Nav | Login | "Bắt đầu" CTA   │
├─────────────────────────────────────────────────────┤
│ HERO (100vh): Video/Slideshow sản phẩm thật          │
│              Headline + Sub + "Khám phá mẫu" CTA    │
├─────────────────────────────────────────────────────┤
│ SOCIAL PROOF BAR (80px): Số lượng KH | Rating | ... │
├─────────────────────────────────────────────────────┤
│ FEATURED TEMPLATES (auto height): 4 card grid        │
├─────────────────────────────────────────────────────┤
│ HOW IT WORKS (400px): 4 step horizontal              │
├─────────────────────────────────────────────────────┤
│ TESTIMONIALS (auto): 3-col review cards              │
├─────────────────────────────────────────────────────┤
│ PRICING CTA SECTION (300px): Simple price + CTA      │
├─────────────────────────────────────────────────────┤
│ FOOTER (200px): Links | Contact | Social             │
└─────────────────────────────────────────────────────┘

Responsive:
- Desktop (≥1280px): Full layout, 4-col grid
- Tablet (768–1279px): 2-col grid, compact hero
- Mobile (<768px): 1-col, hero video → static image, sticky CTA bar
```

### SCREEN: Template Detail (`/templates/[slug]`)

```
UX Goal: Tạo emotional connection và drive "Dùng mẫu này" click

Layout Structure:
┌───────────────────────────────────────────────────────┐
│ HEADER (64px)                                          │
├────────────────────────┬──────────────────────────────┤
│ LEFT PANEL (55% width) │ RIGHT PANEL (45% width)       │
│                        │                               │
│ Template Slideshow     │ Template Name (H1)            │
│ - Current page preview │ Category Badge                │
│   (large, centered)    │ Star Rating                   │
│ - Prev/Next arrows     │                               │
│                        │ Price: 600,000đ               │
│                        │ "Cọc ngay: 180,000đ"          │
│                        │                               │
│                        │ [████ Dùng mẫu này ████] CTA  │
│                        │                               │
│                        │ ✓ 16 trang, thiết kế sẵn     │
│                        │ ✓ Chỉ cần thêm ảnh & text    │
│                        │ ✓ In 300 DPI CMYK             │
│                        │                               │
│                        │ THỬ VỚI ẢNH CỦA BẠN:         │
│                        │ [Upload 1 ảnh demo zone]      │
├────────────────────────┴──────────────────────────────┤
│ THUMBNAIL STRIP (120px): All 16 pages horizontal scroll│
├───────────────────────────────────────────────────────┤
│ RELATED TEMPLATES (auto): 4-col grid                   │
└───────────────────────────────────────────────────────┘

Responsive:
- Mobile: Slideshow full-width → Info panel below → CTA sticky bottom bar
```

### SCREEN: Editor Workspace (`/editor/[project-id]`)

```
UX Goal: Zero confusion, maximum completion rate

Layout Structure (Desktop 1440px):
┌───────────────────────────────────────────────────────┐
│ TOP TOOLBAR (56px): Logo|Project name|Undo/Redo|       │
│                     Preview|Save indicator|Submit CTA  │
├──────────┬────────────────────────────────┬───────────┤
│ LEFT     │ CANVAS WORKSPACE               │ RIGHT     │
│ SIDEBAR  │ (Flexible width, min 600px)     │ SIDEBAR   │
│ (280px)  │                                │ (260px)   │
│          │  ┌──────────────────────────┐  │           │
│ Upload   │  │   Page Canvas            │  │ Text      │
│ Panel    │  │   (Template layout)      │  │ Properties│
│          │  │   [Frame][Frame][Frame]  │  │           │
│ Photo    │  │   [Frame]    [Frame]     │  │ - Font    │
│ Library  │  │   [Text box]             │  │ - Size    │
│          │  └──────────────────────────┘  │ - Color   │
│ (Grid    │                                │ - Align   │
│ thumbs)  │  Zoom: 50% ─●─ 150%           │           │
│          │  [Fit to screen icon]          │ Frame     │
│          │                                │ Actions:  │
│          │                                │ Replace   │
│          │                                │ Crop      │
│          │                                │ Remove    │
├──────────┴────────────────────────────────┴───────────┤
│ BOTTOM PAGE NAVIGATOR (80px):                          │
│ [◀] [1][2][3][✓4][5][...][16] [▶]  "Hoàn thành: 9/16"│
└───────────────────────────────────────────────────────┘
```

### SCREEN: Admin Dashboard (`/admin/dashboard`)

```
UX Goal: Data visibility, quick action access

Layout Structure:
┌─────────────────────────────────────────────────────────┐
│ ADMIN HEADER (64px): Logo | Notifications | Profile      │
├──────────┬──────────────────────────────────────────────┤
│ LEFT NAV │ MAIN CONTENT                                  │
│ (220px)  │                                               │
│          │ KPI ROW (auto):                               │
│ Dashboard│ [Đơn mới] [Pending Render] [Doanh thu] [KH]  │
│ Orders   │                                               │
│ Templates│ CHARTS ROW:                                   │
│ Media    │ [Revenue 30d line chart] [Orders by status]   │
│ Render Q │                                               │
│ Users    │ PENDING ORDERS TABLE:                         │
│          │ ID | KH | Template | Ngày | Status | Actions  │
│          │ Quick approve button inline                    │
│          │                                               │
│          │ RENDER QUEUE STATUS:                          │
│          │ Live progress bars for active renders          │
└──────────┴──────────────────────────────────────────────┘
```

---

# 4. EDITOR UX DESIGN (DEEP DIVE)

## 4.1 Drag & Drop UX Specification

### Desktop Drag Flow — State Machine

```
[IDLE] → user grabs photo từ left panel
  ↓
[DRAGGING]
  - Photo thumbnail follows cursor (ghost image, 80% opacity)
  - All frames in current page: highlight border dashed (ready state)
  - Cursor: "grabbing"

[HOVER_OVER_FRAME]
  - Target frame: Blue fill overlay 15% + solid 2px border
  - Ghost image scales to fit frame proportionally (preview)
  - Cursor: "copy" icon

[DROP_ON_FRAME]
  - Animation: photo "snaps" into frame (200ms ease-out)
  - Smart fit applied immediately (cover + center)
  - Frame border: brief green flash → filled state (no border)
  - DPI check triggers in background

[DROP_ON_EMPTY_AREA]
  - Ghost returns to origin (elastic return animation)
  - No state change

[REPLACE_EXISTING_FRAME]
  - Old photo: fade out (150ms)
  - New photo: fade in (150ms)
  - Toast: "Đã thay ảnh"
```

### Snap-to-Frame Magnetic Effect

```javascript
const SNAP_DISTANCE = 40; // pixels

function onDragMove(e) {
  const dragPos = e.target.getAbsolutePosition();
  const frames = getPageFrames();

  frames.forEach(frame => {
    const dist = distanceTo(dragPos, frame.center);
    if (dist < SNAP_DISTANCE) {
      frame.setState('hover');
      // Magnetic pull: slightly move ghost toward frame center
      e.target.setAbsolutePosition(
        lerp(dragPos, frame.center, 0.2) // 20% pull
      );
    } else {
      frame.setState('ready');
    }
  });
}
```

---

## 4.2 Crop/Zoom UX Specification

### Crop Mode UI Layout

```
ENTERING CROP MODE:
- Double-click frame (desktop) / Long-press frame (mobile)
- Or: click frame → click "Crop" trong Right Sidebar
- Animation: Frame expands slightly (scale 1.05), dark overlay elsewhere

CROP MODE VISUAL:
┌───────────────────────────────────────────────────┐
│ [CANVAS - Crop Mode Active]                        │
│                                                    │
│  ████████████████████████  ← Frame boundary       │
│  █                       █                        │
│  █   [VISIBLE AREA]      █  ← Clear interior      │
│  █                       █                        │
│  ████████████████████████                         │
│  (rest of photo: dimmed 60%)                       │
│                                                    │
└───────────────────────────────────────────────────┘

CROP CONTROLS (bottom of screen):
┌─────────────────────────────────────────────────────┐
│  🔍 Thu nhỏ ──────●─────────── Phóng to             │
│  [0.5x]         [1.2x]         [3x]                  │
│                                                      │
│  [Căn giữa] [Reset]         [Huỷ]  [✓ Xong]         │
└─────────────────────────────────────────────────────┘

INTERACTIONS:
- Drag photo: Reposition within frame mask
- Scroll wheel: Zoom in/out
- Slider: Zoom control (discoverable for non-tech users)
- Two-finger pinch (touch): Zoom
- Keyboard Arrow keys: fine nudge (2px/press)
- Constraint: Cannot zoom out so photo doesn't cover frame
```

---

## 4.3 Text Editing UX Specification

### Inline Text Editing States

```
[DEFAULT]  → "Nhập tiêu đề của bạn..."
             Placeholder text, muted color
             Dashed border indicating editable

[HOVER]    → Subtle border highlight
             Tooltip: "Click để chỉnh sửa"

[ACTIVE]   → Solid border + cursor visible
             Character counter: "32/50"
             Right sidebar: Text properties activates

[OVERFLOW] → Character limit reached
             Red counter: "50/50"
             No more input accepted
             Toast: "Đã đạt giới hạn ký tự"
```

### Text Properties Right Sidebar

```
RIGHT SIDEBAR — TEXT PROPERTIES
┌──────────────────────────────┐
│ VĂN BẢN                      │
│                              │
│ Font chữ:                    │
│ [Playfair Display    ▾]      │
│ (Chỉ fonts đã thiết kế       │
│  sẵn cho template này)       │
│                              │
│ Cỡ chữ:                      │
│ [─────●──────] 24px          │
│  12           72             │
│                              │
│ Căn chỉnh:                   │
│ [≡] [≡] [≡] [≡]            │
│                              │
│ Màu chữ:                     │
│ ● ● ● ● ● [+Tuỳ chỉnh]     │
│ (Preset colors từ template)  │
│                              │
│ [Reset về mặc định]          │
└──────────────────────────────┘
```

> **Design Decision:** Không cho user thay font tùy ý → chỉ show fonts đã được cân chỉnh với template. Font selector có 3–5 lựa chọn phù hợp thay vì dropdown 500+ fonts như Canva.

---

## 4.4 Page Switching & Book Navigation

### Bottom Page Navigator

```
BOTTOM NAVIGATOR BAR (80px height):
┌────────────────────────────────────────────────────────────────┐
│  ◀ PREV  │ [1][2][3][✓4][✓5][6][⚠7][8]...[16]  │  NEXT ▶     │
│          │        ───────────────────────           │            │
│          │     Hoàn thành: 5/16 trang   [Preview]  │            │
└────────────────────────────────────────────────────────────────┘

Page Thumbnail States:
[Empty]      → Số trang, background light gray
[Partial]    → Số trang + small preview thumbnail
[✓ Complete] → Số trang + green checkmark + thumbnail
[⚠ Warning]  → Số trang + orange warning icon (low DPI)
[● Current]  → Blue underline/highlight

Page Transition Animation:
Slide từ phải sang trái khi Next (150ms ease-in-out)
Slide từ trái sang phải khi Prev (150ms)
KHÔNG dùng flip 3D animation — gây performance issues với Konva
```

---

## 4.5 Autosave & State Management

```
AUTOSAVE ARCHITECTURE:

User Action (bất kỳ)
    ↓
Debounce Timer (2500ms reset mỗi khi có action mới)
    ↓
[2.5s sau action cuối] → Trigger Save
    ↓
┌────────────────────────────────────────────────────┐
│ OPTIMISTIC SAVE STRATEGY:                          │
│                                                    │
│ 1. Save to localStorage IMMEDIATELY (sync)         │
│    Key: "photobook_draft_[project_id]"             │
│    Value: JSON state snapshot                      │
│                                                    │
│ 2. POST to API /api/projects/[id]/autosave (async) │
│    Payload: diff từ last saved state               │
│                                                    │
│ 3. On success: Update "Saved" indicator            │
│    On failure: Keep localStorage, retry 3x         │
└────────────────────────────────────────────────────┘

TOP TOOLBAR SAVE INDICATOR:
"● Đang lưu..."  →  "✓ Đã lưu lúc 14:32"  →  (fade out)
```

---

## 4.6 UX Anti-Patterns Cần Tránh

| Anti-Pattern | Vấn đề | Giải pháp |
|---|---|---|
| **Blocking modal mỗi action** | Ngắt flow, gây friction | Toast notifications hoặc inline feedback |
| **Confirmation khi đổi ảnh** | "Bạn có chắc?" → annoying | Cho thay trực tiếp + Undo (Ctrl+Z) |
| **Auto-zoom canvas khi chuyển trang** | Disorient user | Giữ nguyên zoom level khi navigate |
| **Loading spinner toàn màn hình** | App cảm giác bị đơ | Skeleton UI + progressive loading |
| **Toolbar collapse trên tablet** | Icons nhỏ khó tap | Toolbar expanded, icon size ≥ 44px |
| **Right-click context menu** | Non-touch unfamiliar | Floating action button khi select |
| **Số trang nhảy khi delete ảnh** | Layout jump | Smooth reflow animation |
| **Không có Undo** | User sợ thử = không dám thao tác | Undo stack tối thiểu 20 actions |

---

# 5. PREMIUM DESIGN SYSTEM SPECIFICATION

## 5.1 Typography System — "Modern Luxury Editorial"

```
PRIMARY HEADING FONT:
Font: "Playfair Display" (Google Fonts)
Style: Serif, high contrast stroke, editorial feel
Usage: H1 trang chủ, template names, hero text
Fallback: Georgia, 'Times New Roman', serif

SECONDARY/BODY FONT:
Font: "Inter" (Google Fonts)
Style: Geometric sans-serif, high legibility
Usage: Body copy, UI labels, navigation, buttons
Fallback: -apple-system, system-ui, sans-serif

ACCENT/SCRIPT FONT (dùng có chọn lọc):
Font: "Cormorant Garamond" Light Italic
Usage: Taglines, template preview text overlay
Fallback: Garamond, Georgia
```

### Type Scale (8pt Grid)

| Token | Size | Line Height | Font | Usage |
|---|---|---|---|---|
| `text-h1` | 48px | 56px | Playfair Display Bold | Hero headings |
| `text-h2` | 36px | 44px | Playfair Display SemiBold | Section titles |
| `text-h3` | 24px | 32px | Inter SemiBold | Card titles |
| `text-h4` | 20px | 28px | Inter Medium | Subsection |
| `text-body` | 16px | 24px | Inter Regular | Body copy |
| `text-sm` | 14px | 20px | Inter Regular | Secondary text |
| `text-label` | 12px | 16px | Inter Medium | Labels (uppercase +0.5px) |

---

## 5.2 Color Palette — "Warm Luxury Neutral"

```css
/* PRIMARY BACKGROUNDS */
--color-bg-primary:    #FAFAF8;  /* Warm off-white */
--color-bg-secondary:  #F5F4F0;  /* Slightly darker warm tone */
--color-bg-elevated:   #FFFFFF;  /* Cards, modals */
--color-bg-dark:       #1A1A1A;  /* Dark overlays */

/* NEUTRAL GRAYS (Warm-tinted) */
--color-gray-100: #F5F4F0;
--color-gray-200: #E8E7E3;
--color-gray-300: #D4D3CE;
--color-gray-400: #A09F99;
--color-gray-500: #6E6D66;
--color-gray-600: #4A4943;
--color-gray-700: #2E2D28;
--color-gray-800: #1A1A16;
--color-gray-900: #0F0F0C;

/* TEXT */
--color-text-primary:     #1A1A16;  /* Near black */
--color-text-secondary:   #6E6D66;  /* Muted */
--color-text-placeholder: #A09F99;
--color-text-on-dark:     #F5F4F0;

/* ACCENT — LUXURY CTAs */
--color-accent:       #C8956C;  /* Warm gold-rose */
--color-accent-hover: #B07D55;
--color-accent-light: #F0E2D6;  /* Badges, tags */

/* INTERACTIVE */
--color-interactive:    #3B82F6;
--color-interactive-bg: #EFF6FF;

/* SEMANTIC */
--color-success:    #22C55E;
--color-success-bg: #DCFCE7;
--color-warning:    #F59E0B;
--color-warning-bg: #FEF3C7;
--color-error:      #EF4444;
--color-error-bg:   #FEE2E2;
--color-info:       #3B82F6;
--color-info-bg:    #EFF6FF;
```

---

## 5.3 Spacing & Grid System

```
BASE UNIT: 4px

SPACING SCALE:
1  →  4px    Micro: icon internal
2  →  8px    XS: tight label-input gap
3  →  12px   SM: icon-text gap
4  →  16px   MD: standard padding
5  →  20px   LG: card padding
6  →  24px   XL: section internal
8  →  32px   2XL: component gaps
10 →  40px   3XL: section separators
12 →  48px   4XL: page section gaps
16 →  64px   5XL: hero sections
20 →  80px   6XL: large section gaps
24 →  96px   7XL: page-level spacing

PAGE GRID:
Desktop:  12 columns, 24px gutter, 80px margin
Tablet:   8 columns, 20px gutter, 40px margin
Mobile:   4 columns, 16px gutter, 16px margin

CONTENT MAX-WIDTH: 1440px (ultra-wide) / 1280px (standard)
EDITOR: Full screen, no max-width
```

---

## 5.4 UI Component Style Specifications

### Buttons

```css
/* PRIMARY */
.btn-primary {
  background: #C8956C;
  color: #FFFFFF;
  font: Inter SemiBold 15px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
}
.btn-primary:hover {
  background: #B07D55;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(200,149,108,0.3);
}

/* SECONDARY */
.btn-secondary {
  background: transparent;
  color: #1A1A16;
  border: 1.5px solid #D4D3CE;
}
.btn-secondary:hover {
  border-color: #A09F99;
  background: #F5F4F0;
}

/* GHOST */
.btn-ghost {
  background: transparent;
  color: #6E6D66;
  border: none;
}

/* DISABLED (all variants) */
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
```

### Cards

```css
.card-template {
  background: #FFFFFF;
  border: 1px solid #E8E7E3;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 200ms ease;
}
.card-template:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transform: translateY(-4px);
}
```

### Canvas Frame Borders (Konva)

```javascript
const FRAME_STYLES = {
  EMPTY:    { stroke: '#CBD5E1', strokeWidth: 1.5, dash: [6, 4], fill: '#F8FAFC' },
  READY:    { stroke: '#94A3B8', strokeWidth: 1.5, dash: [6, 4] },
  DRAGOVER: { stroke: '#3B82F6', strokeWidth: 2.5, fill: 'rgba(59,130,246,0.08)',
               shadowColor: '#3B82F6', shadowBlur: 12 },
  FILLED:   { stroke: null }, // seamless — image covers entirely
  SELECTED: { stroke: '#3B82F6', strokeWidth: 2 },
  LOW_RES:  { stroke: '#F59E0B', strokeWidth: 2, dash: [4, 3] }
};
```

---

# 6. VUE 3 COMPONENT TREE & ARCHITECTURE

## 6.1 Component Hierarchy Overview

```
App.vue
│
├── AppLayout.vue
│   ├── AppHeader.vue
│   ├── RouterView
│   └── AppFooter.vue (hidden in editor)
│
├── pages/
│   ├── HomePage.vue
│   ├── TemplateListPage.vue
│   ├── TemplateDetailPage.vue
│   ├── EditorPage.vue               ← CORE
│   ├── CheckoutPage.vue
│   ├── OrderSuccessPage.vue
│   └── dashboard/
│       ├── DashboardPage.vue
│       ├── OrdersPage.vue
│       └── DraftsPage.vue
│
└── editor/ (EditorPage tree)
    ├── EditorCanvas.vue             ← CORE
    │   ├── CanvasStage.vue          (Konva Stage wrapper)
    │   │   ├── PageLayer.vue        (Konva Layer)
    │   │   │   ├── ImageFrame.vue   (Konva Group)
    │   │   │   │   ├── FrameMask.vue    (Konva Rect clip)
    │   │   │   │   └── FrameImage.vue   (Konva Image)
    │   │   │   └── TextLayer.vue    (Konva Text)
    │   │   └── UILayer.vue          (selection handles)
    │   └── CanvasControls.vue       (zoom slider, fit button)
    │
    ├── LeftSidebar.vue
    │   ├── UploadPanel.vue
    │   │   ├── UploadDropZone.vue
    │   │   ├── PhotoGrid.vue
    │   │   └── PhotoGridItem.vue
    │   └── ProjectSidebar.vue
    │
    ├── RightSidebar.vue
    │   ├── FrameProperties.vue
    │   └── TextProperties.vue
    │
    ├── TopToolbar.vue
    │   ├── ProjectTitle.vue
    │   ├── HistoryControls.vue      (Undo/Redo)
    │   ├── SaveIndicator.vue
    │   ├── PreviewButton.vue
    │   └── SubmitButton.vue
    │
    ├── PageNavigator.vue
    │   ├── PageThumb.vue (×16)
    │   └── CompletionIndicator.vue
    │
    └── overlays/
        ├── FullscreenPreviewModal.vue
        ├── OnboardingTooltip.vue
        └── DpiWarningToast.vue
```

---

## 6.2 Core Component Specifications

### `EditorCanvas.vue`

```typescript
// RESPONSIBILITY:
// Orchestrates entire canvas editing experience.
// Bridges Pinia store state ↔ Konva rendering.
// Handles all canvas-level events.

interface Props {
  projectId: string
  currentPageIndex: number  // 0–15
}

interface State {
  stageScale: number                  // 0.5–2.0, default auto-fit
  stagePosition: { x: number, y: number }
  isDragOver: boolean
  selectedElement: SelectedElement | null
  cropModeActive: boolean
  cropTargetFrameId: string | null
}

// Events Emitted:
// @frame-click(frameId: string)
// @frame-drop(frameId: string, photoId: string)
// @text-click(textId: string)
// @canvas-click-empty()

// PERFORMANCE NOTES:
// - Konva Stage: pixelRatio = Math.min(window.devicePixelRatio, 2)
// - Layer separation: PageLayer (content) vs UILayer (handles)
//   → UI updates không trigger full content re-render
// - Batch Konva updates: layer.batchDraw() thay vì stage.draw()
// - watchEffect → Konva: wrap trong nextTick
```

### `ImageFrame.vue`

```typescript
// RESPONSIBILITY:
// Renders single image frame (clipping mask + photo).
// Handles all visual states. Executes smart-fit.

interface Props {
  frame: FrameDefinition
  photo: PhotoState | null
  isSelected: boolean
  isDragOver: boolean
  isInCropMode: boolean
  dpiStatus: 'good' | 'warning' | 'critical' | null
}

interface FrameDefinition {
  id: string
  x: number; y: number
  width: number; height: number
  shape: 'rect' | 'circle' | 'rounded-rect'
  cornerRadius?: number
  printSizeMM: { width: number; height: number }
}

// Events: @click, @dblclick, @dragover-enter, @dragover-leave, @drop

// PERFORMANCE:
// - Composable: usePhotoLoader(url) → LRU cache (max 50 images)
// - Clipping: dùng Konva Group clipFunc (tốt hơn Rect mask)
// - shallowRef cho frame definition
```

### `UploadPanel.vue`

```typescript
// RESPONSIBILITY:
// Photo upload flow + photo library display.

interface State {
  uploadQueue: UploadQueueItem[]
  photos: Photo[]
  isUploading: boolean
  draggedPhoto: Photo | null
}

// KEY BEHAVIORS:
// 1. Bulk upload nhiều files cùng lúc
// 2. Client-side validation trước upload:
//    - Format: JPG, PNG, HEIC
//    - Min size: 500KB heuristic
//    - Max size: 50MB/file
// 3. Progressive display: hiển thị từng ảnh khi upload xong
// 4. HEIC conversion: client-side với heic2any

// PERFORMANCE:
// - Thumbnail: createObjectURL + canvas resize → 200×200px cho display
// - Virtual scroll khi > 50 photos: @vueuse/core useVirtualList
```

### `TextLayer.vue`

```typescript
// EDITING MECHANISM:
// Konva Text không native support HTML editing.
// Pattern khi user click text:
//   1. Hide Konva Text node (visible: false)
//   2. Show absolute <textarea> HTML element
//      (positioned bằng Konva getClientRect())
//   3. textarea styling match Konva text rendering
//   4. onBlur/Enter → update store → show Konva Text lại

interface TextDefinition {
  id: string
  x: number; y: number
  width: number; height: number
  maxChars: number             // e.g., 50
  defaultText: string
  allowedFonts: string[]       // 3–5 options
  defaultFont: string
  defaultFontSize: number
  defaultColor: string
  textAlign: 'left' | 'center' | 'right'
  isEditable: boolean
}

// PERFORMANCE:
// - Font preload: FontFace API / document.fonts.ready
// - Text wrapping: tính khi content thay đổi, cache kết quả
```

---

## 6.3 Pinia Store Architecture

```typescript
// stores/editor.ts

interface EditorStore {
  // PROJECT META
  projectId: string
  templateId: string
  projectName: string
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error'

  // PAGE STATE (16 pages)
  pages: Page[]
  currentPageIndex: number

  // PHOTO LIBRARY
  uploadedPhotos: Photo[]

  // UI STATE
  selectedElement: SelectedElement | null
  cropMode: CropModeState | null
  isPreviewOpen: boolean

  // HISTORY (Undo/Redo)
  history: HistoryEntry[]
  historyIndex: number
}

interface Page {
  index: number
  frames: FrameState[]
  texts: TextState[]
}

interface FrameState {
  frameId: string
  photoId: string | null
  cropData: CropData | null  // { x, y, scale }
}

interface TextState {
  textId: string
  content: string
  fontFamily: string
  fontSize: number
  color: string
  textAlign: string
}

// KEY ACTIONS:
// assignPhoto(frameId, photoId)
// removePhoto(frameId)
// updateCrop(frameId, cropData)
// updateText(textId, content)
// updateTextStyle(textId, stylePartial)
// navigatePage(index)
// undo() / redo()
// triggerAutosave()  ← debounced watcher
```

---

# 7. CROSS-PLATFORM RESPONSIVE STRATEGY

## 7.1 Platform Strategy Decision

> **Kết luận: Desktop-First với Progressive Mobile Enhancement**

```
RATIONALE:
Editor workspace cần:
1. Minimum 600px canvas width cho usable design surface
2. Simultaneous left + right sidebar panels
3. Precise drag operations (harder on touch)
4. Multi-panel layout

Mobile optimization: Thay đổi INTERACTION MODEL hoàn toàn,
không chỉ là responsive scaling.

TRAFFIC SPLIT DỰ ĐOÁN:
Desktop: 55%  → Full editor experience
Tablet:  25%  → Adapted editor
Mobile:  20%  → Simplified editor + CTA desktop
```

## 7.2 Breakpoint System

| Breakpoint | Range | Editor Behavior |
|---|---|---|
| `xs` | < 480px | Mobile portrait |
| `sm` | 480–767px | Mobile landscape |
| `md` | 768–1023px | Tablet portrait — Collapsible sidebar |
| `lg` | 1024–1279px | Tablet landscape — Full 3-panel |
| `xl` | 1280–1535px | Standard desktop |
| `2xl` | ≥ 1536px | Large desktop |

### Editor Breakpoint Behaviors

```
≥1024px (Desktop/Tablet-L):
  Full layout: LeftSidebar + Canvas + RightSidebar

768–1023px (Tablet-P / iPad):
  LeftSidebar: Collapsible → icon-only mode (60px)
  RightSidebar: Bottom sheet hoặc right drawer
  Canvas: Takes full remaining width

<768px (Mobile):
  DIFFERENT UX MODEL entirely (see section 7.4)
```

---

## 7.3 Tablet Optimization (iPad Focus)

```
TABLET EDITOR LAYOUT (768–1023px):
┌────────────────────────────────────────────────────────┐
│ TOP TOOLBAR (56px) — compressed, icon-only secondary   │
├────┬───────────────────────────────────────────────────┤
│[←] │ CANVAS WORKSPACE (full flex width)                │
│    │                                                    │
│Icon│  Page at 85–90% zoom                              │
│Side│  Touch drag supported                             │
│bar │                                                    │
│60px│  [Selected frame] → FAB (bottom-right):           │
│    │  [📷 Đổi ảnh] [✂️ Crop] [🗑️ Xoá]                  │
├────┴───────────────────────────────────────────────────┤
│ BOTTOM SHEET (collapsed 60px, expandable):              │
│ ──── Kéo lên để xem thuộc tính ─────                   │
├────────────────────────────────────────────────────────┤
│ PAGE NAVIGATOR (80px)                                   │
└────────────────────────────────────────────────────────┘

ICON SIDEBAR (60px collapsed):
[📁] Photos  [📝] Text  [👁] Preview  [🔃] History
Tap icon → overlay panel slides from left (240px)
```

---

## 7.4 Mobile Strategy — Tap-to-Select Flow

```
MOBILE EDITOR FLOW (replaces drag-drop hoàn toàn):

STEP 1 — VIEW PAGE:
┌──────────────────────┐
│ [←] Trang 3/16 [→]   │
├──────────────────────┤
│                      │
│  Page thumbnail      │
│  Frames highlighted  │
│  with status icons   │
│                      │
└──────────────────────┘
│ [Thêm ảnh] [Xem tất cả] │

STEP 2 — TAP EMPTY FRAME → Bottom sheet:
┌──────────────────────┐
│ ⬆ Chọn ảnh cho khung │
├──────────────────────┤
│ [📷 Chụp ảnh mới]    │
│ [🖼 Từ thư viện]      │
│ [📁 Ảnh đã tải lên]  │
└──────────────────────┘

STEP 3 — SELECT PHOTO:
→ Photo library opens (full screen)
→ User selects photo
→ System auto-inserts into selected frame
→ Return to page view
→ Toast: "Đã thêm ảnh vào trang 3"
```

### Mobile Onboarding Banner

```
IF user opens editor on mobile (<768px):
┌──────────────────────────────────────────────────┐
│ 💡 Để thiết kế tốt nhất, dùng máy tính/tablet.   │
│    Hoặc tiếp tục trên điện thoại.                 │
│    [Gửi link về máy tính]  [Tiếp tục]             │
└──────────────────────────────────────────────────┘
"Gửi link" → Input email → Send magic link to current project
```

---

# 8. TEXT-BASED WIREFRAME DESCRIPTION

## 8.1 Editor Workspace — Full Wireframe (1440×900px)

```
═══════════════════════════════════════════════════════════════════
TOP TOOLBAR [Full Width × 56px · fixed · z-index: 100]
┌──────────────────────────────────────────────────────────────────┐
│ [Logo 24px] [│] [📓 "Đám cưới Minh & Lan" ✏️] [│]               │
│ [↩ Undo] [↪ Redo]  [│]  [● Đã lưu lúc 14:32]                   │
│                                [👁 Xem trước]  [✓ Hoàn thành]   │
└──────────────────────────────────────────────────────────────────┘

MAIN AREA [Full Width × calc(100vh - 56px - 80px) · display:flex]
┌──────────────────────────────────────────────────────────────────┐
│ LEFT SIDEBAR    CANVAS WORKSPACE         RIGHT SIDEBAR            │
│ [280px fixed]   [flex:1, min:600px]      [260px fixed]            │
│ ┌────────────┐  ┌────────────────────┐  ┌────────────────┐       │
│ │ UPLOAD TAB │  │                    │  │ (idle state)   │       │
│ │ ────────── │  │  ┌──────────────┐  │  │ Click frame    │       │
│ │ Drop Zone  │  │  │              │  │  │ để xem thuộc  │       │
│ │ [Dashed 2px│  │  │  Page Canvas │  │  │ tính           │       │
│ │  h:120px]  │  │  │              │  │  │                │       │
│ │ ────────── │  │  │  [Frame 1]   │  │  │ ──────────     │       │
│ │ PHOTO GRID │  │  │  [Frame 2]   │  │  │ (frame sel)    │       │
│ │ 4 cols     │  │  │  [Frame 3]   │  │  │ [📷 Đổi ảnh]  │       │
│ │ 56px thumb │  │  │  [Text box]  │  │  │ [✂️ Crop/Zoom] │       │
│ │            │  │  │              │  │  │ [🗑 Xoá ảnh]  │       │
│ │ [Photo 1]  │  │  └──────────────┘  │  │                │       │
│ │ [Photo 2]  │  │                    │  │ ──────────     │       │
│ │ [Photo 3]  │  │  Zoom:[50%─●─150%] │  │ (text sel)     │       │
│ │ [Photo 4]  │  │  [Vừa màn hình 🔲] │  │ Font: [▾]      │       │
│ │ ...scroll  │  │                    │  │ Size: [──●──]  │       │
│ └────────────┘  └────────────────────┘  │ Align:[≡≡≡≡]  │       │
│                                          │ Color:[● ● ●] │       │
│                                          └────────────────┘       │
└──────────────────────────────────────────────────────────────────┘

BOTTOM PAGE NAVIGATOR [Full Width × 80px · fixed · bottom:0]
┌──────────────────────────────────────────────────────────────────┐
│ [◀]  [1][2][3][✓4][✓5][✓6][⚠7][8][9]...[16]           [▶]      │
│                ──────────────────────────────                     │
│      Hoàn thành: 6/16 trang  ████████░░░░░░░░░░  37%            │
└──────────────────────────────────────────────────────────────────┘

CANVAS METRICS:
- Standard page: 210×297mm (A4) hoặc 200×200mm (square)
- Auto-fit: scaled to fit with 32px padding
- Canvas background: #E5E7EB (distinct from page white)
- Page shadow: 0 4px 24px rgba(0,0,0,0.15)
═══════════════════════════════════════════════════════════════════
```

---

## 8.2 Full Preview Modal — Wireframe

```
═══════════════════════════════════════════════════════════════════
FULLSCREEN PREVIEW [100vw × 100vh · fixed · z-index:200]
Background: rgba(15,15,12,0.96)

TOP BAR [Full Width × 64px]
┌──────────────────────────────────────────────────────────────────┐
│      "Xem trước toàn bộ sách"        [✕ Đóng]  [✓ Đặt hàng]    │
└──────────────────────────────────────────────────────────────────┘

WARNINGS BANNER (if any, slide-down):
"⚠️ 2 ảnh có chất lượng thấp có thể in mờ. [Xem]  [Bỏ qua]"

MAIN PREVIEW [Full Width × calc(100vh - 64px - 100px)]
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [◀]   ┌─────────────────┐┌─────────────────┐   [▶]            │
│        │                 ││                 │                   │
│        │   Left Page     ││   Right Page    │                   │
│        │   (Page 2)      ││   (Page 3)      │                   │
│        │                 ││                 │                   │
│        └─────────────────┘└─────────────────┘                   │
│                    Pages 2–3 of 16                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

THUMBNAIL STRIP [Full Width × 100px]
┌──────────────────────────────────────────────────────────────────┐
│  [Cover][1-2][3-4][5-6][7-8][9-10][11-12][13-14][15-16][Back]   │
│          ↑ current spread: white border highlight                 │
└──────────────────────────────────────────────────────────────────┘

INTERACTIONS:
- Click arrow / keyboard ← → : change spread
- Click thumbnail: jump to spread
- Esc: close modal
- Scroll wheel: navigate spreads
═══════════════════════════════════════════════════════════════════
```

---

## 8.3 Template Detail Page — Wireframe

```
═══════════════════════════════════════════════════════════════════
TEMPLATE DETAIL [1440px Desktop]

HEADER [64px]
BREADCRUMB [40px · padding: 0 80px]
Home > Templates > Wedding > "Eternal Love"

MAIN CONTENT [padding:40px 80px · grid: 55% + 45%]
┌────────────────────────────────┬─────────────────────────────────┐
│ LEFT (55%)                     │ RIGHT (45%)                     │
│                                │                                 │
│ ┌──────────────────────────┐   │ BADGE: "Wedding" "Phổ biến"    │
│ │                          │   │                                 │
│ │    MAIN PREVIEW          │   │ H1: "Eternal Love" (48px PD)   │
│ │    ~500px × 375px        │   │                                 │
│ │                          │   │ ★★★★☆ 4.8 (127 đánh giá)     │
│ │ [◀ Trước]    [Sau ▶]     │   │                                 │
│ └──────────────────────────┘   │ ─────────────────────────────   │
│                                │ Giá: 620,000đ                   │
│ THUMBNAIL STRIP (64px):        │ "Cọc hôm nay: 186,000đ"        │
│ [p1][p2][p3]...[p16] scroll    │                                 │
│ active: outlined white border  │ [████ Dùng mẫu này ████]       │
│                                │ (Primary CTA · full width)      │
│                                │                                 │
│                                │ [👁 Xem 3D mockup]             │
│                                │                                 │
│                                │ ✓ 16 trang thiết kế sẵn       │
│                                │ ✓ Chỉ cần upload ảnh & text    │
│                                │ ✓ In CMYK 300 DPI              │
│                                │ ✓ Giao hàng 7–10 ngày          │
│                                │                                 │
│                                │ ─────────────────────────────   │
│                                │ THỬ VỚI ẢNH CỦA BẠN:          │
│                                │ ┌──────────────────────┐       │
│                                │ │ Drop/click để thêm   │       │
│                                │ │ ảnh xem thử          │       │
│                                │ └──────────────────────┘       │
└────────────────────────────────┴─────────────────────────────────┘

BELOW FOLD:
─ RELATED TEMPLATES [4-col grid of template cards] ─
═══════════════════════════════════════════════════════════════════
```

---

# 9. INTERMEDIATE AI UI GENERATION PLAN

## 9.1 AI Tool Capability Matrix

| Tool | Best For | Avoid Using For |
|---|---|---|
| **Figma AI** | Auto-layout từ text, component variants, design token application | Logic/code, complex interactions |
| **v0.dev** (Vercel) | React component code từ screenshot, Shadcn/Tailwind components | Vue 3 code, state management |
| **Lovable** | Full Vue/React app skeleton, multi-page prototype, auth flow boilerplate | Production code, custom Canvas work |
| **Claude** (Sonnet/Opus) | Architecture decisions, Vue 3 + Konva.js integration, store design, code review | Pixel-perfect UI, visual design |
| **Cursor IDE** | Implementing specific files, autocomplete in context, refactoring, test generation | High-level design, architecture |
| **ChatGPT-4o** | Quick UI mockup ideas, brainstorming UX copy, marketing copy | Accurate Vue/Konva code |

---

## 9.2 Recommended AI Workflow — Phase by Phase

### PHASE 1: Visual Design Foundation (Tuần 1–2)

```
STEP 1: Design System in Figma
Tool: Figma (manual) + Figma AI assist
Input: Design System Spec từ Section 5
Output:
  - Color styles, Text styles, Spacing tokens
  - Button, Card, Input, Badge components
  - Icon set (Phosphor Icons hoặc Lucide)

STEP 2: Key Screen Wireframes → Mockups
Tool: Figma (manual)
Input: Wireframes từ Section 8
Output:
  - Homepage mockup
  - Template Detail mockup
  - Editor Workspace mockup (desktop + mobile)
  - Admin Dashboard mockup
```

### PHASE 2: Frontend Prototype (Tuần 2–5)

```
STEP 3: Convert Mockups → Vue Components
Tool: Lovable (tốt hơn v0 cho Vue 3)
Prompt: "Create a Vue 3 + Tailwind template listing page
based on this wireframe: [paste Section 8 wireframe]"

NOTE: v0.dev luôn gen React → cần manual convert sang Vue 3.
Lovable hỗ trợ Vue 3 native tốt hơn.

STEP 4: Editor Core (Konva.js)
Tool: Claude Opus + Cursor
  a. Claude: Architecture + component skeletons
     "Design complete Konva.js Stage architecture for
      photobook editor with frame-based image placement.
      Vue 3 Composition API. Pinia store."
  b. Cursor: Implement details, autocomplete, refactor

STEP 5: Integration
Tool: Cursor (primary)
  - Wire components → Pinia store
  - API calls → Laravel endpoints
  - Autosave, history, DPI check
```

### PHASE 3: Production Polish (Tuần 6–8)

```
STEP 6: Performance Optimization
Tool: Claude + Chrome DevTools
  - Canvas rendering performance audit
  - Image loading optimization
  - Bundle size analysis

STEP 7: Admin CMS
Tool: Lovable (scaffold) + Cursor (customize)
  - Lovable tốt cho table-based admin UIs

STEP 8: PDF Render Engine
Tool: Claude (architecture) + Cursor (implementation)
  - Node.js + Sharp + PDFKit pipeline
  - CMYK conversion strategy
  - BullMQ queue system
```

### Critical AI Prompt Templates

```
FOR CLAUDE — Editor Architecture:
"You are a senior Vue 3 + Konva.js developer.
Building a photobook editor where:
- Templates define fixed image frames (x, y, width, height)
- Users can only assign photos to frames and edit text
- No free-form element creation
- Canvas state managed by Pinia
Create complete component architecture and Pinia store.
Include: ImageFrame.vue, TextLayer.vue, UploadPanel.vue.
Focus on: performance with large images, smooth drag-drop,
clipping mask in Konva."

FOR Lovable/v0 — UI Components:
"Create responsive template card component in Vue 3 + Tailwind.
Shows: cover image (4:3 ratio), title, category badge,
price in VND format, star rating, hover shadow effect.
Colors: background #FAFAF8, accent #C8956C."
```

---

# 10. MVP COMPASS & DEVELOPMENT ROADMAP

## 10.1 MVP Feature Matrix

| Feature | MVP? | Phase | Reasoning |
|---|---|---|---|
| Homepage (static) | ✅ | 1 | Needed for launch |
| Template Listing page | ✅ | 1 | Core browse flow |
| Template Detail page | ✅ | 1 | Pre-purchase decision |
| User Register/Login | ✅ | 1 | Required for editor/orders |
| Editor — Image frames drag/drop | ✅ | 1 | Core value prop |
| Editor — Text editing | ✅ | 1 | Core value prop |
| Editor — Page navigation (16 pages) | ✅ | 1 | Core functionality |
| Editor — DPI warning | ✅ | 1 | Print quality protection |
| Editor — Full preview modal | ✅ | 1 | Pre-purchase confidence |
| Autosave (localStorage) | ✅ | 1 | Data loss prevention |
| Checkout + Deposit payment | ✅ | 1 | Revenue critical |
| Order success page | ✅ | 1 | Purchase confirmation |
| Admin — Order management | ✅ | 1 | Operations required |
| Admin — Render queue trigger | ✅ | 1 | Fulfillment required |
| PDF render pipeline (Node.js) | ✅ | 1 | Physical product delivery |
| Autosave (API/server-side) | 🔜 | 2 | Enhance reliability |
| User Dashboard | 🔜 | 2 | Retention feature |
| Order tracking page | 🔜 | 2 | Customer service reduction |
| Admin Template Builder | 🔜 | 2 | Content scaling |
| HEIC image conversion | 🔜 | 2 | iPhone user support |
| Mobile tap-to-select editor | 🔜 | 2 | Mobile audience |
| Email notification system | 🔜 | 2 | Operations |
| Referral system | 🔜 | 3 | Growth feature |
| "Try with your photo" on detail | 🔜 | 3 | Conversion optimization |
| Coupon/discount system | 🔜 | 3 | Marketing |
| Multiple photobook sizes | 🔜 | 3 | Product expansion |
| Animation page transitions | ❌ | Never | Performance cost > benefit |
| Free-form element placement | ❌ | Never | Against business model |
| PDF export for users | ❌ | Never | Security constraint |
| Full Canva-like editor | ❌ | Never | Against strategy |

---

## 10.2 Development Roadmap — Sprint Detail

### SPRINT 0: Foundation (Tuần 1–2)

```
□ Project setup: Vue 3 + Vite + Tailwind + Pinia + Vue Router
□ Laravel API skeleton + database schema
□ MinIO/S3 bucket setup + upload endpoint
□ Design tokens: CSS variables + Tailwind config
□ Component library: Button, Card, Badge, Modal, Toast, Input
□ Auth flow: Register, Login, JWT/Sanctum
□ Basic routing structure
□ CI/CD pipeline (GitHub Actions → staging)
```

**Database Schema Priority (Sprint 0):**

```sql
users               -- id, name, email, password, role
templates           -- id, name, slug, category, config JSON, status, price
template_pages      -- id, template_id, page_index, frame_config JSON
projects            -- id, user_id, template_id, name, status, data JSON, last_saved_at
orders              -- id, project_id, user_id, amount, deposit, status, paid_at
media               -- id, user_id, project_id, filename, url, width, height, file_size, dpi
render_jobs         -- id, order_id, status, started_at, completed_at, output_path, error_log
```

### SPRINT 1: Public Flow (Tuần 3–4)

```
□ Homepage (static content + featured templates)
□ Template Listing page (browse + filter by category)
□ Template Detail page (slideshow + info + CTA)
□ 3 templates seeded in DB (Wedding, Travel, Family)
□ Template JSON config structure defined
□ Auth pages (Login, Register, Forgot Password)
```

### SPRINT 2: Editor Core (Tuần 5–7) — CRITICAL SPRINT

```
□ EditorPage layout (3-panel + toolbar + bottom nav)
□ Konva Stage setup + page rendering from template config
□ ImageFrame: empty state, hover, filled, DPI states
□ Photo upload (left sidebar, drag-to-panel, file validation)
□ Drag-drop photo to frame + Smart Frame Fit algorithm
□ Frame selection + Right sidebar frame properties
□ TextLayer: empty, hover, editing states
□ Text properties panel (limited font/size/color)
□ Crop/Zoom mode (double-click → crop UI → confirm)
□ Page Navigator (16 pages, completion states)
□ Undo/Redo history stack (min 20 steps)
□ Autosave to localStorage (debounce 2.5s)
□ DPI warning system (client-side calculation)
```

### SPRINT 3: Preview + Checkout (Tuần 8–9)

```
□ Fullscreen Preview Modal (all 16 pages, two-page spread)
□ Completion gate (soft warning before checkout)
□ Checkout page (order summary + deposit)
□ Payment integration (VNPay / MoMo)
□ Order success page
□ Basic user dashboard (list projects/orders)
```

### SPRINT 4: Admin + Render (Tuần 10–12)

```
□ Admin layout + role-based auth middleware
□ Admin Order management (list, view, approve)
□ Node.js render service scaffold
□ BullMQ job queue setup
□ Sharp: composite images onto page template background
□ PDFKit: assemble pages into CMYK PDF
□ Admin: trigger render + secure PDF download
□ Admin: Template manager (CRUD + JSON config editor)
```

### SPRINT 5: Polish + Launch (Tuần 13–14)

```
□ Performance audit (Lighthouse + Canvas profiling)
□ Mobile responsiveness testing + fixes
□ Error state handling (network errors, upload failures)
□ Empty state designs (no projects, no templates)
□ Loading skeleton screens
□ SEO meta tags + OG images
□ Legal pages (Privacy, Terms)
□ Staging QA + bug fixes
□ Production deployment
□ Monitoring setup (Sentry, GA4)
```

---

## 10.3 Sitemap v1.0

```
SITEMAP v1.0 — PHOTOBOOK PLATFORM

PUBLIC
/                              Homepage
/templates                     Template Catalog
  /templates/wedding           Category filter
  /templates/travel            Category filter
  /templates/family            Category filter
  /templates/[slug]            Template Detail
/pricing                       Pricing
/faq                           FAQ
/about                         Brand Story

AUTH
/login                         Login
/register                      Register
/forgot-password               Password Reset
/reset-password/[token]        Set New Password

APP (Auth required)
/editor/new/[template-id]      Create New Project
/editor/[project-id]           Resume Project
/checkout/[project-id]         Payment
/checkout/success/[order-id]   Confirmation
/dashboard                     My Projects
/dashboard/orders              Order History
/dashboard/drafts              Drafts

ADMIN (Admin role required)
/admin/dashboard               Analytics
/admin/orders                  Order Management
/admin/orders/[id]             Order Detail
/admin/templates               Templates
/admin/templates/create        New Template
/admin/templates/[id]/edit     Edit Template
/admin/media                   Asset Library
/admin/render-queue            Render Monitor
/admin/users                   User Management
```

---

## 10.4 Architecture Decision Records (ADRs)

| ADR | Decision | Reasoning |
|---|---|---|
| **ADR-001** | Vue 3 Composition API (không Options API) | Better TypeScript, better tree-shaking, composables pattern |
| **ADR-002** | Konva.js (không Fabric.js, không native Canvas) | Better Vue integration, built-in layer system, active maintenance |
| **ADR-003** | Pinia (không Vuex) | Vue 3 official, simpler syntax, better DevTools |
| **ADR-004** | TailwindCSS (không CSS-in-JS) | Rapid prototyping, consistent spacing, purge in production |
| **ADR-005** | Desktop-first, progressive mobile | Canvas editing requires screen real estate |
| **ADR-006** | No user PDF export | Protect print assets, ensure Admin quality control |
| **ADR-007** | Dual autosave: localStorage + API | localStorage = instant offline; API = cross-device backup |
| **ADR-008** | Node.js render service (không PHP/Laravel) | Sharp + PDFKit native Node.js; independent scaling |
| **ADR-009** | BullMQ for render queue (không sync processing) | Render jobs are heavy (30s–2min); non-blocking essential |
| **ADR-010** | Template config as JSON in DB (không hardcode) | Admin can modify templates without code deployment |

---

## 10.5 Pre-Code Launch Checklist

### Design ✓
- [ ] Figma file tạo với Design System tokens
- [ ] Desktop wireframes: Homepage, Template Detail, Editor, Preview Modal, Checkout
- [ ] Mobile wireframes: Editor tap-to-select flow
- [ ] Component inventory approved
- [ ] Color palette WCAG AA compliance checked

### Technical ✓
- [ ] Template JSON schema designed và documented
- [ ] API endpoint contract (OpenAPI/Swagger) defined
- [ ] Database schema reviewed
- [ ] MinIO/S3 bucket policy + CDN configured
- [ ] Environment variables documented (.env.example)

### Business ✓
- [ ] Minimum 3 templates designed và exported (Wedding, Family, Travel)
- [ ] Payment gateway account setup (VNPay/MoMo)
- [ ] Print specs confirmed với printing partner (CMYK profiles, bleed, safe zones)
- [ ] Legal: Terms of Service + Privacy Policy drafted

### DevOps ✓
- [ ] Domain + SSL configured
- [ ] Staging environment deployed
- [ ] Error monitoring (Sentry) configured
- [ ] Analytics (GA4 hoặc Plausible) configured
- [ ] Backup strategy for user uploads confirmed
- [ ] CDN for static assets configured

---

> ## 🧭 Next Steps After This Document
> 
> **Immediate (Sprint 0 starts now):**
> 1. Init Vue 3 + Vite project
> 2. Setup Laravel API + Database schema (see Section 10.2 Sprint 0)
> 3. Define Template JSON config schema
> 4. Configure TailwindCSS với design tokens từ Section 5
> 5. Setup MinIO/S3 + upload endpoint
>
> **This document is the Single Source of Truth for:**
> - Designer → Figma wireframes chi tiết
> - Frontend Dev → Vue 3 project structure  
> - Backend Dev → Laravel API + database schema
> - AI Codegen (Claude/Cursor/Lovable) → enough context for accurate generation

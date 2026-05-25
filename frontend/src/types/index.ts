// ============================================================
// PHOTOBOOK PLATFORM — Core TypeScript Types
// ============================================================

// ── User & Auth ───────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
  avatar_url: string | null
  created_at: string
}

// ── Template System ───────────────────────────────────────────

/** A frame slot where user can place a photo */
export interface FrameDefinition {
  id: string
  x: number              // position on page canvas (px)
  y: number
  width: number
  height: number
  shape: 'rect' | 'circle' | 'rounded-rect'
  cornerRadius?: number
  /** Physical print size in millimeters */
  printSizeMM: {
    width: number
    height: number
  }
  /** Whether this frame is required (blocks submit if empty) */
  required: boolean
  /** Order for tab/keyboard navigation */
  tabIndex: number
}

/** A text layer where user can edit content */
export interface TextDefinition {
  id: string
  x: number
  y: number
  width: number
  height: number
  maxChars: number
  defaultText: string
  /** Only these fonts are available to the user */
  allowedFonts: string[]
  defaultFont: string
  defaultFontSize: number
  /** Preset colors for this text (from template design system) */
  allowedColors: string[]
  defaultColor: string
  textAlign: 'left' | 'center' | 'right'
  fontWeight: 'normal' | 'bold'
  /** If false, this text is decorative and NOT editable by user */
  isEditable: boolean
}

/** A single page config within a template */
export interface TemplatePageConfig {
  pageIndex: number          // 0 = cover, 1–14 = inner, 15 = back
  /** Page physical size in mm */
  pageSizeMM: { width: number; height: number }
  /** Canvas pixel dimensions for editor rendering */
  canvasSize: { width: number; height: number }
  /** Background color or image URL */
  background: string
  frames: FrameDefinition[]
  texts: TextDefinition[]
  /** Optional decorative overlay image (cannot be moved/removed) */
  decorativeOverlay?: string
}

/** Full template definition — matches API snake_case response */
export interface Template {
  id: number
  name: string
  slug: string
  category: TemplateCategory
  description: string | null
  cover_image_url: string | null
  preview_images: string[]        // Preview of all 16 pages
  pages?: TemplatePageConfig[]    // Included only on detail view
  price: number                   // VND
  deposit_percent: number         // e.g., 30 = 30%
  is_popular: boolean
  is_new: boolean
  rating: number
  review_count: number
  page_count: number              // Always 16
  status?: 'active' | 'draft' | 'archived'
}

export type TemplateCategory = 'wedding' | 'travel' | 'family' | 'baby' | 'graduation' | 'other'

// ── Project & Editor State ────────────────────────────────────

export interface CropData {
  x: number          // photo offset within frame
  y: number
  scale: number      // 1.0 = original, > 1 = zoomed in
}

/** State of a single frame slot (user's customization) */
export interface FrameState {
  frameId: string
  photoId: string | null
  cropData: CropData
}

/** State of a single text slot (user's customization) */
export interface TextState {
  textId: string
  content: string
  fontFamily: string
  fontSize: number
  color: string
  textAlign: 'left' | 'center' | 'right'
  fontWeight: 'normal' | 'bold'
}

/** State of a single page (combination of frame + text states) */
export interface PageState {
  pageIndex: number
  frames: FrameState[]
  texts: TextState[]
}

/** Completion status of a page */
export interface PageCompletionStatus {
  pageIndex: number
  totalFrames: number
  filledFrames: number
  requiredFrames: number
  filledRequiredFrames: number
  hasLowDpiWarnings: boolean
  isComplete: boolean
}

/** Full project data */
export interface Project {
  id: string
  userId: number
  templateId: number
  name: string
  status: ProjectStatus
  pages: PageState[]
  lastSavedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = 'draft' | 'submitted' | 'approved' | 'rendering' | 'completed' | 'cancelled'

// ── Photo / Media ─────────────────────────────────────────────

export interface Photo {
  id: string
  userId: number
  projectId: string
  originalFilename: string
  url: string             // Full URL (CDN or MinIO)
  thumbnailUrl: string    // 200x200 thumbnail
  width: number           // original pixel dimensions
  height: number
  fileSize: number        // bytes
  mimeType: string
  uploadedAt: string
  /** DPI metadata if extracted server-side */
  detectedDpi?: number
}

export type DpiStatus = 'good' | 'warning' | 'critical' | 'unknown'

export interface DpiCheckResult {
  status: DpiStatus
  effectiveDpi: number
  framePhysicalMM: { width: number; height: number }
  imagePixels: { width: number; height: number }
  zoomLevel: number
  message: string
}

// ── Orders ────────────────────────────────────────────────────

export interface Order {
  id: string
  projectId: string
  userId: number
  templateName: string
  status: OrderStatus
  totalAmount: number      // VND
  depositAmount: number    // VND
  depositPaidAt: string | null
  finalPaidAt: string | null
  paymentMethod: string | null
  shippingAddress: ShippingAddress | null
  notes: string | null
  renderJobId: string | null
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | 'pending_payment'
  | 'deposit_paid'
  | 'admin_reviewing'
  | 'approved'
  | 'rendering'
  | 'render_complete'
  | 'printing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  ward: string
  district: string
  province: string
}

// ── UI State ──────────────────────────────────────────────────

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number      // ms, 0 = persistent
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

/** The currently selected element in the editor */
export interface SelectedElement {
  type: 'frame' | 'text'
  id: string
  pageIndex: number
}

export interface CropModeState {
  frameId: string
  pageIndex: number
}

// ── API Responses ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ValidationErrors {
  [field: string]: string[]
}

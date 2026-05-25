<?php

namespace Database\Seeders;

use App\Models\Template;
use App\Models\TemplatePage;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    // ── Canvas / physical dimensions ──────────────────────────────
    // Square 200×200 mm → canvas 800×800 px (scale 4px/mm)
    private const SQ_MM     = ['width' => 200, 'height' => 200];
    private const SQ_CANVAS = ['width' => 800, 'height' => 800];

    // Landscape 260×200 mm → canvas 1040×800 px
    private const LS_MM     = ['width' => 260, 'height' => 200];
    private const LS_CANVAS = ['width' => 1040, 'height' => 800];

    // ── Colors ────────────────────────────────────────────────────
    private const BG_WHITE  = '#FFFFFF';
    private const BG_CREAM  = '#FDF8F4';
    private const BG_SLATE  = '#F4F4F0';
    private const BG_DARK   = '#1A1A1A';

    // ── Font palettes ─────────────────────────────────────────────
    private const FONTS_ELEGANT  = ['Playfair Display', 'Cormorant Garamond', 'Inter'];
    private const FONTS_MODERN   = ['Inter', 'Montserrat', 'Open Sans'];
    private const FONTS_WARM     = ['Playfair Display', 'Inter', 'Lato'];
    private const COLORS_WARM    = ['#3D2B1F', '#C8956C', '#FFFFFF', '#9B8070'];
    private const COLORS_NEUTRAL = ['#1A1A1A', '#666666', '#FFFFFF', '#C8956C'];

    // ═════════════════════════════════════════════════════════════
    public function run(): void
    {
        $this->createWeddingTemplate();
        $this->createTravelTemplate();
        $this->createFamilyTemplate();

        $this->command->info('  ✓ 3 templates seeded (Wedding, Travel, Family)');
    }

    // ─────────────────────────────────────────────────────────────
    // TEMPLATE 1: WEDDING — "Ánh Hồng"
    // ─────────────────────────────────────────────────────────────
    private function createWeddingTemplate(): void
    {
        $template = Template::firstOrCreate(
            ['slug' => 'dam-cuoi-anh-hong'],
            [
                'name'           => 'Đám Cưới — Ánh Hồng',
                'category'       => 'wedding',
                'description'    => 'Thiết kế sang trọng với tông màu hồng ngà, phù hợp cho album cưới cổ điển. Khung ảnh cân đối, chữ viết thanh lịch ghi lại từng khoảnh khắc đặc biệt.',
                'price'          => 450000,
                'deposit_percent'=> 30,
                'is_popular'     => true,
                'is_new'         => false,
                'rating'         => '4.9',
                'review_count'   => 128,
                'status'         => 'active',
            ]
        );

        // Only seed pages if not already present
        if ($template->pages()->count() === 16) {
            return;
        }
        $template->pages()->delete();

        $pages = [];
        for ($i = 0; $i < 16; $i++) {
            $pages[] = $this->buildWeddingPage($i);
        }

        foreach ($pages as $pageData) {
            $template->pages()->create($pageData);
        }
    }

    private function buildWeddingPage(int $i): array
    {
        $base = [
            'page_index'  => $i,
            'page_size_mm'=> self::SQ_MM,
            'canvas_size' => self::SQ_CANVAS,
        ];

        return match ($i) {
            // ── Cover ────────────────────────────────────────────
            0 => array_merge($base, [
                'background' => self::BG_CREAM,
                'frames' => [
                    $this->frame('cover-hero', 40, 40, 720, 560, true, 1, 180, 140),
                ],
                'texts' => [
                    $this->text('cover-title', 40, 620, 720, 80,
                        'TÊN CÔ DÂU & CHÚ RỂ', 'Playfair Display', 32, 'center',
                        '#3D2B1F', self::FONTS_ELEGANT, self::COLORS_WARM, 60),
                    $this->text('cover-date', 40, 710, 720, 40,
                        'Ngày tháng năm cưới', 'Cormorant Garamond', 16, 'center',
                        '#9B8070', self::FONTS_ELEGANT, self::COLORS_WARM, 40),
                ],
            ]),

            // ── Inner pages (1–14) ──────────────────────────────
            1, 6, 11 => array_merge($base, [
                // Layout: Single full frame
                'background' => self::BG_WHITE,
                'frames' => [
                    $this->frame("p{$i}-full", 40, 40, 720, 720, true, 1, 180, 180),
                ],
                'texts' => [],
            ]),

            2, 7, 12 => array_merge($base, [
                // Layout: Hero top + caption bottom
                'background' => self::BG_CREAM,
                'frames' => [
                    $this->frame("p{$i}-hero", 40, 40, 720, 560, true, 1, 180, 140),
                ],
                'texts' => [
                    $this->text("p{$i}-caption", 40, 620, 720, 60,
                        'Lời chú thích của bạn...', 'Cormorant Garamond', 15, 'center',
                        '#9B8070', self::FONTS_ELEGANT, self::COLORS_WARM, 80, true),
                ],
            ]),

            3, 8, 13 => array_merge($base, [
                // Layout: 2 columns
                'background' => self::BG_WHITE,
                'frames' => [
                    $this->frame("p{$i}-left",  40, 40, 340, 720, true, 1, 85, 180),
                    $this->frame("p{$i}-right", 420, 40, 340, 720, true, 2, 85, 180),
                ],
                'texts' => [],
            ]),

            4, 9 => array_merge($base, [
                // Layout: Mosaic 3 (1 large left + 2 stacked right)
                'background' => self::BG_CREAM,
                'frames' => [
                    $this->frame("p{$i}-main",   40, 40, 440, 720, true, 1, 110, 180),
                    $this->frame("p{$i}-top-r",  520, 40, 240, 340, true, 2, 60, 85),
                    $this->frame("p{$i}-bot-r",  520, 420, 240, 340, false, 3, 60, 85),
                ],
                'texts' => [],
            ]),

            5, 10 => array_merge($base, [
                // Layout: 4 equal quadrants
                'background' => self::BG_WHITE,
                'frames' => [
                    $this->frame("p{$i}-tl", 40, 40, 340, 340, true, 1, 85, 85),
                    $this->frame("p{$i}-tr", 420, 40, 340, 340, true, 2, 85, 85),
                    $this->frame("p{$i}-bl", 40, 420, 340, 340, false, 3, 85, 85),
                    $this->frame("p{$i}-br", 420, 420, 340, 340, false, 4, 85, 85),
                ],
                'texts' => [],
            ]),

            14 => array_merge($base, [
                // Layout: Closing page — hero + message
                'background' => self::BG_CREAM,
                'frames' => [
                    $this->frame('p14-hero', 40, 40, 720, 460, true, 1, 180, 115),
                ],
                'texts' => [
                    $this->text('p14-message', 40, 520, 720, 100,
                        'Lời nhắn nhủ đến nhau...', 'Cormorant Garamond', 18, 'center',
                        '#3D2B1F', self::FONTS_ELEGANT, self::COLORS_WARM, 200, true),
                    $this->text('p14-names', 40, 640, 720, 40,
                        '— Tên Cô Dâu & Chú Rể —', 'Playfair Display', 14, 'center',
                        '#C8956C', self::FONTS_ELEGANT, self::COLORS_WARM, 60),
                ],
            ]),

            // ── Back Cover ───────────────────────────────────────
            15 => array_merge($base, [
                'background' => self::BG_DARK,
                'frames' => [
                    $this->frame('back-thumb', 300, 280, 200, 200, false, 1, 50, 50, 'circle'),
                ],
                'texts' => [
                    $this->text('back-brand', 40, 560, 720, 40,
                        'PHOTOBOOK — KỶ NIỆM MÃI MÃI', 'Inter', 12, 'center',
                        '#9B8070', self::FONTS_MODERN, ['#9B8070', '#FFFFFF'], 50),
                ],
            ]),

            default => array_merge($base, [
                'background' => self::BG_WHITE,
                'frames' => [
                    $this->frame("p{$i}-single", 80, 80, 640, 640, true, 1, 160, 160),
                ],
                'texts' => [],
            ]),
        };
    }

    // ─────────────────────────────────────────────────────────────
    // TEMPLATE 2: TRAVEL — "Hành Trình"
    // ─────────────────────────────────────────────────────────────
    private function createTravelTemplate(): void
    {
        $template = Template::firstOrCreate(
            ['slug' => 'du-lich-hanh-trinh'],
            [
                'name'           => 'Du Lịch — Hành Trình',
                'category'       => 'travel',
                'description'    => 'Thiết kế phong cách, tôn vinh ảnh phong cảnh và chân dung. Khung ảnh wide landscape, font hiện đại, hoàn hảo để lưu giữ những chuyến đi đáng nhớ.',
                'price'          => 420000,
                'deposit_percent'=> 30,
                'is_popular'     => true,
                'is_new'         => true,
                'rating'         => '4.8',
                'review_count'   => 95,
                'status'         => 'active',
            ]
        );

        if ($template->pages()->count() === 16) {
            return;
        }
        $template->pages()->delete();

        for ($i = 0; $i < 16; $i++) {
            $template->pages()->create($this->buildTravelPage($i));
        }
    }

    private function buildTravelPage(int $i): array
    {
        // Landscape canvas 1040×800
        $base = [
            'page_index'   => $i,
            'page_size_mm' => self::LS_MM,
            'canvas_size'  => self::LS_CANVAS,
        ];

        return match ($i) {
            // ── Cover ────────────────────────────────────────────
            0 => array_merge($base, [
                'background' => self::BG_DARK,
                'frames' => [
                    $this->frame('cover-full', 0, 0, 1040, 800, true, 1, 260, 200),
                ],
                'texts' => [
                    $this->text('cover-title', 60, 280, 920, 100,
                        'TÊN CHUYẾN ĐI', 'Montserrat', 48, 'center',
                        '#FFFFFF', self::FONTS_MODERN, self::COLORS_NEUTRAL, 40, false, 700),
                    $this->text('cover-subtitle', 60, 390, 920, 50,
                        'Địa điểm • Tháng & Năm', 'Inter', 18, 'center',
                        '#C8956C', self::FONTS_MODERN, self::COLORS_NEUTRAL, 60),
                ],
            ]),

            // ── Full bleed ───────────────────────────────────────
            1, 5, 9, 13 => array_merge($base, [
                'background' => self::BG_DARK,
                'frames' => [
                    $this->frame("p{$i}-full", 0, 0, 1040, 800, true, 1, 260, 200),
                ],
                'texts' => [],
            ]),

            // ── Wide + caption ───────────────────────────────────
            2, 6, 10 => array_merge($base, [
                'background' => self::BG_SLATE,
                'frames' => [
                    $this->frame("p{$i}-wide", 40, 40, 960, 580, true, 1, 240, 145),
                ],
                'texts' => [
                    $this->text("p{$i}-loc", 40, 650, 480, 80,
                        '📍 Địa điểm', 'Inter', 16, 'left',
                        '#666666', self::FONTS_MODERN, self::COLORS_NEUTRAL, 40),
                    $this->text("p{$i}-note", 520, 650, 480, 80,
                        'Ghi chú hành trình...', 'Inter', 14, 'right',
                        '#666666', self::FONTS_MODERN, self::COLORS_NEUTRAL, 100, true),
                ],
            ]),

            // ── 2 wide side by side ──────────────────────────────
            3, 7, 11 => array_merge($base, [
                'background' => self::BG_WHITE,
                'frames' => [
                    $this->frame("p{$i}-left",  40, 40, 480, 720, true, 1, 120, 180),
                    $this->frame("p{$i}-right", 560, 40, 440, 720, true, 2, 110, 180),
                ],
                'texts' => [],
            ]),

            // ── Strip 3 ──────────────────────────────────────────
            4, 8, 12 => array_merge($base, [
                'background' => self::BG_SLATE,
                'frames' => [
                    $this->frame("p{$i}-a", 40, 40, 300, 720, true, 1, 75, 180),
                    $this->frame("p{$i}-b", 380, 40, 300, 720, true, 2, 75, 180),
                    $this->frame("p{$i}-c", 720, 40, 280, 720, false, 3, 70, 180),
                ],
                'texts' => [],
            ]),

            // ── Closing page ─────────────────────────────────────
            14 => array_merge($base, [
                'background' => self::BG_DARK,
                'frames' => [
                    $this->frame('p14-main', 40, 40, 600, 720, true, 1, 150, 180),
                ],
                'texts' => [
                    $this->text('p14-quote', 680, 160, 320, 200,
                        '"Đi để trở về với những ký ức đẹp nhất."',
                        'Cormorant Garamond', 20, 'center',
                        '#FFFFFF', self::FONTS_ELEGANT, ['#FFFFFF', '#C8956C'], 120, true, 300),
                    $this->text('p14-by', 680, 400, 320, 40,
                        '— Tên của bạn —', 'Inter', 13, 'center',
                        '#C8956C', self::FONTS_MODERN, self::COLORS_NEUTRAL, 40),
                ],
            ]),

            // ── Back Cover ───────────────────────────────────────
            15 => array_merge($base, [
                'background' => self::BG_DARK,
                'frames' => [
                    $this->frame('back-thumb', 420, 280, 200, 200, false, 1, 50, 50, 'rounded'),
                ],
                'texts' => [
                    $this->text('back-brand', 40, 600, 960, 40,
                        'PHOTOBOOK — HÀNH TRÌNH CỦA BẠN', 'Inter', 12, 'center',
                        '#666666', self::FONTS_MODERN, ['#666666', '#FFFFFF'], 50),
                ],
            ]),

            default => array_merge($base, [
                'background' => self::BG_SLATE,
                'frames' => [
                    $this->frame("p{$i}-main", 40, 40, 960, 720, true, 1, 240, 180),
                ],
                'texts' => [],
            ]),
        };
    }

    // ─────────────────────────────────────────────────────────────
    // TEMPLATE 3: FAMILY — "Ký Ức Gia Đình"
    // ─────────────────────────────────────────────────────────────
    private function createFamilyTemplate(): void
    {
        $template = Template::firstOrCreate(
            ['slug' => 'gia-dinh-ky-uc'],
            [
                'name'           => 'Gia Đình — Ký Ức',
                'category'       => 'family',
                'description'    => 'Thiết kế ấm áp, nhẹ nhàng cho album gia đình. Nhiều khung ảnh kích thước khác nhau giúp kể câu chuyện phong phú, với không gian cho lời ghi chú yêu thương.',
                'price'          => 390000,
                'deposit_percent'=> 30,
                'is_popular'     => false,
                'is_new'         => true,
                'rating'         => '4.7',
                'review_count'   => 63,
                'status'         => 'active',
            ]
        );

        if ($template->pages()->count() === 16) {
            return;
        }
        $template->pages()->delete();

        for ($i = 0; $i < 16; $i++) {
            $template->pages()->create($this->buildFamilyPage($i));
        }
    }

    private function buildFamilyPage(int $i): array
    {
        $base = [
            'page_index'   => $i,
            'page_size_mm' => self::SQ_MM,
            'canvas_size'  => self::SQ_CANVAS,
        ];

        return match ($i) {
            // ── Cover ────────────────────────────────────────────
            0 => array_merge($base, [
                'background' => '#FFF9F0',
                'frames' => [
                    $this->frame('cover-main', 100, 80, 600, 480, true, 1, 150, 120, 'rounded', 16),
                ],
                'texts' => [
                    $this->text('cover-family', 40, 580, 720, 70,
                        'GIA ĐÌNH NGUYỄN', 'Playfair Display', 28, 'center',
                        '#3D2B1F', self::FONTS_WARM, self::COLORS_WARM, 40),
                    $this->text('cover-year', 40, 660, 720, 40,
                        'Album gia đình · 2025', 'Inter', 14, 'center',
                        '#C8956C', self::FONTS_WARM, self::COLORS_WARM, 30),
                ],
            ]),

            // ── Single large ─────────────────────────────────────
            1, 8 => array_merge($base, [
                'background' => self::BG_CREAM,
                'frames' => [
                    $this->frame("p{$i}-large", 60, 60, 680, 600, true, 1, 170, 150, 'rounded', 8),
                ],
                'texts' => [
                    $this->text("p{$i}-caption", 60, 680, 680, 60,
                        'Lời ghi chú của bạn...', 'Playfair Display', 15, 'center',
                        '#9B8070', self::FONTS_WARM, self::COLORS_WARM, 80, true),
                ],
            ]),

            // ── Two portrait ─────────────────────────────────────
            2, 6, 10 => array_merge($base, [
                'background' => self::BG_WHITE,
                'frames' => [
                    $this->frame("p{$i}-l", 40, 60, 330, 500, true, 1, 82, 125, 'rounded', 8),
                    $this->frame("p{$i}-r", 430, 60, 330, 500, true, 2, 82, 125, 'rounded', 8),
                ],
                'texts' => [
                    $this->text("p{$i}-cap", 40, 590, 720, 60,
                        'Khoảnh khắc bên nhau...', 'Cormorant Garamond', 16, 'center',
                        '#9B8070', self::FONTS_WARM, self::COLORS_WARM, 80, true),
                ],
            ]),

            // ── Mosaic 3 ─────────────────────────────────────────
            3, 7, 11 => array_merge($base, [
                'background' => '#FFF9F0',
                'frames' => [
                    $this->frame("p{$i}-big",  40, 40, 440, 440, true, 1, 110, 110, 'rounded', 8),
                    $this->frame("p{$i}-s1",  520, 40, 240, 200, true, 2, 60, 50, 'rounded', 8),
                    $this->frame("p{$i}-s2",  520, 280, 240, 200, false, 3, 60, 50, 'rounded', 8),
                ],
                'texts' => [
                    $this->text("p{$i}-note", 40, 510, 720, 60,
                        'Ghi lại khoảnh khắc...', 'Inter', 14, 'left',
                        '#9B8070', self::FONTS_WARM, self::COLORS_WARM, 80, true),
                ],
            ]),

            // ── Strip 4 small ────────────────────────────────────
            4, 9, 12 => array_merge($base, [
                'background' => self::BG_WHITE,
                'frames' => [
                    $this->frame("p{$i}-tl", 40, 40, 330, 330, true, 1, 82, 82),
                    $this->frame("p{$i}-tr", 430, 40, 330, 330, true, 2, 82, 82),
                    $this->frame("p{$i}-bl", 40, 420, 330, 270, false, 3, 82, 67),
                    $this->frame("p{$i}-br", 430, 420, 330, 270, false, 4, 82, 67),
                ],
                'texts' => [],
            ]),

            // ── Highlight page ───────────────────────────────────
            5, 13 => array_merge($base, [
                'background' => self::BG_CREAM,
                'frames' => [
                    $this->frame("p{$i}-center", 160, 80, 480, 480, true, 1, 120, 120, 'circle'),
                ],
                'texts' => [
                    $this->text("p{$i}-label", 40, 590, 720, 60,
                        'Người thân yêu nhất', 'Playfair Display', 20, 'center',
                        '#3D2B1F', self::FONTS_WARM, self::COLORS_WARM, 30),
                    $this->text("p{$i}-sub", 40, 660, 720, 50,
                        'Lời ghi chú...', 'Cormorant Garamond', 15, 'center',
                        '#9B8070', self::FONTS_WARM, self::COLORS_WARM, 80, true),
                ],
            ]),

            // ── Closing ──────────────────────────────────────────
            14 => array_merge($base, [
                'background' => '#FFF9F0',
                'frames' => [
                    $this->frame('p14-photo', 200, 60, 400, 360, true, 1, 100, 90, 'rounded', 12),
                ],
                'texts' => [
                    $this->text('p14-heading', 40, 450, 720, 60,
                        'Cảm ơn vì những kỷ niệm đẹp', 'Playfair Display', 20, 'center',
                        '#3D2B1F', self::FONTS_WARM, self::COLORS_WARM, 50),
                    $this->text('p14-message', 40, 530, 720, 120,
                        'Mỗi trang sách là một khoảnh khắc không thể quên...',
                        'Cormorant Garamond', 16, 'center',
                        '#9B8070', self::FONTS_WARM, self::COLORS_WARM, 200, true),
                ],
            ]),

            // ── Back Cover ───────────────────────────────────────
            15 => array_merge($base, [
                'background' => '#3D2B1F',
                'frames' => [
                    $this->frame('back-heart', 310, 260, 180, 180, false, 1, 45, 45, 'circle'),
                ],
                'texts' => [
                    $this->text('back-brand', 40, 560, 720, 40,
                        'PHOTOBOOK — GIA ĐÌNH LÀ TẤT CẢ', 'Inter', 11, 'center',
                        '#C8956C', self::FONTS_MODERN, ['#C8956C', '#FFFFFF'], 50),
                ],
            ]),

            default => array_merge($base, [
                'background' => self::BG_CREAM,
                'frames' => [
                    $this->frame("p{$i}-single", 80, 80, 640, 640, true, 1, 160, 160),
                ],
                'texts' => [],
            ]),
        };
    }

    // ═════════════════════════════════════════════════════════════
    // Builder helpers
    // ═════════════════════════════════════════════════════════════

    /**
     * Build a FrameDefinition array.
     *
     * @param  string  $id            unique within page
     * @param  int     $x, $y, $w, $h canvas pixels
     * @param  bool    $required      must be filled before submit
     * @param  int     $tabIndex      keyboard navigation order
     * @param  int     $mmW, $mmH     physical print size in mm
     * @param  string  $shape         rectangle|circle|rounded
     * @param  int     $cornerRadius  px, used when shape=rounded
     */
    private function frame(
        string $id,
        int    $x, int $y,
        int    $w, int $h,
        bool   $required,
        int    $tabIndex,
        int    $mmW,  int $mmH,
        string $shape = 'rectangle',
        int    $cornerRadius = 0
    ): array {
        return [
            'id'            => $id,
            'x'             => $x,
            'y'             => $y,
            'width'         => $w,
            'height'        => $h,
            'shape'         => $shape,
            'cornerRadius'  => $cornerRadius,
            'printSizeMM'   => ['width' => $mmW, 'height' => $mmH],
            'required'      => $required,
            'tabIndex'      => $tabIndex,
        ];
    }

    /**
     * Build a TextDefinition array.
     *
     * @param  string   $id
     * @param  int      $x, $y, $w, $h   canvas pixels
     * @param  string   $placeholder
     * @param  string   $fontFamily
     * @param  int      $fontSize         pixels
     * @param  string   $align            left|center|right
     * @param  string   $color            hex
     * @param  string[] $allowedFonts
     * @param  string[] $allowedColors
     * @param  int      $maxChars
     * @param  bool     $isEditable
     * @param  int      $fontWeight
     */
    private function text(
        string $id,
        int    $x, int $y,
        int    $w, int $h,
        string $placeholder,
        string $fontFamily,
        int    $fontSize,
        string $align,
        string $color,
        array  $allowedFonts,
        array  $allowedColors,
        int    $maxChars  = 100,
        bool   $isEditable = true,
        int    $fontWeight = 400
    ): array {
        return [
            'id'            => $id,
            'x'             => $x,
            'y'             => $y,
            'width'         => $w,
            'height'        => $h,
            'placeholder'   => $placeholder,
            'defaultValue'  => '',
            'fontFamily'    => $fontFamily,
            'fontSize'      => $fontSize,
            'fontWeight'    => $fontWeight,
            'fontStyle'     => 'normal',
            'align'         => $align,
            'color'         => $color,
            'allowedFonts'  => $allowedFonts,
            'allowedColors' => $allowedColors,
            'maxChars'      => $maxChars,
            'isEditable'    => $isEditable,
        ];
    }
}

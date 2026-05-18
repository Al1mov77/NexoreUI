# NexoreUI — Аудит компонентов

> Аудит проведён 2026-05-11 — проверены все 28 компонентов на localhost:3000

## ❌ Сломанные
- **Нет критических поломок** — все компоненты рендерятся

## ⚠️ Кривые / Требуют улучшения
- **Skeleton**: рендерится, но слишком минимальный — нет shimmer-анимации, просто серый блок с `animate-pulse`. Выглядит скучно.
- **Progress**: работает, но полностью чёрная полоса на белом — нет градиента, нет анимации при заполнении, нет цветового feedback (warning/success)
- **Slider**: работает, но визуально бедный — нет цветовых вариантов, нет отображения текущего значения
- **Special Cards**: только 2 варианта (Glass, Hover) — мало для "special" категории
- **Special Toggles**: switches выглядят одинаково серо, нет визуального отличия между вариантами
- **GlassButton**: на светлой теме почти невидимый (белый на белом фоне)
- **GlowButton**: `rgba(var(--color-primary), 0.15)` не работает корректно — CSS custom properties уже HEX, а не RGB канали
- **Typography**: нет showcase в sidebar (не попадёт в меню при скролле), `RevealText` нет `key` для перерендера
- **Sidebar navigation**: нет группировки компонентов по категориям (Base, Special, Mega, Pro) — всё в одном списке
- **Нет мобильной навигации**: sidebar скрыт на мобильных, нет бургер-меню

## 💡 Идеи для новых компонентов
- **Marquee** — бегущая строка (для логотипов, отзывов)
- **NumberTicker** — счётчик с анимацией (для статистики)
- **TextRevealByWord** — побуквенное появление текста при скролле
- **Spotlight Card** — карточка с прожектором, следующим за курсором
- **Animated Gradient Border** — рамка с анимированным градиентом
- **Dock** — macOS-стиль dock меню с магнитным эффектом
- **Particles Background** — фон с частицами
- **Typing Animation** — эффект печатной машинки
- **Animated Counter** — счётчик, анимирующийся при появлении в viewport
- **Magnetic Button (улучшенный)** — кнопка, притягивающаяся к курсору

## ✅ Хорошие
- **Installation** — документация чётко написана
- **Button** — все варианты работают, анимации хорошие
- **Special Buttons** — Glow, Shiny, Gradient, Glass — все отлично
- **Card** — стандарт + Mega Cards (Profile, Weather, Event) работают отлично
- **Input** — все 8+ вариантов рендерятся хорошо
- **Special Inputs** — Search, Password, Gradient focus — отлично
- **Alert** — стандарт + Mega Alerts (Cyber, Neon) работают
- **Special Alerts** — Glass, Gradient, Dismissible — отлично
- **Data Display** — Kbd, StatCard, Timeline рендерятся хорошо
- **Navigation** — Breadcrumb, Pagination, Steps + Navbars — отлично
- **Tabs** — работает корректно
- **Accordion** — Simple, Plus, Neon — все работают, анимация smooth
- **Modal** — Basic, Glass, Danger — открываются и закрываются
- **Tooltip** — Simple, Rich — работают
- **Checkbox** — Simple, Interactive Card — работают
- **Switch** — Simple, Neon — работают
- **Select** — dropdown функциональный
- **Toast** — уведомления появляются корректно
- **Special Badges** — Glow, Glass, Pulsing, Status — все хорошие
- **Loaders & Skeletons** — Dots, Ring, Card — анимации отличные
- **Special Modals** — Glass, Alert, Success, Command Palette — отлично
- **Special Avatars** — все 8+ вариантов работают

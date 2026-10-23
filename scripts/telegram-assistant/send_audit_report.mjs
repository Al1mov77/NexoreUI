import { notify } from "./notify.mjs";

const report = `📊 *АУДИТ ШАБЛОНОВ NEXOREUI PRO*

🟢 *ГОТОВЫ К РЕЛИЗУ В PRO (0% слопа, аудит пройден):*
1. *Psyche Obsidian* — музей фотоники (Gloock + Inter, Bone & Ink)
2. *Aura Nocturne* — парфюмерия (Instrument Serif, Terracotta Clay)
3. *Aura Obsidian* — фито-липиды (Newsreader, Moss & Cream)
4. *Velvet Gelato* — крио-джелато (Young Serif, Citrus Cream)
5. *Zenith Elixir* — манифест эликсира (Geist Mono, Zinc Monochrome)
6. *Levitas Cryo* — лукбук (Inter Tight, Glacier Mono)
7. *Nex Users Table* — FLIP-таблица для дашбордов (чистый zinc)
8. *Nex Portfolio* — минималистичный индекс с превью
9. *Aerovoid Obsidian* — эталонная тех-парка (quality standard)

🔴 *КРИТИЧЕСКИЙ СЛОП (Срочно переписать с нуля):*
1. *Vantr Particle* — летающие 3D-частицы, сетка и HUD (полный запрет по anti-slop). Нужно снести частицы и сделать строгий grid.
2. *AI Chat Interface* — фиолетовые glow, градиентные кнопки, "New AI" бейджи. Нужна переработка в чистый bento/mono.

🟡 *ТРЕБУЮТ ПЕРЕРАБОТКИ ПО IDENTITY LEDGER:*
1. *Lamborghini & Ferrari Nocturne* — чистка от старого 3D/видео-вайбкода, перевод на шрифты Syne/Big Shoulders.
2. *Chrono X & Aura Sound* — устаревший скраббинг, перевод в каталожный строгий швейцарский стиль.
3. *Nex Core Admin & Nex Store & Nex Auth* — старый дефолтный UI, нет выраженного характера.
4. *Monolith Cacao, Amarena Royale, Rose Nocturne, Vapor Obsidian, Stayline* — ждут своей очереди по реестру.`;

notify(report).then(() => {
  console.log("Audit sent to Telegram successfully.");
  process.exit(0);
});

const fs = require('fs');
let code = fs.readFileSync('apps/docs/app/page.tsx', 'utf-8');

// 1. Add to imports
const proImports = `import { 
  LoginFormPro, RegisterFormPro, PaymentFormPro, ProfileSettingsForm, SubscriptionForm, ContactFormPro, AdvancedSearchForm, FileUploadForm, FeedbackForm, InviteUsersForm,
  ProductGallery, AddToCartBar, CartDrawerItem, OrderSummaryCard, PromoCodeInput, ShippingAddressForm, ProductReview, ColorSelector, SizeSelector, CategoryCard,
  ChatBubbleUser, ChatBubbleAI, AIPromptInput, ThinkingLoader, ModelSelector, GeneratedCodeBlock, ChatHistorySidebar, AIFeatureCard, SuggestionChips, VoiceInputPulse,
  DataTablePro, InvoiceTable, UserDirectoryTable, TransactionHistory, FileExplorerTable, LeaderboardTable, ProductInventoryTable, ScheduleTable, PricingComparisonTable, CompactDataList,
  DashboardShell, StatWidgetCard, ActivityFeed, ProgressWidget, QuickActionsWidget, TaskChecklist, StorageWidget, RevenueChartWidget, RecentUsersWidget, ServerStatusWidget,
  MegaMenuVisual, CommandPaletteVisual, AppTopbar, MobileDrawerNav, TreeNavigation, ContextActionBar, PaginationPro, FilterBar, LanguageSelector, UserMenuDropdown,
  ConfettiSuccess, ActionToast, MultiStepProgress, SkeletonList, EmptyStatePro, TooltipForm, OfflineBanner, RateLimitAlert, PasswordStrengthMeter, UploadProgress,
  WaitlistForm, PricingToggle, FeatureShowcase, TrustBanner, ComparisonTableMock, AnimatedHeroText, StatCounter, NewsletterSignup, VideoModalVisual, GradientCTABlock,
  ContactList, NotificationList, TimelineVertical, StepList, FAQAccordionList, FileDownloadList, MessageList, JobBoardList, EventScheduleList, RecentCommentsList,
  SplitScreenLayout, AuthenticationLayout, SidebarLayout, DashboardGridLayout, BentoGridVisual, KanbanBoardVisual, ChatLayoutVisual, FeedLayout, DocumentationLayout, HeaderFooterLayout
} from "nexoreui"`;

code = code.replace('import { \n  NeonButton', proImports + '\nimport { \n  NeonButton');

// 2. Add to MvpComponents array
if (!code.includes('{ name: "Pro Pack (100+)", id: "pro-pack" }')) {
  code = code.replace(
    'const MvpComponents = [',
    'const MvpComponents = [\n    { name: "Pro Pack (100+)", id: "pro-pack" },'
  );
}

// 3. Add showcase section
const proSection = `
              {/* Pro Pack Showcase */}
              <div id="pro-pack" className={\`scroll-mt-20 \${activeTab === "pro-pack" ? "block" : "hidden"}\`}>
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold tracking-tight text-primary">Pro Pack (100 New Functional Components)</h3>
                  <p className="text-sm text-muted-foreground">A premium collection of 100 complex, highly-functional UI components designed for production apps. Not just for beauty — built for real use cases.</p>
                </div>
                
                <div className="space-y-16 mt-8">
                  {/* Category: Pro Layouts */}
                  <div>
                    <h4 className="font-bold text-xl mb-6 border-b pb-2">1. Application Layouts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Dashboard Layout</p><DashboardGridLayout /></div>
                      <div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Kanban Board</p><KanbanBoardVisual /></div>
                      <div className="space-y-2 md:col-span-2"><p className="text-sm font-medium text-muted-foreground">Split Screen Authentication</p><SplitScreenLayout /></div>
                    </div>
                  </div>

                  {/* Category: Pro Forms */}
                  <div>
                    <h4 className="font-bold text-xl mb-6 border-b pb-2">2. Advanced Forms</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      <LoginFormPro />
                      <PaymentFormPro />
                      <div className="space-y-6">
                        <ProfileSettingsForm />
                        <FileUploadForm />
                      </div>
                    </div>
                  </div>

                  {/* Category: AI Components */}
                  <div>
                    <h4 className="font-bold text-xl mb-6 border-b pb-2">3. Artificial Intelligence UI</h4>
                    <div className="bg-muted/10 border rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center gap-4 mb-6"><ModelSelector /><SuggestionChips /></div>
                        <ChatBubbleUser message="Write a function to fetch user data" />
                        <ThinkingLoader />
                        <ChatBubbleAI message="Here is the function you requested:" />
                        <GeneratedCodeBlock />
                        <div className="mt-8"><AIPromptInput /></div>
                      </div>
                      <div className="flex flex-col gap-6 items-center justify-center border-l border-dashed border-muted-foreground/30 pl-8">
                        <VoiceInputPulse />
                        <AIFeatureCard />
                      </div>
                    </div>
                  </div>

                  {/* Category: Dashboards */}
                  <div>
                    <h4 className="font-bold text-xl mb-6 border-b pb-2">4. Dashboard Widgets</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <StatWidgetCard />
                      <ProgressWidget />
                      <StorageWidget />
                      <div className="md:col-span-2"><ActivityFeed /></div>
                      <div><QuickActionsWidget /></div>
                    </div>
                  </div>

                  {/* Category: Tables & Data */}
                  <div>
                    <h4 className="font-bold text-xl mb-6 border-b pb-2">5. Data Tables</h4>
                    <div className="space-y-8">
                      <DataTablePro />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InvoiceTable />
                        <LeaderboardTable />
                      </div>
                    </div>
                  </div>
                  
                  {/* Category: eCommerce */}
                  <div>
                    <h4 className="font-bold text-xl mb-6 border-b pb-2">6. eCommerce & Checkout</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-6">
                        <ProductGallery />
                        <div className="grid grid-cols-2 gap-6 p-6 border rounded-xl"><ColorSelector /><SizeSelector /></div>
                      </div>
                      <div className="space-y-6">
                        <OrderSummaryCard />
                        <CartDrawerItem />
                      </div>
                    </div>
                  </div>

                  {/* Category: Marketing */}
                  <div>
                    <h4 className="font-bold text-xl mb-6 border-b pb-2">7. Marketing & Conversion</h4>
                    <div className="space-y-12">
                      <AnimatedHeroText />
                      <div className="flex justify-center"><PricingToggle /></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <WaitlistForm />
                        <FeatureShowcase />
                      </div>
                      <StatCounter />
                    </div>
                  </div>

                </div>
              </div>
`;

code = code.replace('{/* Mega Pack Showcase */}', proSection + '\n              {/* Mega Pack Showcase */}');

fs.writeFileSync('apps/docs/app/page.tsx', code);
console.log('Added Pro Pack to Docs');

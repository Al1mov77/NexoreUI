const fs = require('fs');
let code = fs.readFileSync('apps/docs/app/page.tsx', 'utf-8');

// 1. Add to imports
const megaImports = `import { 
  NeonButton, ThreeDButton, RippleButton, CyberpunkButton, MagneticButton, ShimmerButton, BorderBeamButton, LoadingButton, DestructiveGlowButton, GhostOutlineButton,
  FloatingLabelInput, UnderlineInput, IconInputLeft, IconInputRight, PillInput, ErrorInput, SuccessInput, GhostInput, NeumorphicInput, MinimalDropInput,
  ImageCard, ProfileCard, ProductCard, ArticleCard, StatCardSimple, PricingCardBasic, WeatherCard, EventCard, TestimonialCardBasic, InteractiveCard,
  NotificationBadge, RibbonBadge, OutlineDotBadge, GradientOutlineBadge, IconBadge, FloatingBadge, ProgressBadge, StatusRingBadge, NeonOutlineBadge, TagLabel,
  WifiLoader, HourglassLoader, HeartbeatLoader, BoxLoader, BouncingBalls, GlowRingLoader, LineScaleLoader, ClockLoader, BatteryLoader, SquareSpinLoader,
  CyberAlert, SoftAlert, MinimalAlert, LeftBorderAlert, IconTopAlert, SolidAlert, ToastAlertWrapper, BannerAlert, CookieAlert, NeonAlert,
  StackAvatar, DottedAvatar, ShadowAvatar, PolymorphAvatar, GlassAvatar, AnimatedBorderAvatar, InitialsGradientAvatar, SquareAvatar, TooltipAvatar, PulseAvatar,
  SimpleNavbar, CenteredNavbar, GlassNavbar, FloatingNavbar, SidebarMenu, BottomNav, BreadcrumbTrail, StepIndicator, TabMenu, DropdownMenuVisual,
  CircularProgressCard, LineChartCard, BarChartCard, TrendStatCard, RankingList, ActivityHeatmap, RadarChartMock, GaugeMeter, SparklineStat, MetricGrid,
  FeatureGridX, HeroSectionX, FaqAccordionX, TeamSectionX, LogoCloudX, CTASectionX, ContactFormX, PricingCardsX, TestimonialSliderX, FooterX
} from "nexoreui"`;

code = code.replace('import { Button', megaImports + '\nimport { Button');

// 2. Add to MvpComponents array
if (!code.includes('{ name: "Mega Pack (100+)", id: "mega-pack" }')) {
  code = code.replace(
    'const MvpComponents = [',
    'const MvpComponents = [\n    { name: "Mega Pack (100+)", id: "mega-pack" },'
  );
}

// 3. Add showcase section
const megaSection = `
              {/* Mega Pack Showcase */}
              <div id="mega-pack" className={\`scroll-mt-20 \${activeTab === "mega-pack" ? "block" : "hidden"}\`}>
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold tracking-tight">Mega Pack (100 New Components)</h3>
                  <p className="text-sm text-muted-foreground">A massive collection of 100 newly added unique components across 10 categories.</p>
                </div>
                
                <div className="space-y-12">
                  {/* Category: Buttons */}
                  <div>
                    <h4 className="font-bold mb-4 border-b pb-2">10 Mega Buttons</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="flex justify-center"><NeonButton>Neon</NeonButton></div>
                      <div className="flex justify-center"><ThreeDButton>3D</ThreeDButton></div>
                      <div className="flex justify-center"><RippleButton>Ripple</RippleButton></div>
                      <div className="flex justify-center"><CyberpunkButton>Cyber</CyberpunkButton></div>
                      <div className="flex justify-center"><MagneticButton>Magnetic</MagneticButton></div>
                      <div className="flex justify-center"><ShimmerButton>Shimmer</ShimmerButton></div>
                      <div className="flex justify-center"><BorderBeamButton>Beam</BorderBeamButton></div>
                      <div className="flex justify-center"><LoadingButton isLoading={true}>Load</LoadingButton></div>
                      <div className="flex justify-center"><DestructiveGlowButton>Glow</DestructiveGlowButton></div>
                      <div className="flex justify-center"><GhostOutlineButton>Ghost</GhostOutlineButton></div>
                    </div>
                  </div>

                  {/* Category: Inputs */}
                  <div>
                    <h4 className="font-bold mb-4 border-b pb-2">10 Mega Inputs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FloatingLabelInput label="Floating Label" />
                      <UnderlineInput placeholder="Underline" />
                      <IconInputLeft placeholder="Search" />
                      <PillInput placeholder="Pill Input" />
                      <ErrorInput placeholder="Error" errorMessage="Invalid format" />
                      <SuccessInput placeholder="Success" defaultValue="Valid data" />
                      <GhostInput placeholder="Ghost Input" />
                      <NeumorphicInput placeholder="Neumorphic" />
                    </div>
                  </div>

                  {/* Category: Loaders */}
                  <div>
                    <h4 className="font-bold mb-4 border-b pb-2">10 Mega Loaders</h4>
                    <div className="flex flex-wrap justify-center gap-12 p-8 bg-muted/20 rounded-xl border">
                      <WifiLoader /> <HourglassLoader /> <HeartbeatLoader /> <BoxLoader /> <BouncingBalls />
                      <GlowRingLoader /> <LineScaleLoader /> <ClockLoader /> <BatteryLoader /> <SquareSpinLoader />
                    </div>
                  </div>

                  {/* Category: Badges */}
                  <div>
                    <h4 className="font-bold mb-4 border-b pb-2">10 Mega Badges</h4>
                    <div className="flex flex-wrap items-center gap-6">
                      <NotificationBadge count={5}><div className="w-10 h-10 bg-muted rounded-md" /></NotificationBadge>
                      <RibbonBadge text="NEW" />
                      <OutlineDotBadge text="Active" />
                      <GradientOutlineBadge text="Premium" />
                      <IconBadge text="Star" />
                      <FloatingBadge text="Floating" />
                      <ProgressBadge text="Loading" progress={70} />
                      <StatusRingBadge />
                      <NeonOutlineBadge text="Cyber" />
                      <TagLabel text="react" />
                    </div>
                  </div>
                  
                  {/* Category: Alerts */}
                  <div>
                    <h4 className="font-bold mb-4 border-b pb-2">10 Mega Alerts (Sample)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CyberAlert title="System Failure" description="Core temp critical." />
                      <SoftAlert title="Info" description="Your data is saved." />
                      <MinimalAlert text="Processing..." />
                      <LeftBorderAlert title="Success" description="Action completed." />
                      <SolidAlert title="Notice" description="Maintenance tonight." />
                      <NeonAlert title="Achievement" description="Level up!" />
                    </div>
                  </div>
                  
                  {/* Category: Stats & Data */}
                  <div>
                    <h4 className="font-bold mb-4 border-b pb-2">10 Mega Stats/Charts (Sample)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <CircularProgressCard value={85} />
                      <TrendStatCard title="Revenue" value="$45,200" trend="up" />
                      <GaugeMeter value={92} />
                      <SparklineStat />
                      <MetricGrid />
                    </div>
                  </div>
                </div>
              </div>
`;

code = code.replace('{/* Component Showcase Section */}', megaSection + '\n              {/* Component Showcase Section */}');

fs.writeFileSync('apps/docs/app/page.tsx', code);
console.log('Added Mega Pack to Docs');

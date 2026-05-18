const fs = require('fs');
let code = fs.readFileSync('apps/docs/app/page.tsx', 'utf-8');

const injections = {
  'button': `
                  <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Buttons</h4>
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
  `,
  'input': `
                  <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Inputs</h4>
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
                  <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Pro Forms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <LoginFormPro />
                    <PaymentFormPro />
                    <ProfileSettingsForm />
                    <FileUploadForm />
                  </div>
  `,
  'card': `
                  <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Cards</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileCard name="Alex Doe" role="Designer" />
                    <WeatherCard city="New York" temp={72} condition="Sunny" />
                    <EventCard title="Tech Summit" date="Oct 24" location="Online" />
                  </div>
                  <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">eCommerce Cards</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProductGallery />
                    <div className="space-y-4"><OrderSummaryCard /><CartDrawerItem /></div>
                  </div>
  `,
  'data-display': `
                  <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Pro Tables</h4>
                  <div className="space-y-8">
                    <DataTablePro />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InvoiceTable />
                      <LeaderboardTable />
                    </div>
                  </div>
                  <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Dashboards</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatWidgetCard />
                    <ProgressWidget />
                    <StorageWidget />
                    <div className="md:col-span-2"><ActivityFeed /></div>
                    <div><QuickActionsWidget /></div>
                  </div>
  `,
  'alert': `
                  <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Alerts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CyberAlert title="System Failure" description="Core temp critical." />
                    <SoftAlert title="Info" description="Your data is saved." />
                    <MinimalAlert text="Processing..." />
                    <LeftBorderAlert title="Success" description="Action completed." />
                    <SolidAlert title="Notice" description="Maintenance tonight." />
                    <NeonAlert title="Achievement" description="Level up!" />
                  </div>
  `,
  'navigation': `
                  <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Navigation</h4>
                  <div className="space-y-8">
                    <CenteredNavbar />
                    <GlassNavbar />
                    <FloatingNavbar />
                  </div>
  `,
  'progress': `
                  <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Loaders</h4>
                  <div className="flex flex-wrap items-center gap-12 p-8 bg-muted/20 rounded-xl border">
                    <WifiLoader /> <HourglassLoader /> <HeartbeatLoader /> <BoxLoader /> <BouncingBalls />
                    <GlowRingLoader /> <LineScaleLoader /> <ClockLoader /> <BatteryLoader /> <SquareSpinLoader />
                  </div>
  `
};

// 1. Remove Mega Pack and Pro Pack from MvpComponents
code = code.replace('{ name: "Mega Pack (100+)", id: "mega-pack" },', '');
code = code.replace('{ name: "Pro Pack (100+)", id: "pro-pack" },', '');

// 2. Remove Mega Pack and Pro Pack showcase sections completely
const removeShowcase = (startComment, endComment) => {
  const start = code.indexOf(startComment);
  if (start === -1) return;
  // find the NEXT occurrence of the same comment, which should be the end comment
  const end = code.indexOf(startComment, start + 1);
  if (end !== -1) {
    code = code.substring(0, start) + code.substring(end + startComment.length);
  }
};
removeShowcase('{/* Mega Pack Showcase */}');
removeShowcase('{/* Pro Pack Showcase */}');


// 3. Inject into existing sections.
// E.g. find:
// <div id="button" className={\`scroll-mt-20 \${activeTab === "button" ? "block" : "hidden"}\`}>
// ...
// </div>
// We can find `</div>` right before the next `<div id="`

const sectionIds = Object.keys(injections);
const sections = code.split(/(?=<div id=")/);

const newSections = sections.map(section => {
  let matchedId = null;
  for (const id of sectionIds) {
    if (section.startsWith('<div id="' + id + '"')) {
      matchedId = id;
      break;
    }
  }

  if (matchedId) {
    // Inject just before the LAST </div> in this section block.
    const lastDivIndex = section.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
      return section.substring(0, lastDivIndex) + injections[matchedId] + '\\n' + section.substring(lastDivIndex);
    }
  }
  return section;
});

fs.writeFileSync('apps/docs/app/page.tsx', newSections.join(''));
console.log('Done refactoring page.tsx');

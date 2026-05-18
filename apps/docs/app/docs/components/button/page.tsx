export default function ButtonDocs() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Button</h1>
      <p className="text-gray-400 text-lg mb-8">
        A versatile button component with multiple variants, sizes, and support for icons.
      </p>

      <div className="glass-effect p-8 rounded-2xl mb-8">
        <h2 className="text-xl font-bold mb-4">Usage</h2>
        <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
          <code>{`import { Button } from 'nexoreui';

export default function App() {
  return <Button>Click me</Button>;
}`}</code>
        </pre>
      </div>

      <div className="glass-effect p-8 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Examples</h2>
        <p className="text-gray-400 mb-4">Examples will appear here once the component is implemented.</p>
      </div>
    </div>
  );
}

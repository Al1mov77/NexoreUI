import { generateReactCode, generateVueCode, generateHTMLCode } from './apps/docs/app/nexoremake/utils/codeGenerator';

const elements = [
  {
    id: "1",
    type: "icon",
    iconName: "Heart",
    position: { x: 0, y: 0 },
    size: { width: 50, height: 50 },
    zIndex: 1,
    styles: { fontSize: "32px", color: "red" }
  },
  {
    id: "2",
    type: "icon",
    iconName: "Heart",
    position: { x: 50, y: 0 },
    size: { width: 50, height: 50 },
    zIndex: 2,
    styles: { fontSize: "24px", color: "blue" }
  }
];

const settings = { width: 500, height: 500, backgroundColor: "#000" };

console.log('--- REACT ---');
console.log(generateReactCode(elements, settings));
console.log('\n--- VUE ---');
console.log(generateVueCode(elements, settings));
console.log('\n--- HTML ---');
console.log(generateHTMLCode(elements, settings));

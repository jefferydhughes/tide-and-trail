import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { forest:'#18352C', fundy:'#244D5C', sand:'#D9C8A5', fog:'#E9E7DF', rust:'#B45D3C', ink:'#15231F' }, fontFamily: { sans:['Arial','Helvetica','sans-serif'], display:['Georgia','Times New Roman','serif'] }, boxShadow:{soft:'0 20px 60px rgba(24,53,44,.12)'} } },
  plugins: []
};
export default config;

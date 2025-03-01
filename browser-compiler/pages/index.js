import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ height: '50px', background: 'black', color: 'white', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
        <select defaultValue="javascript">
          <option value="javascript">JavaScript</option>
        </select>
        <button style={{ marginLeft: '10px', background: 'green', color: 'white' }}>Run</button>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <Editor height="100%" width="50%" defaultLanguage="javascript" />
        <div style={{ width: '50%', background: '#f0f0f0' }}>Output will go here</div>
      </div>
    </div>
  );
}